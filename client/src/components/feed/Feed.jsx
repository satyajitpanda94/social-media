import React, { useContext, useEffect } from 'react'
import SharePost from '../sharePost/SharePost'
import './Feed.scss'
import Posts from '../posts/Posts'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export default function Feed() {
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL
  const { user } = useContext(AuthContext)

  const { data: timelinePosts, fetchNextPage } = useInfiniteQuery({
    queryKey: ["timelinePostsByPage"],
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(`${apiBaseURL}/post/timeline/${user._id}?page=${pageParam}`)
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
    <div className='feed-container'>
      <SharePost />
      {
        timelinePosts?.pages.map(
          (postsByPage, idx) => <Posts posts={postsByPage} key={idx} />
        )
      }
    </div>
  )
}
