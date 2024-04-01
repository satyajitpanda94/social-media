import React, { useContext, useEffect, useState } from 'react'
import './Friend.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

export default function Friend({ friendId }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [friend, setFriend] = useState(null)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const getFriendById = async () => {
            return await axios.get(`${apiBaseURL}/user/${friendId}`)
        }

        getFriendById().then(
            res => setFriend(res.data)
        )
    }, [friendId])

    return (
        <div className="friend-container">
            <Link to={`/profile/${friend?._id}`}>
                <img src={friend?.profilePic ? friend?.profilePic : "/avatar.png"} alt="" />
                <span className="friend-name">
                    {
                        friend?._id === user._id ? 'You' : friend?.name
                    }
                </span>
            </Link>
        </div>
    )
}
