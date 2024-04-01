import React from 'react'
import './Home.scss'
import Navbar from '../../components/navbar/Navbar'
import Leftbar from '../../components/leftbar/Leftbar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'

export default function Home() {
    return (
        <div>
            <div className="home-container">
                <div className="leftbar-wrapper">
                    <Leftbar />
                </div>
                <div className="feed-wrapper">
                    <Feed />
                </div>
                <div className="rightbar-wrapper">
                    <Rightbar />
                </div>
            </div>
        </div>
    )
}
