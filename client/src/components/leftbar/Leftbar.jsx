import React, { useContext } from 'react'
import { FaUserFriends, FaFacebookMessenger } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { GrGallery } from "react-icons/gr";
import { BsPersonCircle } from "react-icons/bs";
import './Leftbar.scss'
import { AuthContext } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Leftbar() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

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
        <div className='leftbar-container'>
            <Link to={`/profile/${user?._id}`} className='leftbar-item'>
                {
                    currentUser?.profilePic ?
                        <img
                            src={currentUser?.profilePic}
                            alt=""
                        /> :
                        <BsPersonCircle className='leftbar-item-icon' />
                }
                <span>{user.name}</span>
            </Link>
            <Link to={`/`} className='leftbar-item home'>
                <MdHome className='leftbar-item-icon' />
                <span>Home</span>
            </Link>
            <Link to={`/profile/${user?._id}/friends`} className='leftbar-item'>
                <FaUserFriends className='leftbar-item-icon' />
                <span>Friends</span>
            </Link>
            <Link to={`/messages/${user?._id}`} className="leftbar-item">
                <FaFacebookMessenger className='leftbar-item-icon' />
                <span>Messenger</span>
            </Link>
            <Link to={`/profile/${user?._id}/photos`} className="leftbar-item">
                <GrGallery className='leftbar-item-icon' />
                <span>Gallery</span>
            </Link>
            <Link to={`/settings`} className="leftbar-item">
                <IoSettingsSharp className='leftbar-item-icon' />
                <span>Settings</span>
            </Link>
            <div
                className="leftbar-item"
                onClick={handleLogout}
            >
                <RiLogoutBoxRLine className='leftbar-item-icon' />
                <span>Log out</span>
            </div>
        </div>
    )
}
