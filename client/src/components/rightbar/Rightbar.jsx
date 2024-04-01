import React, { useContext, useEffect, useState } from 'react'
import './Rightbar.scss'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import MayBeFriend from '../mayBeFriend/MayBeFriend'
import FriendRequestFrom from '../friendRequestFrom/FriendRequestFrom'
import { useQuery } from '@tanstack/react-query'
import Contact from '../contact/Contact'

export default function Rightbar() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user } = useContext(AuthContext)
    const [mayBeFriends, setMayBeFriends] = useState([])

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    useEffect(() => {
        const getUsers = async () => {
            return await axios.get(`${apiBaseURL}/user/all`)
        }

        currentUser &&
            getUsers()
                .then(res => setMayBeFriends(
                    res.data.filter(mayBeFriend => {
                        return currentUser._id !== mayBeFriend._id &&
                            (!currentUser.friends.includes(mayBeFriend._id)) &&
                            (!currentUser.friendRequestsSent.includes(mayBeFriend._id)) &&
                            (!currentUser.friendRequestsFrom.includes(mayBeFriend._id))
                    }))
                )
    }, [currentUser])

    return (
        <div className='rightbar-container'>
            <div className="people-you-may-know-container">
                <div className="title">People you may know</div>
                {
                    mayBeFriends &&
                    mayBeFriends.map((mayBeFriend, indx) => (
                        indx < 5 && <MayBeFriend mayBeFriend={mayBeFriend} key={indx} />
                    ))
                }

            </div>

            {
                currentUser?.friendRequestsFrom.length > 0 &&
                < div className="friend-request-wrapper">
                    <hr />

                    <div className="friend-request-container">
                        <span className='title'>Friend requests</span>
                        {
                            currentUser &&
                            currentUser.friendRequestsFrom.map((friendRequestFrom, indx) => (
                                <FriendRequestFrom friendRequestFromId={friendRequestFrom} key={indx} />
                            ))
                        }
                    </div>
                </div>
            }

            <div className="contacts-wrapper">
                <hr />
                <div className="contacts-container">
                    <span className='title'>
                        {
                            currentUser?.contacts.length > 0 ? "Your contacts" : "Make some contacts"
                        }

                    </span>
                    {
                        currentUser?.contacts.toReversed().map(contactId => (
                            <Contact key={contactId} contactId={contactId} currentUser={currentUser} />
                        ))
                    }
                    {
                        currentUser?.contacts.length === 0 &&
                        mayBeFriends.map((mayBeFriend, indx) => (
                            indx > 5 && indx < 12 && <Contact contactId={mayBeFriend._id} currentUser={currentUser} key={indx} />
                        ))
                    }
                </div>
            </div>

        </div >
    )
}
