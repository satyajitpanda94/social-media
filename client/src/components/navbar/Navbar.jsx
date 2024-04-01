import React, { useContext, useState } from 'react'
import './Navbar.scss'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { IoPersonSharp, IoSearch } from 'react-icons/io5'
import { MdHome } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import SearchBar from '../searchBar/SearchBar'
import { RxCross2 } from 'react-icons/rx'
import Leftbar from '../leftbar/Leftbar'
import { BsPersonCircle } from 'react-icons/bs'
import { FaFacebookMessenger, FaUserFriends } from 'react-icons/fa'
import { GrGallery } from 'react-icons/gr'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function Navbar() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user, logout } = useContext(AuthContext)
    const [enableHamburger, setEnableHamburger] = useState(true)
    const [enableSearchInput, setEnableSearchInput] = useState(false)
    const navigate = useNavigate()

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const handleLogout = async () => {
        if (window.confirm('Do you want to Logout ?')) {
            await logout();
            navigate('/login')
        }
    }

    return (
        <div className='navbar-container'>
            <div className="navbar-left">
                <Link to={'/'}>
                    <span className="logo">
                        <span className='logo-first-half'>Friends</span>Media
                    </span>
                </Link>

                <span className='searchbar-wrapper'>
                    <SearchBar />
                </span>
                <IoSearch className='searchbar-icon' onClick={() => setEnableSearchInput(!enableSearchInput)} />
            </div>
            <div className="navbar-right">
                <div className="hamburger" onClick={() => setEnableHamburger(!enableHamburger)}>
                    {
                        enableHamburger
                            ? <GiHamburgerMenu className='navbar-icon' />
                            : <RxCross2 className='navbar-icon' />
                    }
                </div>
                <Link to={`/`} className='home'>
                    <MdHome className='navbar-icon' />
                </Link>
                <Link to={`/profile/${user?._id}`} className='profile-pic'>
                    {
                        currentUser?.profilePic ?
                            <img
                                src={currentUser?.profilePic}
                                alt=""
                            /> :
                            <IoPersonSharp className='avatar' />
                    }
                </Link>
            </div>

            {
                !enableHamburger &&
                <div className="leftbar-modal">
                    <Leftbar />
                </div>
            }

            {
                enableSearchInput &&
                <div
                    className="searchbar-modal"
                >
                    <SearchBar />
                    <RxCross2 className='cancle-icon' onClick={() => setEnableSearchInput(!enableSearchInput)} />
                </div>
            }
        </div>
    )
}
