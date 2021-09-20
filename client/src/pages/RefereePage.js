import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { Rfid } from '../components/Rfid'
import { useDictionary } from '../hooks/dictionary.hook'
import { useHttp } from '../hooks/http.hook'
import { useMic } from '../hooks/mic.hook'
import { useModal } from '../hooks/modal.hook'
import micImg from '../img/microphone.svg'

const STEP = { rfid: 'rfid', score: 'score' }

export const RefereePage = () => {
    const [step, setStep] = useState(STEP.rfid)
    const [note, setNote] = useState()
    const [tasks, setTasks] = useState([])
    const [showPhoto, setShowPhoto] = useState(false)
    const files = useRef({})
    const micBisy = useRef()
    const { loading, error, clearError, request, sendFormData } = useHttp()
    const { recording, micClickHandler, file, clearFile } = useMic()
    const {dg} = useDictionary()
    const { auth } = useSelector(state => state)
    const { scoreModal, errorModal } = useModal()

    const reset = () => {
        setNote(null)
        files.current = {}
        setStep(STEP.rfid)
    }

    const submitHandler = async () => {
        try {
            const fileData = []
            for ( let [_, value] of Object.entries(files.current) ) {
                fileData.push({ comment: value })
            }
            const { message } = await sendFormData('/api/notes/set-referee-scores', {noteId: note._id, tasks: JSON.stringify(tasks)}, fileData)
            scoreModal(message)
            reset()
        }
        catch (e) {
            console.log(e);
        }
    }

    const rfidCallback = async rfid => {
        try {
            const response = await request('/api/notes/get-note-for-referee', 'POST', { rfid })
            const myScores = response.note.scores.find(({refereeId}) => refereeId === auth.id)?.refereeScores ?? []
            setTasks(response.tasks.map(item => ({
                ...item,
                value: myScores.find(({testId}) => testId.toString() === item._id.toString())?.value ?? 0,
                comment: myScores.find(({testId}) => testId.toString() === item._id.toString())?.comment ?? ''
            })))
            setNote(response.note)
            setStep(STEP.score)
        }
        catch (e) {
            console.log(e);
        }
    }

    const inputHandler = event => {
        let value = event.target.value
        if ( value.length > 1 && value[0] === '0' ) {
            value = value.substr(1)
        }
        if ( value > 100 ) {
            value = 100
        }
        const testId = event.target.getAttribute('data-test-id')
        setTasks(state => state.map(item => (item._id === testId) ? {...item, value} : item))
    }

    const inputKdHandler = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) {
            event.preventDefault()
        }
    }

    const recordHandler = event => {
        const testId = event.nativeEvent.path.find(item => item.hasAttribute('data-test-id'))?.getAttribute('data-test-id')
        if ( testId ) {
            micBisy.current = testId
            micClickHandler()
        }
    }

    useEffect(() => {
        if ( file ) {
            if ( micBisy.current ) {
                files.current[micBisy.current] = new File([file], `${micBisy.current}.webm`)
                micBisy.current = null
            }
            clearFile()
        }
    }, [file, clearFile, files])

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, clearError, errorModal])

    return (
        <div className="container-fluid my-0 mx-auto min-vh-100 px-1 d-flex flex-column">
            { loading && <Loader /> }
            <Navbar />
            { note && showPhoto &&
                <div className="container-fluid min-vh-100 position-absolute top-0 start-0 bg-dark">
                    <div className="row justify-content-end p-3">
                        <button className="btn-close bg-light p-3" onClick={() => setShowPhoto(false)} />
                    </div>
                    { note.beforePhoto &&
                        <div className="row justify-content-center">
                            <img className="img-fluid" src={note.beforePhoto} alt="beforePhoto" />
                        </div>
                    }
                    { note.afterPhoto && 
                        <div className="row justify-content-center">
                            <img className="img-fluid" src={note.afterPhoto} alt="afterPhoto" />
                        </div>
                    }
                </div>
            }
            { step === STEP.score &&
                <div className="container-fluid pt-3 m-auto">
                    <h4 className="text-center mb-4">{dg('referee')}: {auth.name}</h4>
                    <div className="col-12 col-md-10 mx-auto">
                        <p className="text-center text-primary">
                            {dg('participant')} № {note?.number}. {dg('category')}: <span style={{textTransform: 'uppercase'}}>"{dg(note?.category)}"</span>
                            <button className="btn btn-primary btn-shadow col-auto ms-5" onClick={() => setShowPhoto(true)}>
                                {dg('photo')}
                            </button>
                        </p>
                    </div>
                    <div className="row mt-4 mb-0">
                        <div className="col-8 pe-3">
                            <div className="row bg-primary p-2 rounded">
                                <p className="col-3 text-dark text-center">
                                    {dg('criteria')}
                                </p>
                                <p className="col-9 text-dark text-center">
                                    {dg('descriptionOfTheEvaluationCriteria')}
                                </p>
                            </div>
                        </div>
                        <div className="col-1 px-3">
                            <div className="row bg-primary p-2 rounded">
                                <p className="col-12 text-dark text-center">
                                    {dg('points')}
                                </p>
                            </div>
                        </div>
                        <div className="col-3 ps-3">
                            <div className="row bg-primary p-2 rounded">
                                <p className="col-12 text-dark text-center">
                                    {dg('comment')}
                                </p>
                            </div>
                        </div>
                    </div>
                    {
                        tasks.map(({_id, testNameKey, testDescriptionKey, value, comment}) => (
                            <div className="row border-bottom border-primary align-items-stretch" key={_id}>
                                <div className="col-8 pe-3">
                                    <div className="row align-items-stretch h-100">
                                        <p className="col-3 text-primary border-end border-primary py-2">
                                            {dg(testNameKey)}
                                        </p>
                                        <p className="col-9 text-primary py-2">
                                            {dg(testDescriptionKey)}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-1 p-2 ps-3 d-flex align-items-center justify-content-center">
                                    <input
                                        data-test-id={_id}
                                        value={value}
                                        className="form-control bg-dark text-primary text-center fs-4"
                                        onChange={inputHandler}
                                        onKeyDown={inputKdHandler}
                                    />
                                </div>
                                <div className="col-3 ps-3 d-flex align-items-center justify-content-center">
                                    <div className="row">
                                        <div className="col-3">
                                            <button className="btn btn-primary btn-shadow" onClick={recordHandler} data-test-id={_id}>
                                                { (!recording || micBisy.current !== _id) && <img src={micImg} width="30" alt="mic" /> }
                                                { recording && micBisy.current === _id && <span className="spinner-grow text-danger m-0 p-0" /> }
                                            </button>
                                        </div>
                                        <div className="col-3">
                                            <audio controls className={"ms-3 " + (showPhoto && "d-none")} style={{ width: '245px', zIndex: '1' }}
                                                src={files.current?.[_id] ? URL.createObjectURL(files.current[_id]) : comment}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div className="row justify-content-around my-4">
                        <button className="btn btn-primary btn-shadow col-auto" onClick={submitHandler}>
                            {dg('done')}
                        </button>
                        <button className="btn btn-primary btn-shadow col-auto" onClick={reset}>
                            {dg('cancel')}
                        </button>
                    </div>
                </div>
            }
            { step === STEP.rfid && <Rfid rfidCallback={rfidCallback} /> }
        </div>
    )
}