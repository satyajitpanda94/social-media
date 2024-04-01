import React, { useEffect, useState } from 'react'
import './User.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

export default function User({ userId, currentUserId }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [user, setUser] = useState(null)
    const [friendRequestsSent, setFriendRequestSent] = useState(false)
    const [disableButton, setDisableButton] = useState(false)

    const { data: currentUser } = useQuery({
        queryKey: ["user", currentUserId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${currentUserId}`)
            return res.data
        }
    })


    const sendFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/add-friend-request`, { friendRequestTo: userId })
        setFriendRequestSent(!friendRequestsSent)
    }

    const cancleFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/cancle-friend-request`, { friendRequestTo: userId })
        setFriendRequestSent(!friendRequestsSent)
    }

    const confirmFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/follow-friend`, { friendRequestFrom: userId })
        setDisableButton(!disableButton)
    }

    const deleteFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${userId}/cancle-friend-request`, { friendRequestTo: currentUser._id })
        setDisableButton(!disableButton)
    }

    const unfollowFriend = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/unfollow-friend`, { friendId: userId })
        setDisableButton(!disableButton)
    }

    useEffect(() => {
        const getFriendById = async () => {
            return await axios.get(`${apiBaseURL}/user/${userId}`)
        }

        getFriendById().then(
            res => setUser(res.data)
        )
    }, [userId])
    return (
        <div className='user-container'>
            <Link to={`/profile/${user?._id}`} className='user-profile-pic'>
                <img src={user?.profilePic ? user?.profilePic : "/avatar.png"} alt="" />
            </Link>

            <div className="user-container-bottom">
                <Link to={`/profile/${user?._id}`} className="user-name">
                    {
                        user?._id === currentUser?._id ? 'You' : user?.name
                    }
                </Link>
                {
                    user?.friends.includes(currentUser._id) ?
                        (<div className="button-container">
                            <div
                                className="unfollow-button"
                                disabled={disableButton}
                                onClick={unfollowFriend}
                            >
                                Unfollow
                            </div>
                        </div>) :
                        user?.friendRequestsSent.includes(currentUser._id) ?
                            (<div className="button-container">
                                <div
                                    className="confirm-button"
                                    disabled={disableButton}
                                    onClick={confirmFriendRequest}
                                >
                                    Confirm
                                </div>
                                <div
                                    className="delete-button"
                                    disabled={disableButton}
                                    onClick={deleteFriendRequest}
                                >
                                    Delete
                                </div>
                            </div>) :
                            (
                                <div className="button-container">
                                    {
                                        friendRequestsSent ?
                                            <div
                                                className="cancle-button"
                                                onClick={e => cancleFriendRequest(e)}
                                            >
                                                Cancle
                                            </div> :
                                            <div
                                                className="add-friend-button"
                                                onClick={e => sendFriendRequest(e)}
                                            >
                                                Add Friend
                                            </div>
                                    }
                                </div>
                            )
                }
            </div>
        </div>
    )
}
