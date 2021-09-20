import React, { useEffect, useRef, useState } from 'react'
import { CompetitionCard } from '../components/CompetitionCard'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { useHttp } from '../hooks/http.hook'

export const AdminPage = () => {
    const [competitionInfo, setCompetitionInfo] = useState([])
    const [pole, setPole] = useState(true)
    const { request, loading, error, clearError } = useHttp()
    const timeoutId = useRef()
    const initFetch = useRef(true)

    const navLinks = [
        { title: 'Мероприятия', to: '/admin/competitions' },
        { title: 'Пользователи', to: '/admin/users' }
    ]

    useEffect(() => {
        const getInfo = async () => {
            try {
                const info = await request('/api/competitions/get-currrent-info')
                initFetch.current = false
                setCompetitionInfo(info)
            }
            catch {}
        }
        if ( !loading && pole ) {
            setPole(false)
            timeoutId.current = setTimeout(() => setPole(true), 10000)
            getInfo()
        }
        return () => clearTimeout(timeoutId.current)
    }, [request, loading, pole])

    useEffect(() => {
        if ( error ) {
            console.log(error)
            clearError()
        }
    }, [error, clearError])

    return (
        <div className="container-fluid min-vh-100">
            { ((initFetch.current === true) && loading) && <Loader /> }
            <Navbar links={navLinks} />
            <h5 className="m-4">Название мероприятия</h5>
            <div className="row g-3">
                {
                    competitionInfo.map(({name, parts}, index) => (
                        <div className="col-12 col-sm-3">
                            <CompetitionCard name={name} parts={parts} key={index} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}