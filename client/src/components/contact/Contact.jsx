import React, { useEffect, useState } from 'react'
import './Contact.scss'
import axios from 'axios'
import MessengerModal from '../messengerModal/MessengerModal'
import { IoPersonSharp } from 'react-icons/io5'

export default function Contact({ contactId, currentUser }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [contact, setContact] = useState(null)
    const [openMessengerModal, setOpenMessengerModal] = useState(false)

    useEffect(() => {
        const getContact = async () => {
            return await axios.get(`${apiBaseURL}/user/${contactId}`)
        }

        getContact().then(
            res => setContact(res.data)
        )
    }, [contactId])
    return (<>
        <div className="contact" onClick={e => setOpenMessengerModal(!openMessengerModal)}>
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
        {
            openMessengerModal &&
            <div className="messenger-modal-overlay">
                <div className="messenger-modal-wrapper">
                    <MessengerModal
                        recieverUser={contact}
                        currentUser={currentUser}
                        setOpenMessengerModal={setOpenMessengerModal}
                    />
                </div>
            </div>
        }
    </>
    )
}
