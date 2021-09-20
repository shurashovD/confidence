import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MODAL_ERROR, MODAL_REGISTER, MODAL_SCORE } from '../redux/modalTypes'
import errorImg from '../img/error-img.png'
import smileImg from '../img/smile.png'
import { hide } from '../redux/modalSlice'
import { useDictionary } from '../hooks/dictionary.hook'

export const Modal = () => {
    const { modal } = useSelector(state => state)
    const dispatch = useDispatch()
    const { type, text } = modal

    const {dg} = useDictionary()

    const okClickHandler = () => {
        dispatch(hide())
    }

    return (
        <div className={"container-fluid min-vh-100 position-fixed top-0 start-0 p-0 " + (modal.show ? "d-flex" : "d-none")}
            style={{background: 'rgba(180, 255, 255, 0.6)', zIndex: '1070'}}>
            <div className="d-flex flex-column align-items-center m-auto col-10 col-sm-3 p-5 bg-dark rounded"
                style={{boxShadow: '5px 5px 5px #40A69B, -5px -5px 5px #56E0D1'}}>
                { type === MODAL_REGISTER && <h5 className="text-primary text-center">{dg('partRegister')}</h5> }
                { type === MODAL_REGISTER && <h5 className="text-primary text-center">{dg('number')}</h5> }
                <p className="text-primary text-center mb-4">{text}</p>
                { (type === MODAL_ERROR) && <img src={errorImg} alt="error" width="75" className="mb-4" /> }
                { (type === MODAL_SCORE) && <img src={smileImg} alt="error" width="75" className="mb-4" /> }
                <button
                    className="btn btn-primary col-auto"
                    onClick={okClickHandler}
                >
                    OK
                </button>
            </div>
        </div>
    )
}