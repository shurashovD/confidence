import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import avatarPLug from '../img/man.svg'
import { Loader } from '../components/Loader'
import { useModal } from '../hooks/modal.hook'

export const AdminCreateUserPage = () => {
    const [avatar, setAvatar] = useState(avatarPLug)
    const [form, setForm] = useState({login: '', name: '', pass: ''})
    const file = useRef()
    const { sendFormData, loading, error, clearError } = useHttp()
    const { successModal, errorModal } = useModal()

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
            await sendFormData('/api/users/new-user', form, [{avatar: file.current}])
            successModal('Пользователь создан')
        }
        catch {}
    }

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    return (
        <div className="container">
            { loading && <Loader /> }
            <h4 className="p-2">Создание пользователя</h4>
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
                        <span className="ms-2 text-primary">Пароль</span>
                        <input className="form-control"
                            name="pass"
                            value={form.pass}
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