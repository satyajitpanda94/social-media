import React from 'react'
import './SearchFeed.scss'
import { Link } from 'react-router-dom'
import Posts from '../posts/Posts'
import { IoPersonSharp } from 'react-icons/io5'

export default function SearchFeed({ searchedUsers, searchedPosts }) {
    return (
        <div className="search-feed-container">
            <div className="searched-users-container">
                <h2>People</h2>
                {
                    searchedUsers.map(searchedUser => (
                        <Link className="searched-user-container" to={`/profile/${searchedUser._id}`}>
                            {
                                searchedUser.profilePic ?
                                    <img src={searchedUser.profilePic} alt="" /> :
                                    <IoPersonSharp className='avatar' />
                            }
                            <div className="user-info">
                                <span className='name'>{searchedUser.name}</span>
                                <div className="user-intro">
                                    {
                                        searchedUser.permanentAddress &&
                                        <span>From {searchedUser.permanentAddress} -</span>
                                    }
                                    {
                                        searchedUser.currentAddress &&
                                        <span>Lives in {searchedUser.currentAddress} -</span>
                                    }
                                    {
                                        searchedUser.worksAt &&
                                        <span>Work At {searchedUser.worksAt}</span>
                                    }
                                </div>
                                <span>
                                    {
                                        searchedUser.friends.length
                                    } Friends
                                </span>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div className="searched-post-container">
                <Posts posts={searchedPosts} />
            </div>
        </div>
    )
}
