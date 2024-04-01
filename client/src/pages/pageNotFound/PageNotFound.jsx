import React from 'react'
import './PageNotFound.scss'
import { Link, useNavigate } from 'react-router-dom'

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className='page-not-found-wrapper'>
            <div className='page-not-found-container'>
                <h2>Page Not Found</h2>
                <Link to={`/`} className='button'>
                    Go to Main Page
                </Link>
                <span className="go-back" onClick={() => navigate(-1)}>
                    Go Back
                </span>
            </div>
        </div>
    )
}
