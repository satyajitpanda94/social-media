import React, { useContext, useEffect, useState } from 'react'
import './Profile.scss'
import Navbar from '../../components/navbar/Navbar';
import SharePost from '../../components/sharePost/SharePost';
import Posts from '../../components/posts/Posts';
import EditProfile from '../../components/editProfile/EditProfile';
import { AuthContext } from '../../context/authContext';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ProfileTopbar from '../../components/profileTopbar/ProfileTopbar';
import Intro from '../../components/intro/Intro';
import Friends from '../../components/friends/Friends';
import MessengerModel from '../../components/messengerModal/MessengerModal';
import PhotoGallery from '../../components/photoGallery/PhotoGallery';

export default function Profile() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user } = useContext(AuthContext)
    const [openEditProfile, setOpenEditProfile] = useState(false)
    const { id: paramId } = useParams()
    const [openMessengerModal, setOpenMessengerModal] = useState(false)

    const { data: profileUser } = useQuery({
        queryKey: ["profileUser", paramId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${paramId}`)
            return res.data
        }
    })

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const [friendRequestsSent, setFriendRequestSent] = useState(currentUser?.friendRequestsSent.includes(paramId))

    const { data: postsByPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["profilePostsByPage", paramId],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get(`${apiBaseURL}/post/profile/${paramId}?page=${pageParam}`)
            return res.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length ? allPages.length + 1 : undefined
        }
    })

    const handleInfiniteScroll = async () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            fetchNextPage()
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll)
        return () => window.removeEventListener("scroll", handleInfiniteScroll)
    }, [])

    return (
        <div
            className={openMessengerModal ? "profile-container active-messanger" : "profile-container"}
            disabled={openEditProfile}
        >

            <ProfileTopbar
                openEditProfile={openEditProfile}
                setOpenEditProfile={setOpenEditProfile}
                openMessengerModal={openMessengerModal}
                setOpenMessengerModal={setOpenMessengerModal}
            />
            {
                (profileUser?.profilePic === "" || profileUser?.coverPic === "") &&
                <h1>Update Your Profile !!!</h1>
            }

            <div className="profile-buttom" >
                <div className="profile-buttom-left">
                    <Intro profileUser={profileUser} />
                    <PhotoGallery profileUserId={paramId} />
                    <Friends profileUser={profileUser} />
                </div>
                <div className="profile-buttom-right">
                    {
                        currentUser?._id === paramId &&
                        <SharePost />
                    }
                    {
                        postsByPage?.pages[0].length === 0 &&
                        <h3>Share your first post !!!</h3>
                    }
                    {
                        postsByPage?.pages.map(
                            (posts, idx) => <Posts posts={posts} key={idx} />
                        )
                    }
                </div>
            </div>

            {
                openEditProfile &&
                <div className="edit-profile-modal">
                    <div
                        className="edit-profile-overlay"
                        onClick={e => setOpenEditProfile(!openEditProfile)}
                    >
                    </div>
                    <div className="edit-profile-wrapper">
                        <div className='edit-profile-container'>
                            <EditProfile setOpenEditProfile={setOpenEditProfile} openEditProfile={openEditProfile} />
                        </div>
                    </div>
                </div>
            }
            {
                openMessengerModal &&
                <div className="messenger-modal-wrapper">
                    <MessengerModel
                        recieverUser={profileUser}
                        currentUser={currentUser}
                        setOpenMessengerModal={setOpenMessengerModal}
                    />
                </div>
            }
        </div >
    )
}
