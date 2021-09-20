import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'

export const AdminCreateCompetitionPage = () => {
    const [form, setForm] = useState({
        competitionName: '', competitionPlace: '', competitionDate: { from: '', to: '' }
    })
    const { loading, error, clearError, request } = useHttp()
    const { errorModal, successModal } = useModal()

    const submitHandler = async () => {
        try {
            const { message } = await request('/api/competitions/create-competition', 'POST', form)
            successModal(message)
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
        <div className="container p-0">
            { loading && <Loader /> }
            <h4 className="p-2">Создание мероприятия</h4>
            <div className="row mt-sm-5 border border-primary rounded p-3 col-12 col-sm-8 m-0">
                <div className="col-12">
                    <label className="col-12 mb-2">
                        <span className="ms-2 text-primary">Название мероприятия</span>
                        <input className="form-control"
                            name="competitionName"
                            value={form.competitionName}
                            onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}/>
                    </label>
                    <label className="col-12 mb-2">
                        <span className="ms-2 text-primary">Место проведения</span>
                        <input className="form-control"
                            name="competitionPlace"
                            value={form.competitionPlace}
                            onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}/>
                    </label>
                    <div className="row g-3">
                        <label className="col-12 col-sm-6 mb-2">
                            <span className="ms-2 text-primary">Дата начала</span>
                            <input className="form-control"
                                type="date"
                                name="from"
                                value={form.competitionDate.from}
                                onChange={event => setForm(state => ({...state, competitionDate: { ...state.competitionDate, [event.target.name]: event.target.value}}))}
                            />
                        </label>
                        <label className="col-12 col-sm-6 mb-2">
                            <span className="ms-2 text-primary">Дата окончания</span>
                            <input className="form-control"
                                type="date"
                                name="to"
                                value={form.competitionDate.to}
                                onChange={event => setForm(state => ({...state, competitionDate: { ...state.competitionDate, [event.target.name]: event.target.value}}))}
                            />
                        </label>
                    </div>
                </div>
            </div>
             <div className="row justify-content-around my-5 col-12 col-sm-8">
                <button className="btn btn-primary col-auto" onClick={submitHandler}>Готово</button>
                <NavLink to="/admin/competitions" className="btn btn-primary col-auto">Отмена</NavLink>
            </div>
        </div>
    )
}