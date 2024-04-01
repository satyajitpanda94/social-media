import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import axios from 'axios'
import Post from '../post/Post'
import './Posts.scss'
import { useQuery } from '@tanstack/react-query'

export default function Posts({ posts }) {
    return (
        <div className='posts-container'>
            {
                posts !== undefined &&
                posts.map((post, index) => (
                    <Post post={post} key={index} />
                ))
            }
        </div>
    )
}
