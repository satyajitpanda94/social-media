import React, { useEffect, useState } from 'react'
import './SearchResult.scss'
import Leftbar from '../../components/leftbar/Leftbar'
import SearchFeed from '../../components/searchFeed/SearchFeed'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function SearchResult() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const [searchParams] = useSearchParams();
    const [searchedUsers, setSearchedUsers] = useState([])
    const [searchedPosts, setSearchedPosts] = useState([])

    useEffect(() => {
        const getSearchedUsers = async () => {
            await axios.get(`${apiBaseURL}/user/search?q=${searchParams.get('q')}`).then(
                res => setSearchedUsers(res.data)
            )
            await axios.get(`${apiBaseURL}/post/search?q=${searchParams.get('q')}`).then(
                res => setSearchedPosts(res.data)
            )
        }
        
        getSearchedUsers()

    }, [searchParams.get('q')])
    return (
        <div className='search-result-container'>
            <div className="leftbar-wrapper">
                <Leftbar />
            </div>
            <div className="search-feed-container">
                {
                    (searchedUsers.length > 0 || searchedPosts.length > 0)
                        ? < SearchFeed searchedUsers={searchedUsers} searchedPosts={searchedPosts} />
                        : <h2 className='no-result'>Can't find any results.</h2>
                }
            </div>
        </div>
    )
}
