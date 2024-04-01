import React from 'react'
import './MessageInput.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export default function MessageInput({ message, setMessage, currentUser, selectedContactId }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (message) => {
            return axios.post(`${apiBaseURL}/chat`, message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
        }
    })

    const handleMessageSend = async (e) => {
        e.preventDefault()

        await axios.put(`${apiBaseURL}/user/${currentUser._id}/contacts`, { recieverId: selectedContactId })

        mutation.mutate({
            senderUserId: currentUser._id,
            recieverUserId: selectedContactId,
            message
        })
        setMessage('')
    }

    return (
        <form className='text-input' onSubmit={handleMessageSend} >
            <input type="text" placeholder='Write a message...' value={message} onChange={e => setMessage(e.target.value)} />
        </form>
    )
}
