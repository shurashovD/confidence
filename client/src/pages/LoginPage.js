import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import logo from '../img/logo.png'
import loginBgi from '../img/login-input-bgi.svg'
import passBgi from '../img/pass-input-bgi.svg'
import btnBgi from '../img/login-btn-bgi.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setLang } from '../redux/authSlice'
import { useDictionary } from '../hooks/dictionary.hook'
import { useAuth } from '../hooks/auth.hook'

export const LoginPage = () => {
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [form, setForm] = useState({
        login: '', pass: ''
    })

    const { request, loading, error, clearError } = useHttp()
    const { dg } = useDictionary()
    const { login } = useAuth()

    const style = {
        login: {
            backgroundImage: `url(${loginBgi})`,
            backgroundPosition: '15px 12px',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '50px'
        },
        pass: {
            backgroundImage: `url(${passBgi})`,
            backgroundPosition: '15px 12px',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '50px'
        },
        btn: {
        }
    }

    const submitHandler = async () => {
        clearError()
        try {
            const result = await request('/api/auth/login', 'POST', form)
            login(result)
        }
        catch (e) {}
    }

    useEffect(() => {
        if ( error ) {
            setTimeout(clearError, 4000)
        }
    }, [error, clearError])

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-around m-0 p-0">
            <img src={logo} alt="main-logo" className="col-10 col-md-3" />
            <div className="col-12 col-sm-3 p-1 d-flex flex-column align-items-center">
                { !error && <h5 className="text-center mb-4">{dg('loginTitle')}</h5> }
                { error && <h5 className="text-center mb-4 text-warning">{error}</h5> }
                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder={dg('login')}
                    style={style.login}
                    name="login"
                    value={form.login}
                    onChange={event => setForm(form => ({...form, [event.target.name]: event.target.value}))}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder={dg('pass')}
                    style={style.pass}
                    name="pass"
                    value={form.pass}
                    onChange={event => setForm(form => ({...form, [event.target.name]: event.target.value}))}
                />
                <button
                    className="btn btn-primary mt-4 mx-auto d-flex align-items-center"
                    style={style.btn}
                    onClick={submitHandler}
                >
                    { loading && <div className="spinner-border text-dark" /> }
                    { !loading && <><img src={btnBgi} alt="entrance" className="me-1" />{dg('entrance')}</> }
                </button>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-center">
                <div className={"border border-primary rounded m-2 p-2 " + (authState.lang === 'EN' && "bg-primary")}>
                    <button
                        className={"btn m-0 p-0 " + (authState.lang === 'EN' ? "text-dark" : "text-primary")}
                        onClick={event => dispatch(setLang(event.target.textContent))}
                    >
                        EN
                    </button>
                </div>
                <div className={"border border-primary rounded m-2 p-2 " + (authState.lang === 'DE' && "bg-primary")}>
                    <button
                        className={"btn m-0 p-0 " + (authState.lang === 'DE' ? "text-dark" : "text-primary")}
                        onClick={event => dispatch(setLang(event.target.textContent))}
                    >
                        DE
                    </button>
                </div>
                <div className={"border border-primary rounded m-2 p-2 " + (authState.lang === 'FR' && "bg-primary")}>
                    <button
                        className={"btn m-0 p-0 " + (authState.lang === 'FR' ? "text-dark" : "text-primary")}
                        onClick={event => dispatch(setLang(event.target.textContent))}
                    >
                        FR
                    </button>
                </div>
                <div className={"border border-primary rounded m-2 p-2 " + (authState.lang === 'TR' && "bg-primary")}>
                    <button
                        className={"btn m-0 p-0 " + (authState.lang === 'TR' ? "text-dark" : "text-primary")}
                        onClick={event => dispatch(setLang(event.target.textContent))}
                    >
                        TR
                    </button>
                </div>
                <div className={"border border-primary rounded m-2 p-2 " + (authState.lang === 'RU' && "bg-primary")}>
                    <button
                        className={"btn m-0 p-0 " + (authState.lang === 'RU' ? "text-dark" : "text-primary")}
                        onClick={event => dispatch(setLang(event.target.textContent))}
                    >
                        RU
                    </button>
                </div>
            </div>
        </div>
    )
}