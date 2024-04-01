import React from 'react'
import './PhotoGallery.scss'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function PhotoGallery({ profileUserId }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { data: posts } = useQuery({
        queryKey: ["allposts", profileUserId],
        queryFn: async () => {
            const res = await axios.get(apiBaseURL + "/post/profile/" + profileUserId + "?limit=50")
            return res.data
        }
    })

    return (
        <div className="photo-gallery-wrapper">
            <Link className="title" to={`/profile/${profileUserId}/photos`}>
                Photos
            </Link>
            <div className="photo-gallery">
                {
                    posts && posts.filter(post => post.img).map(
                        (post, indx) => {
                            return indx < 9 &&
                                (<Link to={`/photo/${post._id}`} key={indx}>
                                    <img src={post?.img} alt="" />
                                </Link>)
                        }
                    )
                }
            </div>
        </div>
    )
}
