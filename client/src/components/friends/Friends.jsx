import React from 'react'
import './Friends.scss'
import Friend from '../friend/Friend'
import { Link } from 'react-router-dom'
export default function Friends({ profileUser }) {
    return (
        <div className="friends-wrapper">
            <Link className="title" to={`/profile/${profileUser?._id}/friends`}>
                Friends
            </Link>

            <div className="friends-container">
                {
                    profileUser?.friends.map(
                        (friendId, indx) => (
                            indx < 9 &&
                            <Friend friendId={friendId} key={indx} />
                        )
                    )
                }
            </div>
        </div >
    )
}
