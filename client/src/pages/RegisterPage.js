import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDictionary } from '../hooks/dictionary.hook'
import { Navbar } from '../components/Navbar'
import { Loader } from '../components/Loader'
import addUserImg from '../img/add-user.svg'
import mailImg from '../img/mail.png'
import { useDispatch, useSelector } from 'react-redux'
import { registerReset, registerSetCategory, registerSetMail, registerSetMasterId, registerSetName } from '../redux/registerSlice'
import { useHttp } from '../hooks/http.hook'
import { useModal } from '../hooks/modal.hook'
import { Rfid } from '../components/Rfid'
import listImg from '../img/partList.png'

const STEP = {
    text: 'text', rfid: 'rfid'
}

export const RegisterPage = () => {
    const [step, setStep] = useState(STEP.text)
    const [masters, setMasters] = useState([])
    const [dropdown, setDropdown] = useState([])
    const registerComplete = useRef(false)
    const { registerState, modal } = useSelector(state => state)
    const dispatch = useDispatch()

    const { request, error, loading, clearError } = useHttp()
    const { errorModal, registerModal } = useModal()

    const { dg } = useDictionary()

    const links = [
        {title: dg('listOfParticipants'), to: '/register/list', src: listImg, alt: 'list'}
    ]

    const style = {
        name: {
            backgroundImage: `url(${addUserImg})`,
            backgroundPosition: '15px center',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '50px'
        },
        mail: {
            backgroundImage: `url(${mailImg})`,
            backgroundPosition: '15px center',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '55px'
        }
    }

    const getMasters = useCallback( async () => {
        try {
            const response = await request('/api/masters/get-all-masters')
            setMasters(response)
        }
        catch {}
    }, [request])

    const nameInputHandler = event => {
        dispatch(registerSetName(event.target.value))
        const mastersFilter = masters.filter(({name}) => name.toLowerCase().includes(event.target.value.toLowerCase()))
        setDropdown(mastersFilter)
    }

    const liClickHandler = event => {
        setDropdown([])
        const master = masters.find(({_id}) => _id === event.target.getAttribute('data-master-id') )
        dispatch(registerSetMasterId({name: master.name, mail: master.mail ?? '', masterId: master._id}))
    }

    const rfidCallback = async rfid => {
        setStep(null)
        try {
            const { message } = await request('/api/notes/add-note', 'POST', {...registerState, rfid})
            dispatch(registerReset())
            registerComplete.current = true
            registerModal(message)
        }
        catch {
            setStep(STEP.text)
        }
    }

    useEffect(() => {
        if ( error ) {
            errorModal(error)
            clearError()
        }
    }, [error, errorModal, clearError])

    useEffect(getMasters, [getMasters])

    useEffect(() => {
        const clickHandler = () => setDropdown([])
        document.addEventListener('click', clickHandler)
        return () => {
            document.removeEventListener('click', clickHandler)
            dispatch(registerReset())
        }
    }, [dispatch])

    useEffect(() => {
        if ( !modal.show && registerComplete.current ) {
            registerComplete.current = false
            setStep(STEP.text)
            getMasters()
        }
    }, [modal.show, registerComplete, getMasters])

    return (
        <div className="container-fluid min-vh-100 p-0 m-0 d-flex flex-column">
            { loading && <Loader /> }
            { step === STEP.text && <div className="container min-vh-100 pt-3 m-auto">
                <Navbar links={links} />
                <h4 className="text-center my-4">{dg('registration')}</h4>
                <div className="col-12 col-md-8 mx-auto">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <input
                                className={"form-control col-3 " + ((dropdown.length > 0) && "rounded-0 rounded-top")}
                                name="name"
                                placeholder={dg('enterTheNameOfTheParticipant')}
                                style={style.name}
                                value={registerState.name}
                                onChange={nameInputHandler}
                            />
                            <div className="w-100 position-relative">
                                <ul className="position-absolute bg-secondary list-group rounded-0 rounded-bottom w-100">
                                    {
                                        dropdown.map(({_id, name}) => (
                                            <li className="dropdown-item" data-master-id={_id} onClick={liClickHandler} key={_id}>
                                                {name}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <input
                                className="form-control"
                                name="mail"
                                placeholder="E-mail"
                                style={style.mail}
                                value={registerState.mail}
                                onChange={event => dispatch(registerSetMail(event.target.value))}
                            />
                        </div>
                    </div>
                    <h5 className="text-center my-4 mt-5">{dg('selectContestantTask')}</h5>
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <button className="w-100 btn btn-primary btn-shadow" onClick={event => dispatch(registerSetCategory('hairTechnology'))}>
                                {dg('hairTechnology')}
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="w-100 btn btn-primary btn-shadow" onClick={event => dispatch(registerSetCategory('Microblading'))}>
                                {dg('Microblading')}
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="w-100 btn btn-primary btn-shadow" onClick={event => dispatch(registerSetCategory('lips'))}>
                                {dg('lips')}
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="w-100 btn btn-primary btn-shadow" onClick={event => dispatch(registerSetCategory('feathering'))}>
                                {dg('feathering')}
                            </button>
                        </div>
                        <div className="col-9 mx-auto">
                            <button className="w-100 btn btn-primary btn-shadow" onClick={event => dispatch(registerSetCategory('arrow'))}>
                                {dg('arrow')}
                            </button>
                        </div>
                    </div>
                    <p className="text-primary text-center">
                        {dg('participant')}: {registerState.name}
                    </p>
                    <p className="text-primary text-center">
                        {dg('category')}: {registerState.category && dg(registerState.category)}
                    </p>
                </div>
                <div className="row">
                    <button
                        className="col-auto mx-auto mt-4 btn btn-primary btn-shadow"
                        disabled={registerState.name.length === 0 || !registerState.category}
                        onClick={() => setStep(STEP.rfid)}
                    >
                        {dg('register')}
                    </button>
                </div>
            </div> }
            { step === STEP.rfid && <Rfid rfidCallback={rfidCallback} btnCallback={() => setStep(STEP.text)} btnTitle={dg('cancel')} /> }
        </div>
    )
}