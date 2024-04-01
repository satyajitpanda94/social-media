import React, { useEffect, useState } from 'react'
import './Messenger.scss'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Contact from '../../components/contact/Contact'
import MessengerContact from '../../components/messengerContact/MessengerContact'
import Chats from '../../components/chats/Chats'
import MessageInput from '../../components/messageInput/MessageInput'
import SearchBar from '../../components/searchBar/SearchBar'
import { IoPersonSharp, IoSearch } from 'react-icons/io5'

export default function Messenger() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { id: currentUserId } = useParams()
    const [selectedContact, setSelectedContact] = useState(null)
    const [message, setMessage] = useState('')
    const [searchedTerm, setSearchedTerm] = useState('')
    const [searchedUsers, setSearchedUsers] = useState([])

    const { data: currentUser } = useQuery({
        queryKey: ["user", currentUserId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${currentUserId}`)
            return res.data
        }
    })

    let { data: chats } = useQuery({
        queryKey: ["chats", currentUser?._id, selectedContact?._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/chat/${currentUser?._id}`, { params: { recieverId: selectedContact?._id } })
            return res.data;
        }
    })

    useEffect(() => {
        const getSearchedUsers = async () => {
            await axios.get(`${apiBaseURL}/user/search?q=${searchedTerm}`).then(
                res => setSearchedUsers(res.data.filter(searchedUser => searchedUser._id !== currentUserId))
            )
        }

        searchedTerm && getSearchedUsers()

    }, [searchedTerm])

    return (
        <div className='messenger-container'>
            <div className="messenger-leftbar">
                <div className='searchbar-container'>
                    <IoSearch />
                    <input type="text"
                        value={searchedTerm}
                        onChange={e => setSearchedTerm(e.target.value)}
                        placeholder='Search to contact'
                    />
                </div>

                <hr />

                {
                    searchedTerm.length > 0 &&
                    <div className="searched-user-container">
                        {
                            searchedUsers.length === 0 ?
                                "No result found" :
                                searchedUsers.map(searchedUser => (
                                    <MessengerContact key={searchedUser._id} contactId={searchedUser._id} selectedContact={selectedContact} setSelectedContact={setSelectedContact} />
                                ))
                        }
                        < hr />
                    </div>
                }

                {
                    currentUser?.contacts.length === 0 ?
                        <h3>No contacts Found</h3> :
                        currentUser?.contacts.toReversed().map(contactId => (
                            <MessengerContact key={contactId} contactId={contactId} selectedContact={selectedContact} setSelectedContact={setSelectedContact} />
                        ))
                }
            </div>
            <div className="messenger-feed-wrapper">
                {
                    selectedContact ?
                        <div className="messenger-feed-container">
                            <div className="messenger-feed-top">
                                <Link to={`/profile/${selectedContact?._id}`} className='profile-info'>
                                    {
                                        selectedContact?.profilePic ?
                                            <img src={selectedContact?.profilePic} alt="" /> :
                                            <IoPersonSharp className='avatar' />
                                    }
                                    <h3>{selectedContact?.name}</h3>
                                </Link>
                            </div>
                            <div className="chats-wrapper">
                                <Chats chats={chats} recieverUser={selectedContact} currentUser={currentUser} />
                            </div>
                            <MessageInput
                                message={message}
                                setMessage={setMessage}
                                currentUser={currentUser}
                                selectedContactId={selectedContact._id}
                            />
                        </div>
                        :
                        <h1 className="empty-feed">
                            No chats selected
                        </h1>
                }
            </div>
        </div>
    )
}
