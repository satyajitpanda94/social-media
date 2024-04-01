import React, { useContext, useEffect, useState } from 'react'
import './AllFriends.scss'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { IoPersonSharp } from 'react-icons/io5'
import User from '../../components/user/User'
import { AuthContext } from '../../context/authContext'

export default function AllFriends() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { id: profileId } = useParams()
    const { user: currentUser } = useContext(AuthContext)
    const [mayBeFriends, setMayBeFriends] = useState([])

    const { data: profileUser } = useQuery({
        queryKey: ["profileUser", profileId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${profileId}`)
            return res.data
        }
    })

    useEffect(() => {
        const getUsers = async () => {
            return await axios.get(`${apiBaseURL}/user/all`)
        }

        currentUser?._id === profileUser?._id &&
            getUsers()
                .then(res => setMayBeFriends(
                    res.data.filter(mayBeFriend => {
                        return profileUser._id !== mayBeFriend._id &&
                            (!profileUser.friends.includes(mayBeFriend._id)) &&
                            (!profileUser.friendRequestsSent.includes(mayBeFriend._id)) &&
                            (!profileUser.friendRequestsFrom.includes(mayBeFriend._id))
                    }))
                )
    }, [profileUser])

    return (
        <div className="all-friends-wrapper">
            <div className="all-friends-container-left">
                <Link to={`/profile/${profileUser?._id}`} className="profile-info-container">
                    {
                        <img
                            src={profileUser?.profilePic ? profileUser.profilePic : "/avatar.png"}
                            alt=""
                        />
                    }

                    <span className="name">
                        {profileUser?.name}
                    </span>
                </Link>
            </div>

            <div className="all-friends-container-right">
                <div className="friends-container">
                    <span className='container-title'>Friends</span>
                    {
                        profileUser?.friends.length > 0 ?
                            <div className="friends">
                                {
                                    profileUser?.friends.map((userId, indx) => (
                                        <User userId={userId} currentUserId={currentUser?._id} key={indx} />
                                    ))
                                }
                            </div> :
                            <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '1.25rem', paddingBlock: '10px' }}>
                                Don't have friends.
                            </div>
                    }
                </div>

                {
                    currentUser?._id === profileUser?._id &&
                    <>
                        {
                            profileUser?.friendRequestsFrom.length > 0 &&
                            <div className="friend-requests-container">
                                <hr />
                                <span className='container-title'>Friend Requests</span>
                                <div className="friend-requests">
                                    {
                                        profileUser?.friendRequestsFrom.map((userId, indx) => (
                                            <User userId={userId} currentUserId={currentUser?._id} key={indx} />
                                        ))
                                    }
                                </div>
                            </div>
                        }

                        {
                            mayBeFriends && mayBeFriends.length > 0 &&
                            <div className="suggested-friends-container">
                                <hr />
                                <span className='container-title'>Suggested Friends</span>
                                <div className="suggested-friends">
                                    {
                                        mayBeFriends.map((user, indx) => (
                                            indx < 5 && <User userId={user._id} currentUserId={currentUser?._id} key={indx} />
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </>
                }

            </div>
        </div>
    )
}
