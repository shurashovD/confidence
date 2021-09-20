import React from 'react'
import { useDictionary } from '../hooks/dictionary.hook'
import logo from '../img/logo.png'
import Sabina from '../img/Sabina.png'
import Anastasia from '../img/anastasia.png'
import qrCode from '../img/qrCode.svg'

export const Promo = () => {
    const {dg} = useDictionary()

    const style = {
        background: 'radial-gradient(circle 420px at center,  #56E0D1, rgba(0, 0, 0, 0))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0
    }

    return (
        <div className="container-fluid min-vh-100 d-flex position-absolute top-0 start-0 bg-dark overflow-hidden" style={style}>
            <div className="m-0 p-0 m-auto d-flex flex-column align-items-center justify-content-center">
                <img src={logo} alt="logo" style={{ width: '359px' }} />
                <img src={Sabina} alt="logo" style={{ width: '200px' }} />
                <p className="fs-4">{dg('logoTitle')}</p>
                <p style={{ fontSize: '4rem' }}>Sabina Knaub</p>
                <div className="d-flex">
                    <img src={Anastasia} alt="logo" style={{ width: '427px', marginRight: '16px' }} />
                    <img src={qrCode} alt="logo" style={{ width: '182px', marginLeft: '16px' }} />
                </div>
            </div>
        </div>
    )
}