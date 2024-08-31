import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'
import { useDictionary } from '../hooks/dictionary.hook'
import { COMPETITION_ROLE_HYHIENICAL, COMPETITION_ROLE_PHOTO, COMPETITION_ROLE_REFEREE, COMPETITION_ROLE_REGISTER, COMPETITION_STATUS_CREATED, COMPETITION_STATUS_FINISHED, COMPETITION_STATUS_PUBLISHED, COMPETITION_STATUS_STARTED } from '../redux/competitionTypes'
import { CATEGORY_TYPE_ARROW, CATEGORY_TYPE_FEATHERING, CATEGORY_TYPE_HAIR_TECHNOLOGY, CATEGORY_TYPE_LIPS, CATEGORY_TYPE_MICROBLADING } from '../redux/categoryTypes'

export const AdminEditCompetitionPage = () => {
    const { adminState } = useSelector(state => state)
    const [form, setForm] = useState({
        id: null, competitionName: '', status: COMPETITION_STATUS_CREATED, refereeSetting: [], screens: []
    })
    const [inputValues, setInputValues] = useState([])
    const [dropdown, setDropdown] = useState({})
    const [screenDropdown, setScreenDropdown] = useState([])
    const [screenInput, setScreenInput] = useState('')
    const loaderBlock = useRef(false)
    const { loading, error, clearError, request } = useHttp()
    const { errorModal } = useModal()
    const { dg } = useDictionary()

    const getCompetition = useCallback( async id => {
        try {
            const { _id, competitionName, status, refereeSetting, screens } = await request('/api/competitions/get-competition-by-id', 'POST', { id })
            setInputValues(refereeSetting.map(({category}) => ({category, value: ''})))
            setForm(state => ({...state, id: _id, competitionName, status, refereeSetting, screens}))
        }
        catch {}
    }, [request])

    const privateCheckboxHandler = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const category = event.target.getAttribute('data-category')
        const competitionId = form.id
        const hide = event.target.checked
        try {
            await request('/api/competitions/settings-hide-referee', 'POST', { category, userId, competitionId, hide })
            getCompetition(competitionId)
        }
        catch {}
    }

    const removeReferee = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const category = event.target.getAttribute('data-category')
        const competitionId = form.id
        try {
            await request('/api/competitions/remove-user-from-settings', 'POST', { category, userId, competitionId })
            getCompetition(competitionId)
        }
        catch {}
    }

    const stateChangeHandler = async event => {
        const status = event.target.value
        const competitionId = form.id
        try {
            await request('/api/competitions/settings-set-state', 'POST', { status, competitionId })
            getCompetition(competitionId)
        }
        catch {}
    }

    const addInputHandler = async event => {
        const category = event.target.getAttribute('data-category')
        setInputValues(state => state.map(item => (item.category === category) ? { category, value: event.target.value } : item))
        loaderBlock.current = true
        setDropdown(state => ({...state, [category]: [{name: <div className="spinner-border text-primary" />}]}))
        try {
            const response = await request('/api/users/get-user-by-name-fragment', 'POST', { fragment: event.target.value })
            const refereeIdsByCategory = form.refereeSetting.find(item => item.category === category).referees.map(({_id}) => _id)
            const referenses = response.filter(({_id}) => refereeIdsByCategory.every(item => item !== _id))
            loaderBlock.current = false
            setDropdown(state => ({...state, [category]: referenses}))
        }
        catch {
            loaderBlock.current = false
            setDropdown(state => ({...state, [category]: []}))
        }
        
    }

    const dropdownClickHandler = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const category = event.target.getAttribute('data-category')
        setDropdown(state => ({...state, [category]: []}))
        const competitionId = form.id
        try {
            await request('/api/competitions/add-user-to-settings', 'POST', { category, userId, competitionId })
            setInputValues(state => state.map(item => (item.category === category) ? { category, value: '' } : item))
            getCompetition(competitionId)
        }
        catch {}
    }

    const roleChangeHandler = async event => {
        try {
            const userId = event.target.getAttribute('data-user-id')
            const category = event.target.getAttribute('data-category')
            const competitionId = form.id
            const role = event.target.value
            await request('/api/competitions/settings-set-role', 'POST', { category, userId, competitionId, role })
            getCompetition(competitionId)
        }
        catch {}
    }

    const categoryChangeHandler = async event => {
        try {
            const userId = event.target.getAttribute('data-user-id')
            const competitionId = form.id
            const category = event.target.value
            if ( category === 'null' ) {
                await request('/api/competitions/settings-set-screen-category', 'POST', { userId, competitionId })
            } else {
                await request('/api/competitions/settings-set-screen-category', 'POST', { category, userId, competitionId })
            }
            getCompetition(competitionId)
        }
        catch {}
    }

    const finalCheckboxHandler = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const competitionId = form.id
        const final = event.target.checked
        try {
            await request('/api/competitions/settings-set-screen-final', 'POST', { userId, competitionId, final })
            getCompetition(competitionId)
        }
        catch {}
    }

    const topCheckboxHandler = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const competitionId = form.id
        const top = event.target.checked
        try {
            await request('/api/competitions/settings-set-screen-top', 'POST', { userId, competitionId, top })
            getCompetition(competitionId)
        }
        catch {}
    }

    const removeScreen = async event => {
        const userId = event.target.getAttribute('data-user-id')
        const competitionId = form.id
        try {
            await request('/api/competitions/remove-screen-from-settings', 'POST', { userId, competitionId })
            getCompetition(competitionId)
        }
        catch {}
    }

    const screenInputHandler = async event => {
        setScreenInput(event.target.value)
        loaderBlock.current = true
        setScreenDropdown([{name: <div className="spinner-border text-primary" />}])
        try {
            const response = await request('/api/users/get-user-by-name-fragment', 'POST', { fragment: event.target.value })
            const screenIds = form.screens?.map(({screenId}) => screenId.toString()) ?? []
            const referenses = response.filter(({_id}) => screenIds.every(item => item.toString() !== _id.toString()))
            loaderBlock.current = false
            setScreenDropdown(referenses)
        }
        catch {
            loaderBlock.current = false
            setScreenDropdown([])
        }
        
    }

    const screenDropdownClickHandler = async event => {
        const userId = event.target.getAttribute('data-user-id')
        setScreenDropdown([])
        const competitionId = form.id
        try {
            await request('/api/competitions/add-user-to-screens', 'POST', { userId, competitionId })
            setScreenInput('')
            getCompetition(competitionId)
        }
        catch {}
    }

    useEffect(() => {
        getCompetition(adminState.competitionId)
    }, [adminState.competitionId, getCompetition])

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])
    
    return (
        <div className="container p-0">
            { loading && !loaderBlock.current && <Loader /> }
            <h4 className="p-2">Настройка мероприятия {form.competitionName}</h4>
            <div className="mt-sm-5 border border-primary rounded p-3 col-12 col-sm-8 m-0 p-5">
                <div className="row p-0 mb-5">
                    <label className="col-12 mb-2">
                        <h5 className="ms-2 text-primary">Статус</h5>
                        <select
                            name="status" value={form.status} defaultValue={form.status} className="form-select"
                            onChange={stateChangeHandler}
                        >
                            <option value={COMPETITION_STATUS_CREATED}>Создано</option>
                            <option value={COMPETITION_STATUS_STARTED}>Запущено</option>
                            <option value={COMPETITION_STATUS_FINISHED}>Завершено</option>
                            <option value={COMPETITION_STATUS_PUBLISHED}>Опубликовано</option>
                        </select>
                    </label>
                </div>
                <div className="row mt-3">
                    <h5 className="ms-2 text-primary">Настройка судей</h5>
                    {
                        form.refereeSetting.map(({category, referees}) => (
                            <div className="mb-4" key={category}>
                                <table className="table align-middle caption-top text-primary">
                                    <caption className="text-primary">{dg(category)}</caption>
                                    { referees.length > 0 &&
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th scope="col">Имя</th>
                                                <th scope="col">Логин</th>
                                                <th scope="col">Роль</th>
                                                <th scope="col">Скрытый</th>
                                                <th scope="col">Удалить</th>
                                            </tr>
                                        </thead>
                                    }
                                    <tbody>
                                        {
                                            referees.map(({_id, avatar, name, login, role, hide}, index) => {
                                                return (
                                                    <tr key={_id + index}>
                                                        <td>
                                                            <img src={avatar} alt="avatar" width="75" className="rounded" />
                                                        </td>
                                                        <td>{name}</td>
                                                        <td>{login}</td>
                                                        <td>
                                                            <select
                                                                name="role" className="form-select"
                                                                value={role}
                                                                onChange={roleChangeHandler}
                                                                data-user-id={_id}
                                                                data-category={category}
                                                            >
                                                                <option value={COMPETITION_ROLE_REGISTER}>Регистратор</option>
                                                                <option value={COMPETITION_ROLE_PHOTO}>Фотограф</option>
                                                                <option value={COMPETITION_ROLE_HYHIENICAL}>Гигиенист</option>
                                                                <option value={COMPETITION_ROLE_REFEREE}>Судья</option>
                                                            </select>
                                                        </td>
                                                        <td className="text-center">
                                                            <input className="form-check-input" type="checkbox" data-user-id={_id} data-category={category}
                                                                checked={hide}
                                                                onChange={privateCheckboxHandler}
                                                            />
                                                        </td>
                                                        <td>
                                                            <button className="btn-sm btn-warning text-white" data-user-id={_id} data-category={category}
                                                                onClick={removeReferee}
                                                            >
                                                                Удалить
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="row border border-primary rounded align-items-center p-2">
                                    <div className="col-8 p-0">
                                        <input
                                            className={"form-control col-3 " + ((dropdown[category]?.length > 0) && "rounded-0 rounded-top")}
                                            data-category={category}
                                            onChange={addInputHandler}
                                            value={inputValues.find(item => item.category === category).value}
                                        />
                                        <div className="w-100 position-relative">
                                            <ul className="position-absolute bg-secondary list-group rounded-0 rounded-bottom w-100">
                                                {
                                                    dropdown[category]?.map(({_id, name}, index) => (
                                                        <li
                                                            className="dropdown-item" data-user-id={_id} data-category={category} key={category + index}
                                                            onClick={dropdownClickHandler}
                                                        >
                                                            {name}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="row mt-3">
                    <h5 className="ms-2 text-primary">Настройка экранов</h5>
                    <div className="mb-4">
                        <table className="table align-middle text-primary">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th scope="col">Имя</th>
                                    <th scope="col">Логин</th>
                                    <th scope="col">Категория</th>
                                    <th scope="col">Финал</th>
                                    <th scope="col">Топ</th>
                                    <th scope="col">Удалить</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                form.screens?.map(({screenId, avatar, name, login, category, final, top}) => (
                                    <tr key={screenId}>
                                        <td>
                                            <img src={avatar} alt="avatar" width="75" className="rounded" />
                                        </td>
                                        <td>{name}</td>
                                        <td>{login}</td>
                                        <td>
                                            <select
                                                name="category" className="form-select"
                                                value={category}
                                                onChange={categoryChangeHandler}
                                                data-user-id={screenId}
                                            >
                                                <option value="null">OFF</option>
                                                <option value={CATEGORY_TYPE_FEATHERING}>{dg(CATEGORY_TYPE_FEATHERING)}</option>
                                                <option value={CATEGORY_TYPE_ARROW}>{dg(CATEGORY_TYPE_ARROW)}</option>
                                                <option value={CATEGORY_TYPE_LIPS}>{dg(CATEGORY_TYPE_LIPS)}</option>
                                                <option value={CATEGORY_TYPE_MICROBLADING}>{dg(CATEGORY_TYPE_MICROBLADING)}</option>
                                                <option value={CATEGORY_TYPE_HAIR_TECHNOLOGY}>{dg(CATEGORY_TYPE_HAIR_TECHNOLOGY)}</option>
                                            </select>
                                        </td>
                                        <td className="text-center">
                                            <input className="form-check-input" type="checkbox" data-user-id={screenId}
                                                checked={final}
                                                onChange={finalCheckboxHandler}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <input className="form-check-input" type="checkbox" data-user-id={screenId}
                                                checked={top}
                                                onChange={topCheckboxHandler}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn-sm btn-warning text-white" data-user-id={screenId}
                                                onClick={removeScreen}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        <div className="row border border-primary rounded align-items-center p-2">
                            <div className="col-8 p-0">
                                <input
                                    className={"form-control col-3 " + ((screenDropdown.length > 0) && "rounded-0 rounded-top")}
                                    onChange={screenInputHandler}
                                    value={screenInput}
                                />
                                <div className="w-100 position-relative">
                                    <ul className="position-absolute bg-secondary list-group rounded-0 rounded-bottom w-100">
                                        {
                                            screenDropdown.map(({_id, name}) => (
                                                <li
                                                    className="dropdown-item" data-user-id={_id} key={`screen_${_id}`}
                                                    onClick={screenDropdownClickHandler}
                                                >
                                                    {name}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <div className="row my-5 col-12 col-sm-8">
                <NavLink to="/admin/competitions" className="btn btn-primary col-auto ms-auto">Назад</NavLink>
            </div>
        </div>
    )
}