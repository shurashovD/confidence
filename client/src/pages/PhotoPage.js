import React, { useEffect, useRef, useState } from 'react'
import { useDictionary } from '../hooks/dictionary.hook'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { Rfid } from '../components/Rfid'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'

const STEP = {
    photo: 'photo', rfid: 'rfid'
}

export const PhotoPage = () => {
    const [step, setStep] = useState(STEP.rfid)
    const [note, setNote] = useState()
    const files = useRef({})
    const {dg} = useDictionary()
    const { request, sendFormData, loading, error, clearError } = useHttp()
    const { successModal, errorModal } = useModal()

    const rfidCallback = async rfid => {
        try {
            const response = await request('/api/notes/get-note-by-rfid', 'POST', { rfid })
            setStep(STEP.photo)
            setNote(response)
        }
        catch {}
    }

    const fileInputHandler = event => {
        files.current[event.target.name] = event.target.files[0]
        if ( files.current[event.target.name] ) {
            const url = URL.createObjectURL(files.current[event.target.name])
            setNote(state => ({...state, [event.target.name]: url}))
        }
        else {
            setNote(state => ({...state, [event.target.name]: null}))
        }
    }

    const reset = () => {
        files.current = {}
        setNote(null)
        setStep(STEP.rfid)
    }

    const submitHandler = async () => {
        try {
            const { message } = await sendFormData('/api/notes/upload-photo', { noteId: note._id }, [
                {beforePhoto: files.current.beforePhoto}, {afterPhoto: files.current.afterPhoto}
            ])
            successModal(message)
            reset()
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
        <div className="container my-0 mx-auto min-vh-100 p-0 d-flex flex-column">
            { loading && <Loader /> }
            <Navbar />
            { step === STEP.photo && <div className="container pt-3 m-auto">
                <h4 className="text-center mb-4">{dg('photographer')}</h4>
                <div className="col-12 col-md-10 mx-auto">
                    <p className="text-center text-primary">
                        {dg('participant')} № {note?.number}. {dg('category')}: <span style={{textTransform: 'uppercase'}}>"{dg(note?.category)}"</span>
                    </p>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="row justify-content-center py-4">
                            <label className="btn btn-primary btn-shadow col-auto">
                                {dg('uploadPhotoBefore')}
                                <input type="file" className="d-none" accept="image/jpeg" name="beforePhoto" onInput={fileInputHandler} />
                            </label>
                        </div>
                        <div className="row justify-content-center">
                            { !note?.beforePhoto && <div className="col-11 rounded border border-primary" style={{backgroundColor: '#137A77', height: '50vh'}}></div> }
                            { note?.beforePhoto && 
                                <img alt="beforePhoto" style={{ height: '50vh', objectFit: 'contain' }} src={note?.beforePhoto}
                                    className="rounded p-0"
                                /> }
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row justify-content-center py-4">
                            <label className="btn btn-primary btn-shadow col-auto">
                                {dg('uploadPhotoAfter')}
                                <input type="file" className="d-none" accept="image/jpeg" name="afterPhoto" onInput={fileInputHandler} />
                            </label>
                        </div>
                        <div className="row justify-content-center">
                            { !note?.afterPhoto && <div className="col-11 rounded border border-primary" style={{backgroundColor: '#137A77', height: '50vh'}}></div> }
                            { note?.afterPhoto && 
                                <img alt="afterPhoto" style={{ height: '50vh', objectFit: 'contain' }} src={note?.afterPhoto}
                                    className="rounded p-0"
                                /> }
                        </div>
                    </div>
                </div>
                <div className="row justify-content-around my-4">
                    <button className="btn btn-primary btn-shadow col-auto" onClick={submitHandler}>
                        {dg('done')}
                    </button>
                    <button className="btn btn-primary btn-shadow col-auto" onClick={reset}>
                        {dg('cancel')}
                    </button>
                </div>
            </div> }
            { step === STEP.rfid && <Rfid rfidCallback={rfidCallback} /> }
        </div>
    )
}