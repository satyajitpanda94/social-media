import React from 'react'
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa6'
import { IoHome } from 'react-icons/io5'
import { MdPlace } from 'react-icons/md'
import './Intro.scss'
export default function Intro({ profileUser }) {
    return (
        <div className="intro-container">
            <h2 className='title'>
                Intro
            </h2>
            {
                profileUser?.worksAt &&
                <div className='intro-item'>
                    <FaBriefcase className='intro-item-icon' />
                    <span>{profileUser?.worksAt}</span>
                </div>
            }
            {
                profileUser?.school &&
                <div className='intro-item'>
                    <FaGraduationCap className='intro-item-icon' />
                    <span>Schooling from : {profileUser?.school}</span>
                </div>
            }
            {
                profileUser?.college &&
                <div className='intro-item'>
                    <FaGraduationCap className='intro-item-icon' />
                    <span>Graduation from : {profileUser?.college}</span>
                </div>
            }
            {
                profileUser?.currentAddress &&
                <div className='intro-item'>
                    <IoHome className='intro-item-icon' />
                    <span>Lives in {profileUser?.currentAddress}</span>
                </div>
            }
            {
                profileUser?.permanentAddress &&
                <div className='intro-item'>
                    <MdPlace className='intro-item-icon' />
                    <span>From {profileUser?.permanentAddress}</span>
                </div>
            }
        </div>
    )
}
