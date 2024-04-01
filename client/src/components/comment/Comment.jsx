import React, { useEffect, useState } from 'react'
import { IoPersonSharp } from "react-icons/io5";
import './Comment.scss'
import { format } from 'timeago.js';
import axios from 'axios';

export default function Comment({ comment }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [commentBy, setCommentBy] = useState(null)

    useEffect(() => {
        const getCommentBy = async () => {
            return await axios.get(`${apiBaseURL}/user/${comment.userId}`)
        }

        getCommentBy()
            .then(res => setCommentBy(res.data))
    }, [comment.userId])

    return (
        <div className="comment-container">
            <div className="comment-left">
                <div className="comment-user-info">
                    {
                        commentBy?.profilePic ?
                            <img
                                src={commentBy?.profilePic}
                                alt=""
                            /> :
                            <IoPersonSharp className='avatar' />
                    }
                </div>
                <div className="comment-info">
                    <span className='user-name'>{commentBy?.name}</span>
                    <pre>{comment.desc}</pre>
                </div>
            </div>
            <div className="comment-right">
                <span className='date'>{format(comment.createdAt)}</span>
            </div>
        </div>
    )
}
