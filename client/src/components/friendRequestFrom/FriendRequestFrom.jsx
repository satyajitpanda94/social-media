import React, { useContext, useEffect, useState } from 'react'
import './FriendRequestFrom.scss'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { IoPersonSharp } from 'react-icons/io5'

export default function FriendRequestFrom({ friendRequestFromId }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user } = useContext(AuthContext)
    const [friendRequestFrom, setFriendRequestFrom] = useState(null)
    const queryClient = useQueryClient()

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const confirmFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/follow-friend`, { friendRequestFrom: friendRequestFromId })
        queryClient.invalidateQueries({ queryKey: ['allposts'] })
        queryClient.invalidateQueries({ queryKey: ['user'] })
    }

    const deleteFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${friendRequestFromId}/cancle-friend-request`, { friendRequestTo: currentUser._id })
        queryClient.invalidateQueries({ queryKey: ['user'] })
    }

    useEffect(() => {
        const getUserById = async () => {
            return await axios.get(`${apiBaseURL}/user/${friendRequestFromId}`)
        }

        getUserById().then(
            res => setFriendRequestFrom(res.data)
        )
    }, [friendRequestFromId])

    return (
        <div className="friend-request-from-container">
            <div className="left-container">
                <Link to={`/profile/${friendRequestFromId}`}>
                    {
                        friendRequestFrom?.profilePic ?
                            <img
                                src={friendRequestFrom?.profilePic}
                                alt=""
                            /> :
                            <IoPersonSharp className='avatar' />
                    }
                </Link>
            </div>
            <div className="right-container">
                <Link className="name" to={`/profile/${friendRequestFromId}`}>
                    {friendRequestFrom?.name}
                </Link>
                <div className="button-container">
                    <div className="confirm-button" onClick={confirmFriendRequest}>Confirm</div>
                    <div className="delete-button" onClick={deleteFriendRequest}>Delete</div>
                </div>
            </div>
        </div>
    )
}
