import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Promo } from '../components/Promo'
import { useDictionary } from '../hooks/dictionary.hook'
import { useHttp } from '../hooks/http.hook'
import logo from '../img/logo.png'

export const ScreenPage = () => {
    const page = useRef(0)
    const [pole, setPole] = useState(true)
    const [result, setResult] = useState([])
    const timeoutId = useRef()
    const initFetch = useRef(true)

    const { auth } = useSelector(state => state)
    const { request, loading } = useHttp()
    const {dg} = useDictionary()

    useEffect(() => {
        const getResult = async () => {
            try {
                const response = await request('/api/notes/get-result', 'POST', { screenId: auth.id })
                initFetch.current = false
                if ( response.result.length > 0 ) {
                    if ( page.current * 5 >= response.result.length ) {
                        page.current = 0
                    }
                    else {
                        page.current += 1
                    }
                }
                else {
                    page.current = 0
                }
                setResult(response)
            }
            catch(e) {
                console.log(e);
            }
        }
        if ( !loading && pole ) {
            setPole(false)
            timeoutId.current = setTimeout(() => setPole(true), 35 * 1000)
            getResult()
        }
    }, [request, loading, pole, auth])

    return (
        <div className="container-fluid overflow-hidden">
            { page.current === 0 && <Promo /> }
            <div className="row justify-content-center p-1">
                <img src={logo} width="359" alt="confidence" style={{ width: '359px' }} />
                <p className="text-primary text-center fs-4 mb-3">
                    {dg(result.final ? 'resultOfContest' : 'intermediateResultOfCompetition')} <span style={{textTransform: 'uppercase'}}>"{dg(result?.category)}"</span>
                </p>
                <div className="row p-1 rounded bg-primary align-items-center text-center mb-1">
                    <p className="col-1">{dg('place')}</p>
                    <p className="col-10">{dg('points')}</p>
                    <p className="col-1">{dg('totalPoints')}</p>
                </div>
                {
                    result.result?.map(({noteId, name, scores, total}, index) => {
                        const place = index + 1
                        if ( (place > (page.current - 1) * 5) && (place <= (page.current * 5)) ) {
                            return (
                                <div className="row p-0 border border-primary rounded align-items-stretch text-center mb-1 text-primary" key={noteId}>
                                    <p className="col-1 border-end border-primary d-flex justify-content-center align-items-center fs-4">{place}</p>
                                    <div className="col-10">
                                        <div className="row align-items-stretch justify-content-start p-0"> 
                                            <span className="fs-4 border-end border-primary col" style={{ lineHeight: '2.5rem' }}>
                                                {name}
                                            </span>
                                            {
                                                scores.map(({name, value}, index) => (
                                                    <div className="border-end border-primary d-flex flex-column justify-content-center align-items-center col" key={`${noteId}_${index}`}>
                                                        <p className="fs-5">{name}</p>
                                                        <p className="fs-5">{value}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <p className="col-1 d-flex justify-content-center align-items-center fs-4">{total}</p>
                                </div>
                            )
                        }
                        return <></>
                    })
                }
            </div>
        </div>
    )
}