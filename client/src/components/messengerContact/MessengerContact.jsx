import React, { useEffect, useState } from 'react'
import './MessengerContact.scss'
import axios from 'axios'
import { IoPersonSharp } from 'react-icons/io5'

export default function MessengerContact({ contactId, selectedContact, setSelectedContact }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL
    const [contact, setContact] = useState(null)

    useEffect(() => {
        const getContact = async () => {
            return await axios.get(`${apiBaseURL}/user/${contactId}`)
        }

        getContact().then(
            res => setContact(res.data)
        )
    }, [contactId])

    return (
        <div
            className={contactId === selectedContact?._id ? 'messenger-contact active' : 'messenger-contact'}
            onClick={e => setSelectedContact(contact)}
        >
            {
                contact?.profilePic ?
                    <img
                        src={contact?.profilePic}
                        alt=""
                    /> :
                    <IoPersonSharp className='avatar' />
            }
            <span className="name">{contact?.name}</span>
        </div>
    )
}
