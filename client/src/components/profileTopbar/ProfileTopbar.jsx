import React, { useContext, useState } from 'react'
import './ProfileTopbar.scss'
import { AuthContext } from '../../context/authContext'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { MdEdit } from 'react-icons/md'
import { FaFacebookMessenger } from "react-icons/fa";
export default function ProfileTopbar({
    openEditProfile,
    setOpenEditProfile,
    openMessengerModal,
    setOpenMessengerModal
}) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user } = useContext(AuthContext)
    const { id: profileId } = useParams()
    const queryClient = useQueryClient()

    const { data: profileUser } = useQuery({
        queryKey: ["profileUser", profileId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${profileId}`)
            return res.data
        }
    })

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const confirmFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/follow-friend`, { friendRequestFrom: profileId })
        await queryClient.invalidateQueries({ queryKey: ['allposts'] })
        await queryClient.invalidateQueries({ queryKey: ['user'] })
        await queryClient.invalidateQueries({ queryKey: ['profileUser'] })
    }
    const unfollowFriend = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/unfollow-friend`, { friendId: profileId })
        await queryClient.invalidateQueries({ queryKey: ['allposts'] })
        await queryClient.invalidateQueries({ queryKey: ['user'] })
    }

    const deleteFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${profileId}/cancle-friend-request`, { friendRequestTo: user._id })
        await queryClient.invalidateQueries({ queryKey: ['user'] })
    }
    const sendFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/add-friend-request`, { friendRequestTo: profileId })
        await queryClient.invalidateQueries({ queryKey: ['allposts'] })
        await queryClient.invalidateQueries({ queryKey: ['user'] })
        await queryClient.invalidateQueries({ queryKey: ['profileUser'] })
    }

    const cancleFriendRequest = async (e) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${currentUser._id}/cancle-friend-request`, { friendRequestTo: profileId })
        await queryClient.invalidateQueries({ queryKey: ['user'] })
        await queryClient.invalidateQueries({ queryKey: ['profileUser'] })
    }
    return (
        <div className='topbar-container'>
            <div className="image-container">
                <div className="cover-pic-container">
                    <img
                        src={profileUser?.coverPic ? profileUser.coverPic : "/coverpic.jpg"}
                        alt=""
                    />
                </div>

                <div className="profile-pic-container">
                    <img
                        src={profileUser?.profilePic ? profileUser.profilePic : "/avatar.png"}
                        alt=""
                    />
                </div>
            </div>

            <div className="user-info-wrapper">
                <div className="user-info">
                    <div className="name">{profileUser?.name}</div>
                    <span>{profileUser?.friends.length} friends</span>
                </div>
                <div className="button-container">
                    {
                        currentUser?._id === profileId ?
                            (< div
                                className="edit-profile-button"
                                onClick={e => setOpenEditProfile(!openEditProfile)}
                            >
                                <MdEdit className='edit-icon' />
                                Edit Profile
                            </div>) :
                            currentUser?.friends.includes(profileId) ?
                                (
                                    <div
                                        className="add-friend"
                                        onClick={e => unfollowFriend(e)}
                                    >Unfollow</div>
                                ) :
                                currentUser?.friendRequestsFrom.includes(profileId) ?
                                    (<div className="button-container">
                                        <div
                                            className="confirm-button"
                                            onClick={confirmFriendRequest}
                                        >Confirm</div>
                                        <div
                                            className="delete-button"
                                            onClick={deleteFriendRequest}
                                        >Delete</div>
                                    </div>) :
                                    currentUser?.friendRequestsSent.includes(profileId)
                                        ? (
                                            <div
                                                className="cancle"
                                                onClick={e => cancleFriendRequest(e)}
                                            >Cancle</div>
                                        )
                                        : (
                                            <div
                                                className="add-friend"
                                                onClick={e => sendFriendRequest(e)}
                                            >Add Friend</div>
                                        )
                    }
                    {
                        currentUser?._id !== profileId &&
                        (< div
                            className="message-button"
                            onClick={e => setOpenMessengerModal(!openMessengerModal)}
                        >
                            <FaFacebookMessenger />
                            Message
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}
