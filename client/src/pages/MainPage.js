import React from 'react'
import { NavLink } from 'react-router-dom'

export const MainPage = () => {

    return (
        <div className="container">
            <nav className="container-fluid p-0 d-flex justify-content-end">
                <NavLink to="/login">Login</NavLink>
            </nav>
            <h4>Главная</h4>
        </div>
    )
}