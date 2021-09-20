import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'
import { setCompetitionId } from '../redux/adminSlice'
import { COMPETITION_STATUS_CREATED, COMPETITION_STATUS_FINISHED, COMPETITION_STATUS_PUBLISHED, COMPETITION_STATUS_STARTED } from '../redux/competitionTypes'

export const AdminCompetitionsPage = () => {
    const [competitions, setCompetitions] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()
    const { request, loading, error, clearError } = useHttp()
    const { errorModal } = useModal()

    const links = [
        {title: 'Главная', to: "/admin"},
        {title: 'Создать', to: "/admin/competitions/create"}
    ]

    const getCompetitions = useCallback( async () => {
        try {
            const response = await request('/api/competitions/get-all-competitions')
            setCompetitions(response)
        }
        catch {}
    }, [request])


    const editComp = id => {
        dispatch(setCompetitionId(id))
        history.push('/admin/competitions/edit')
    }

    const removeComp = async id => {
        try {
            await request('/api/competitions/remove-competition', 'POST', { id })
            getCompetitions()
        }
        catch {}
    }

    useEffect(getCompetitions, [getCompetitions])

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    return (
        <div className="container p-0">
            { loading && <Loader /> }
            <Navbar links={links} />
            { (competitions.length === 0)  && <h4 className="p-2">Мероприятия не зарегистрированы</h4>}
            { (competitions.length > 0)  && <h4 className="p-2">Мероприятия</h4>}
            <table className="table table-responsive container align-middle">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Место</th>
                        <th>Начало</th>
                        <th>Конец</th>
                        <th>Статус</th>
                        <th>Изменить</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                {
                    competitions.map(({competitionName, competitionPlace, competitionDate, status, _id}) => (
                        <tr key={_id}>
                            <td>{competitionName}</td>
                            <td>{competitionPlace}</td>
                            <td>{competitionDate.from.split('T')[0]}</td>
                            <td>{competitionDate.to.split('T')[0]}</td>
                            <td>
                                { status === COMPETITION_STATUS_CREATED && <span className="rounded p-2 bg-primary">Создано</span> }
                                { status === COMPETITION_STATUS_STARTED && <span className="rounded p-2 bg-danger text-white">Запущено</span> }
                                { status === COMPETITION_STATUS_FINISHED && <span className="rounded p-2 bg-warning text-white">Завершено</span> }
                                { status === COMPETITION_STATUS_PUBLISHED && <span className="rounded p-2 bg-secondary">Опубликовано</span> }
                            </td>
                            <td>
                                <button
                                    className="btn-sm btn-warning text-white"
                                    data-competition-id={_id}
                                    onClick={event => editComp(event.target.getAttribute('data-competition-id'))}
                                >
                                    Настроить
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn-sm btn-warning text-white"
                                    data-competition-id={_id}
                                    onClick={event => removeComp(event.target.getAttribute('data-competition-id'))}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}