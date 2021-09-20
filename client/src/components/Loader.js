import React from 'react'

export const Loader = () => (
    <div className="container-fluid min-vh-100 d-flex position-fixed top-0 start-0" style={{background: 'rgba(255, 255, 255, 0.6)'}}>
        <div className="spinner-border text-primary m-auto" style={{width: '4rem', height: '4rem'}} />
    </div>
)