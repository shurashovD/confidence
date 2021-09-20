import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { useDictionary } from '../hooks/dictionary.hook'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'
import { useMic } from '../hooks/mic.hook'
import micImg from '../img/microphone.svg'

export const HyhienicalPage = () => {
    const [scoreInput, setScoreInput] = useState('')
    const [numberInput, setNumberInput] = useState('')
    const [note, setNote] = useState()
    const comment = useRef()
    const {dg} = useDictionary()
    const { auth } = useSelector(state => state)
    const { request, error, clearError, sendFormData, loading } = useHttp()
    const { scoreModal, errorModal } = useModal()
    const { micClickHandler, recording, file } = useMic()

    const submitHandler = async () => {
        try {
            const { message } = await sendFormData('/api/notes/set-hyhienical-score', { noteId: note._id, value: scoreInput }, [{comment: comment.current}])
            comment.current = null
            setNumberInput('')
            setNote(null)
            setScoreInput('')
            scoreModal(message)
        }
        catch {}
    }   

    const getPartByNumber = async number => {
        try {
            const response = await request('/api/notes/get-note-by-number', 'POST', { number })
            setNote(response)
            setScoreInput(response.hyhienicalScore.value ?? '')
        }
        catch {}
    }

    const numberInputKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
        }
    }

    const numberInputHandler = event => {
        let value = event.target.value
        if ( value.length > 1 && value[0] === '0' ) {
            value = value.substr(1)
        }
        comment.current = null
        setNumberInput(value)
        setNote(null)
        setScoreInput('')
        if ( value.length > 0 ) {
            getPartByNumber(value)
        }
    }

    const scoreInputKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
        }
    }

    const scoreInputHandler = event => {
        let value = event.target.value
        if ( value.length > 1 && value[0] === '0' ) {
            value = value.substr(1)
        }
        if ( value > 100 ) {
            value = 100
        }
        setScoreInput(value)
        setNote(state => ({...state, hyhienicalScore: {...state.hyhienicalScore}, value}))
    }

    useEffect(() => {
        if ( file ) {
            comment.current = file
        }
    }, [file])

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    return (
        <div className="container my-0 mx-auto min-vh-100 p-0 pt-3 d-flex flex-column">
            { loading && <Loader /> }
            <Navbar />
            <h4 className="text-center mb-4">{dg('referee')}: {auth.name}</h4>
            <div className="col-12 col-md-4 mx-auto d-flex flex-column">
                <div className="row mb-5">
                    <div className="col-6">
                        <div className="row justify-content-center">
                            <p className="text-primary text-center">{dg('participantNumber')}</p>
                        </div>
                        <div className="row justify-content-center p-2">
                            <input className="form-control text-center" value={numberInput} onChange={numberInputHandler} onKeyDown={numberInputKdHandler} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row justify-content-center">
                            <p className="text-primary text-center">{dg('points')}</p>
                        </div>
                        <div className="row justify-content-center p-2">
                            <input className="form-control text-center"
                                value={scoreInput}
                                onChange={scoreInputHandler} onKeyDown={scoreInputKdHandler} />
                        </div>
                    </div>
                </div>
                { note && <div className="row">
                    { note && <p className="text-primary text-center">{dg('participant')}: {note?.number}</p> }
                    { note && <p className="text-primary text-center">{dg('category')}: <span style={{textTransform: 'uppercase'}}>"{dg(note?.category)}"</span></p> }
                </div> }
                { note && <p className="text-primary text-center mt-4">{dg('comment')}</p> }
                { note && <div className="row justify-content-center py-4">
                    <div className="col-3">
                        <button className="btn btn-primary btn-shadow" onClick={micClickHandler}>
                            { !recording && <img src={micImg} width="30" alt="mic" /> }
                            { recording && <span className="spinner-grow text-danger m-0 p-0" /> }
                        </button>
                    </div>
                </div> }
                { note && <div className="row">
                    { comment.current && <audio src={URL.createObjectURL(comment.current)} controls className="ms-2" /> }
                    { !comment.current && note?.hyhienicalScore?.comment && <audio src={note.hyhienicalScore.comment} controls className="ms-2" /> }
                </div> }
            </div>
            { note && <div className="row justify-content-around mt-auto mb-5">
                <button className="btn btn-primary btn-shadow col-auto" onClick={submitHandler}>
                    {dg('done')}
                </button>
            </div> }
        </div>
    )
}