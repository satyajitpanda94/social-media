import React, { useEffect, useRef, useState } from 'react'
import './MessengerModal.scss'
import { RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { format } from 'timeago.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Chats from '../chats/Chats'
import MessageInput from '../messageInput/MessageInput'
import { IoPersonSharp } from 'react-icons/io5'

export default function MessengerModal({ recieverUser, currentUser, setOpenMessengerModal }) {
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL

  const [message, setMessage] = useState('')

  let { data: chats } = useQuery({
    queryKey: ["chats", currentUser._id, recieverUser._id],
    queryFn: async () => {
      const res = await axios.get(`${apiBaseURL}/chat/${currentUser._id}`, { params: { recieverId: recieverUser._id } })
      return res.data;
    }
  })

  return (
    <div className='messenger-modal-conatiner'>
      <div className="messenger-modal-topbar">
        <div className="messenger-modal-topbar-left">
          {
            recieverUser.profilePic ?
              <img src={recieverUser.profilePic} alt="" /> :
              <IoPersonSharp className='avatar' />
          }
          <span>{recieverUser.name}</span>
        </div>
        <div className="cancle-button" onClick={e => setOpenMessengerModal(false)} >
          <RxCross2 />
        </div>
      </div>

      <div className="chats-wrapper">
        <Chats chats={chats} recieverUser={recieverUser} currentUser={currentUser} />
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        currentUser={currentUser}
        selectedContactId={recieverUser._id}
      />
    </div >
  )
}
