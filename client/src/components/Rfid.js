import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDictionary } from '../hooks/dictionary.hook'
import rfidImg from '../img/rfid.png'

export const Rfid = ({rfidCallback, btnCallback, btnTitle}) => {
    const { auth } = useSelector(state => state)
    const { dg } = useDictionary()
    const rfid = useRef('')
    const rfidInput = useRef()
    const timeoutId = useRef()

    const rfidHandler = event => {
        if ( event.key === 'Enter' ) {
            if ( rfid.current.length === 10 ) {
                clearTimeout(timeoutId.current)
                rfidCallback(rfid.current)
            }
            rfid.current = ''
        }

        if ( !isNaN(event.key) ) {
            clearTimeout(timeoutId.current)
            rfid.current += event.key
            timeoutId.current = setTimeout(() => rfid.current = '', 200)
        }
    }

    useEffect(() => {
        let input
        const blurHandler = event => event.target.focus()
        if ( rfidInput.current ) {
            input = rfidInput.current
            input.focus()
            input.addEventListener('blur', blurHandler)
        }
        return () => input.removeEventListener('blur', blurHandler)
    }, [rfidInput])

    return (
        <div className="container m-auto p-0">
            <h4 className="text-center mb-5">{dg('referee')}: {auth.name}</h4>
            <div className="col-12 col-md-8 m-auto">
                { btnTitle && btnCallback && <div className="row">
                    <button
                        className="col-auto mx-auto my-4 btn btn-primary btn-shadow"
                        onClick={btnCallback}
                    >
                        {btnTitle}
                    </button>
                </div> }
                <h5 className="text-center mt-2">
                    {dg('attachTheParticipantLabel')}
                </h5>
                <div className="row">
                    <img src={rfidImg} alt="RFID" className="col-3 mx-auto mt-4" />
                </div>
                <input onKeyDown={rfidHandler} ref={rfidInput} style={{opacity: 0}} />
            </div>
        </div>
    )
}