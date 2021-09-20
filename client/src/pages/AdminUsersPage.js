import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'
import avatarPLug from '../img/man.svg'
import { setUserId } from '../redux/adminSlice'

export const AdminUsersPage = () => {
    const [users, setUsers] = useState([])
    const { request, loading, error, clearError } = useHttp()
    const { errorModal } = useModal()
    const dispatch = useDispatch()
    const hystory = useHistory()

    const links = [
        {title: 'Главная', to: "/admin"},
        {title: 'Создать', to: "/admin/users/create"}
    ]

    const getUsers = useCallback(async () => {
        try {
            const result = await request('/api/users/get-users')
            setUsers(result)
        }
        catch {}
    }, [request])

    const editUser = async id => {
        dispatch(setUserId(id))
        hystory.push('/admin/users/edit')
    }

    const removeUser = async id => {
        try {
            await request('/api/users/remove-user', 'POST', { id })
            getUsers()
        }
        catch {}
    }

    useEffect(getUsers, [getUsers])

    useEffect(() => {
        if (error) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    return (
        <div className="container p-0">
            { loading && <Loader /> }
            <Navbar links={links} />
            <h4 className="p-2">Пользователи</h4>
            <table className="table table-responsive container align-middle">
                <thead>
                    <tr>
                        <th>Аватар</th>
                        <th>Имя</th>
                        <th>Логин</th>
                        <th>Изменить</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                        {
                            users.map(({avatar, name, login, _id}) => (
                                <tr key={_id}>
                                    <td>
                                        <img src={avatar ?? avatarPLug} alt="avatar" width="75" className="rounded" />
                                    </td>
                                    <td>{name}</td>
                                    <td>{login}</td>
                                    <td>
                                        <button
                                            className="btn-sm btn-warning text-white"
                                            data-user-id={_id}
                                            onClick={event => editUser(event.target.getAttribute('data-user-id'))}
                                        >
                                            Изменить
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-sm btn-warning text-white"
                                            data-user-id={_id}
                                            onClick={event => removeUser(event.target.getAttribute('data-user-id'))}
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