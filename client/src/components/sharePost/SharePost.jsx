import React, { useContext, useRef, useState } from 'react'
import './SharePost.scss'
import { FaPhotoVideo } from "react-icons/fa";
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoPersonSharp } from 'react-icons/io5';
import ReactPlayer from 'react-player'

export default function SharePost() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const postDesc = useRef()
    const { user } = useContext(AuthContext)

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            return await axios.post(apiBaseURL + '/post', newPost)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['allposts'] })
            await queryClient.invalidateQueries({ queryKey: ['timelinePostsByPage'] })
            await queryClient.invalidateQueries({ queryKey: ['profilePostsByPage'] })
            await queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })

    const handleSharePost = async (e) => {
        e.preventDefault()
        const newPost = {
            description: postDesc.current.value,
            userId: user._id,
            img: '',
            video: '',
        }

        try {
            if (file) {
                setIsLoading(true)

                const storageRef = ref(storage, `${Date.now()}${file.name}`);

                const uploadTask = uploadBytesResumable(storageRef, file);

                await uploadTask.then(
                    async () => {
                        await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            if (file.type.includes('video'))
                                newPost.video = downloadURL
                            else
                                newPost.img = downloadURL
                            setFile(null)
                        });
                    }
                ).catch(err => {
                    console.log(err.code)
                });

            }
        } catch (err) {
            console.log(err.code)
        }

        if (newPost.img || newPost.video || newPost.description) {
            mutation.mutate(newPost)
            setIsLoading(false)
            postDesc.current.value = ''
        }

    }

    return (
        <form className='share-post-container'>
            <div className="share-post-top">
                {
                    currentUser?.profilePic ?
                        <img
                            src={currentUser?.profilePic}
                            alt=""
                        /> :
                        <IoPersonSharp className='avatar' />
                }
                <input
                    type="text"
                    placeholder={'Whats in your mind ...'}
                    ref={postDesc}
                />
            </div>
            {
                file && (
                    <div className="share-post-container">
                        {
                            file.type.includes('video') ?
                                <ReactPlayer
                                    url={URL.createObjectURL(file)}
                                    controls={true}
                                    playing={false}
                                    className="share-video"
                                /> :
                                <img src={URL.createObjectURL(file)} alt="" className="share-img" />
                        }
                        <div
                            className='delete-img'
                            onClick={(e) => {
                                setFile(null)
                            }}
                        >
                            Delete
                        </div>
                    </div>
                )
            }
            <hr />
            <div className="share-post-buttom">
                <label htmlFor="file" className="photo-video-share">
                    <input
                        type="file"
                        id='file'
                        style={{ display: 'none' }}
                        value={""}
                        onChange={(e) => {
                            setFile(e.target.files[0])
                        }}
                    />
                    <FaPhotoVideo className='photo-video-share-icon' />
                    Photo/Video
                </label>
                <button
                    type='submit'
                    className="share-button"
                    onClick={handleSharePost}
                >
                    {
                        isLoading ? 'Uploading' : 'Share'
                    }
                </button>
            </div>
        </form>
    )
}
