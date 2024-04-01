import React, { useContext, useEffect, useState } from 'react'
import './Photo.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { RxAvatar, RxCross2 } from "react-icons/rx";
import Comments from '../../components/comments/Comments';
import { IoImageOutline, IoPersonSharp } from 'react-icons/io5';
import { format } from 'timeago.js';
import { MdMoreHoriz } from 'react-icons/md';
import { AuthContext } from '../../context/authContext';
import { useQueryClient } from '@tanstack/react-query';
import { BiSolidLike } from 'react-icons/bi';

export default function Photo() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [postBy, setPostBy] = useState(null)
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)
    const [moreOpen, setMoreOpen] = useState(false)
    const queryClient = useQueryClient()
    const [isLiked, setIsLiked] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)

    const updatePic = async (e, imageType) => {
        e.preventDefault()
        await axios.put(`${apiBaseURL}/user/${user._id}`, {
            [imageType]: post.img
        })
        queryClient.invalidateQueries({ queryKey: ['user'] })
        navigate('/profile/' + user._id)
    }

    const handleLike = async () => {
        try {
            await axios.put(apiBaseURL + '/post/' + post._id + '/like', { userId: user._id })
            setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1)
            setIsLiked(!isLiked)
            queryClient.invalidateQueries({ queryKey: ['allposts'] })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const getPost = async () => {
            return await axios.get(`${apiBaseURL}/post/${id}`)
        }

        getPost().then(
            res => {
                setPost(res.data)
                setIsLiked(res.data.likes.includes(user._id))
                setTotalLikes(res.data.likes.length)
            }
        )
    }, [id])

    useEffect(() => {
        const getPostBy = async () => {
            return await axios.get(`${apiBaseURL}/user/${post?.userId}`)
        }

        if (post) {
            getPostBy().then(
                res => setPostBy(res.data)
            )
        }
    }, [post])

    return (
        <div className='photo-container'>
            <div className="left-photo-container">
                <div className="cancle-photo" onClick={() => navigate(-1)}>
                    <RxCross2 />
                </div>
                <div className="image-container">
                    <img src={post?.img} alt="" />
                </div>
            </div>
            <div className="right-photo-container">
                <div className="post-user-info">
                    <Link to={`/profile/${postBy?._id}`}>
                        <div className="post-user-info-left">
                            {
                                postBy?.profilePic ?
                                    <img
                                        src={postBy?.profilePic}
                                        alt=""
                                    /> :
                                    <IoPersonSharp className='avatar' />
                            }
                            <div className="post-user-info-details">
                                <span className='name'>{postBy?.name}</span>
                                <span>{format(post?.createdAt)}</span>
                            </div>
                        </div>
                    </Link>
                    <div className="post-user-info-right">
                        {
                            user._id === post?.userId &&
                            <MdMoreHoriz
                                className='more'
                                onClick={() => setMoreOpen(!moreOpen)}
                            />
                        }
                        {
                            moreOpen &&
                            <div className="more-options">
                                <div className='more-option' onClick={e => updatePic(e, 'profilePic')}>
                                    <RxAvatar className='more-option-icon' />
                                    Make Profile Picture
                                </div>
                                <hr />
                                <div className='more-option' onClick={e => updatePic(e, 'coverPic')}>
                                    <IoImageOutline className='more-option-icon' />
                                    Make Cover Picture
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div
                    className="likes"
                    onClick={handleLike}
                >
                    <BiSolidLike
                        className={isLiked ? 'liked-icon' : 'disLiked-icon'}
                    />
                    <span>{totalLikes} Like</span>
                </div>
                <hr />
                <Comments postId={post?._id} />
            </div>
        </div>
    )
}
