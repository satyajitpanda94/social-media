import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import './Photos.scss'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export default function Photos() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { id: profileId } = useParams()

    const { data: profileUser } = useQuery({
        queryKey: ["profileUser", profileId],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${profileId}`)
            return res.data
        }
    })

    const { data: postsByPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["profilePostsByPage"],
        queryFn: async ({ pageParam }) => {
            const res = await axios.get(`${apiBaseURL}/post/profile/${profileId}?page=${pageParam}&limit=20`)
            return res.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length ? allPages.length + 1 : undefined
        }
    })

    useEffect(() => {
        if (postsByPage && hasNextPage) {
            fetchNextPage()
        }
    }, [postsByPage, hasNextPage])

    return (
        <div className='photos-container'>
            <div className="photo-gallery-profile-info">
                <Link to={`/profile/${profileUser?._id}`} className="profile-info-container">
                    {
                        <img
                            src={profileUser?.profilePic ? profileUser.profilePic : "/avatar.png"}
                            alt=""
                        />
                    }

                    <span className="name">
                        {profileUser?.name}
                    </span>
                </Link>
            </div>
            <div className="photo-gallery-container">
                <h2>{postsByPage?.pages[0].length > 0 ? 'Photos' : 'No photos posted up to now !'}</h2>
                <div className="photos">
                    {
                        postsByPage?.pages.map((posts) => (
                            posts.map((post, indx) => {
                                return post.img && (
                                    <Link to={`/photo/${post._id}`} key={indx}>
                                        <img src={post.img} />
                                    </Link>
                                )
                            }
                            )
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
