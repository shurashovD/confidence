import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Promo } from '../components/Promo'
import { useDictionary } from '../hooks/dictionary.hook'
import { useHttp } from '../hooks/http.hook'
import logo from '../img/logo.png'

export const ScreenPage = () => {
    const page = useRef(0)
    const [pole, setPole] = useState(true)
    const [result, setResult] = useState({ result: [], top: false, final: false, referees: [] })
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
                    // для гала ужина;
                    if ( response.top ) {
                        page.current = 1
                        setResult(response)
                        return
                    }
                    
                    // для обычной работы;
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
            timeoutId.current = setTimeout(() => setPole(true), 10 * 1000)
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
                    <p className="col-8 offset-2">
                        <div className="row align-items-center justify-content-center p-0 h-100">
                        {
                            result.referees.map((item, index) => (
                                <div
                                    className="d-flex justify-content-center align-items-center h-100"
                                    key={`referee_${index}`}
                                    style={{ width: `${100 / result.referees.length}%` }}
                                >
                                    {item}
                                </div>
                            ))
                        }
                        </div>
                    </p>
                    <p className="col-1">{dg('totalPoints')}</p>
                </div>
                {
                    result.result?.map(({noteId, name, scores, total}, index) => {
                        const place = index + 1
                        if ( (place > (page.current - 1) * 5) && (place <= (page.current * 5)) ) {
                            return (
                                <div className="row p-0 border border-primary rounded align-items-stretch text-center mb-1 text-primary" key={noteId}>
                                    <p className="col-1 border-end border-primary d-flex justify-content-center align-items-center fs-4">{place}</p>
                                    <div className="col-2 d-flex justify-content-center align-items-center border-end border-primary">{name}</div>
                                    <div className="col-8">
                                        <div className="row align-items-stretch justify-content-start p-0 m-0 h-100">
                                            {
                                                scores.map(({value}, index) => (
                                                    <div
                                                        className="border-end border-primary d-flex align-items-center justify-content-center col h-100 p-0 m-0 fs-5"
                                                        key={`${noteId}_${index}`}
                                                        style={{ width: `${100 / scores.length}%` }}
                                                    >
                                                        {value}
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