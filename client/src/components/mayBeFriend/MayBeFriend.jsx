import React, { useContext, useState } from 'react'
import './MayBeFriend.scss'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { IoPersonSharp } from 'react-icons/io5'

export default function MayBeFriends({ mayBeFriend }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL
    const { user } = useContext(AuthContext)

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const [friendRequestsSent, setFriendRequestSent] = useState(false)

    const sendFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${user._id}/add-friend-request`, { friendRequestTo: mayBeFriend._id })
        setFriendRequestSent(!friendRequestsSent)
    }

    const cancleFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${user._id}/cancle-friend-request`, { friendRequestTo: mayBeFriend._id })
        setFriendRequestSent(!friendRequestsSent)
    }

    return (
        <div className="may-be-friend-container">
            <Link to={`/profile/${mayBeFriend._id}`}>
                <div className="left-container">
                    {
                        mayBeFriend?.profilePic ?
                            <img
                                src={mayBeFriend?.profilePic}
                                alt="profile pic"
                            /> :
                            <IoPersonSharp className='avatar' />
                    }
                    <div className="name">
                        {mayBeFriend.name}
                    </div>
                </div>
            </Link>
            <div className="right-container">
                {
                    friendRequestsSent
                        ? (<div className="button-container">
                            <div
                                className="cancle"
                                onClick={e => cancleFriendRequest(e)}
                            >Cancle</div>
                        </div>)
                        : (<div className="button-container">
                            <div
                                className="add-friend"
                                onClick={e => sendFriendRequest(e)}
                            >Add Friend</div>
                        </div>)
                }
            </div>
        </div>
    )
}
