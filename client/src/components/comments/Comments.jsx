import React, { useContext, useState } from 'react'
import './Comments.scss'
import { IoPersonSharp, IoSend } from "react-icons/io5";
import Comment from '../comment/Comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

export default function Comments({ postId }) {
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL
  const [desc, setDesc] = useState('')
  const { user } = useContext(AuthContext)

  let { data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axios.get(apiBaseURL + "/comment?postId=" + postId)
      return res.data;
    }
  })

  const { data: currentUser } = useQuery({
    queryKey: ["user", user._id],
    queryFn: async () => {
      const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
      return res.data
    }
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return axios.post(apiBaseURL + '/comment', newComment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })

  const handleCommentSend = async (e) => {
    e.preventDefault()

    mutation.mutate({
      desc,
      postId,
      userId: user._id
    })

    setDesc('')
  }

  return (
    <div className='comments-container'>
      <div className="comment-input-container">
        {
          currentUser?.profilePic ?
            <img
              src={currentUser?.profilePic}
              alt=""
            /> :
            <IoPersonSharp className='avatar' />
        }
        <form className="comment-input" onSubmit={handleCommentSend}>
          <input
            type="text"
            placeholder={'Write a comment ...'}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <IoSend
            className='send-button'
            type='submit'
          />
        </form>
      </div>
      {
        data &&
        data
          .map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))
      }
    </div>
  )
}
