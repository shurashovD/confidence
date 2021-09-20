import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import avatarPLug from '../img/man.svg'
import { Loader } from '../components/Loader'
import { useModal } from '../hooks/modal.hook'
import { useDispatch, useSelector } from 'react-redux'
import { setUserId } from '../redux/adminSlice'

export const AdminEditUserPage = () => {
    const { adminState } = useSelector(state => state)
    const dispatch = useDispatch()
    const [avatar, setAvatar] = useState(avatarPLug)
    const [form, setForm] = useState({login: '', name: '', id: null})
    const file = useRef()
    const { sendFormData, loading, error, clearError, getFile, request } = useHttp()
    const { successModal, errorModal } = useModal()

    const getAvatar = useCallback( async path => {
        try {
            file.current = await getFile(path)
            if ( file.current ) {
                const url = URL.createObjectURL(file.current)
                setAvatar(url)
            }
            else {
                setAvatar(avatarPLug)
            }
        }
        catch {}
    }, [getFile])

    const getUser = useCallback( async id => {
        try {
            const { _id, login, name, avatar } = await request('/api/users/get-user-by-id', 'POST', { id })
            setForm(state => ({...state, id: _id, login: login ?? '', name: name ?? ''}))
            if ( avatar ) {
                getAvatar(avatar)
            }
        }
        catch {}
    }, [request, getAvatar])

    const fileInputHandler = event => {
        file.current = event.target.files[0]
        if ( file.current ) {
            const url = URL.createObjectURL(file.current)
            setAvatar(url)
        }
        else {
            setAvatar(avatarPLug)
        }
    }

    const submitHandler = async () => {
        try {
            const { message } = await sendFormData('/api/users/edit-user', form, [{avatar: file.current}])
            successModal(message)
        }
        catch {}
    }

    useEffect(() => {
        if (adminState?.userId && !form.id) {
            getUser(adminState.userId)
        }
    }, [adminState, getUser, form])

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    useEffect(() => {
        return () => dispatch(setUserId(null))
    }, [dispatch])

    return (
        <div className="container">
            { loading && <Loader /> }
            <h4 className="p-2">Редактирование пользователя</h4>
            <div className="row align-items-center mt-sm-5 border border-primary rounded p-3 col-12 col-sm-8 m-0">
                <div className="col-12 col-sm-5">
                    <div className="row h-100 align-items-stretch">
                        <div className="col-12">
                            <img src={avatar} width="100%" className="rounded p-1" alt="avatar" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-7">
                    <label className="col-12 mb-2">
                        <span className="ms-2 text-primary">Имя</span>
                        <input className="form-control"
                            name="name"
                            value={form.name}
                            onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}/>
                    </label>
                    <label className="col-12 mb-2">
                        <span className="ms-2 text-primary">Логин</span>
                        <input className="form-control"
                            name="login"
                            value={form.login}
                            onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}/>
                    </label>
                    <label className="col-12 mb-2">
                        <span className="ms-2 text-primary">Фото</span>
                        <div className="row justify-content-between border border-primary rounded m-auto p-2">
                            <label className="btn btn-primary col-12 col-sm-auto mb-2 mb-sm-0">
                                Добавить
                                <input type="file" className="d-none" accept="image/jpeg" onInput={fileInputHandler} />
                            </label>
                            <button className="btn btn-primary col-12 col-sm-auto" onClick={() => setAvatar(avatarPLug)}>
                                Удалить
                            </button>
                        </div>
                    </label>
                </div>
            </div>
            <div className="row justify-content-around my-5 col-12 col-sm-8">
                <button className="btn btn-primary col-auto" onClick={submitHandler}>Готово</button>
                <NavLink to="/admin/users" className="btn btn-primary col-auto">Отмена</NavLink>
            </div>
        </div>
    )
}