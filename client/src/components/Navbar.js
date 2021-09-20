import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/auth.hook'
import { useDictionary } from '../hooks/dictionary.hook'
import headerLogo from '../img/header-logo.png'
import logoutImg from '../img/logout.png'

export const Navbar = props => {
    const {dg} = useDictionary()

    const links = props.links || []

    const { logout } = useAuth()

    return (
        <nav className="container-fluid p-0 row justify-content-end">
            <div className="col-2 me-auto">
                <img src={headerLogo} alt="logo" />
            </div>
            <div className="col-auto d-flex align-items-end">
                {
                    links.map(({title, to, src, alt}, index) => (
                        <NavLink to={to} key={index} className="d-flex align-items-center me-5">
                            { src && alt && <img src={src} className="me-2" alt={alt} /> }
                            <span>{title}</span>
                        </NavLink>
                    ))
                }
                <NavLink to="/login" onClick={logout} className="d-flex align-items-center">
                    <img src={logoutImg} className="me-2" alt="logout" />
                    <span>{dg('goOut')}</span>
                </NavLink>
            </div>
        </nav>
    )
}