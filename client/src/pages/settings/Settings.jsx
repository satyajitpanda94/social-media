import React, { useContext, useRef, useState } from 'react'
import './Settings.scss'
import { RiShieldKeyholeLine } from 'react-icons/ri'
import { IoKeyOutline } from 'react-icons/io5'
import Leftbar from '../../components/leftbar/Leftbar'
import axios from 'axios'
import { AuthContext } from '../../context/authContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Settings() {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const oldPassword = useRef()
    const newPassword = useRef()
    const confirmNewPassword = useRef()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const { user } = useContext(AuthContext)
    const [typeForOldPassword, setTypeForOldPassword] = useState('password');
    const [typeForNewPassword, setTypeForNewPassword] = useState('password');
    const [typeForConfirmPassword, setTypeForConfirmPassword] = useState('password');


    const handleSavePassword = async (e) => {
        e.preventDefault();

        if(oldPassword.current.value === newPassword.current.value){
            await confirmNewPassword.current.setCustomValidity("Both old and new passwords are exactly same!")
            await confirmNewPassword.current.reportValidity()
        }
        else if (newPassword.current.value !== confirmNewPassword.current.value) {
            await confirmNewPassword.current.setCustomValidity("Passwords don't match!")
            await confirmNewPassword.current.reportValidity()
        } else {
            try {
                await axios.put(`${apiBaseURL}/auth/${user._id}/password`, {
                    oldPassword: oldPassword.current.value,
                    newPassword: newPassword.current.value,
                });
                oldPassword.current.value = ''
                newPassword.current.value = ''
                confirmNewPassword.current.value = ''
                setError(null)
                setSuccess(true)
            } catch (err) {
                setSuccess(false)
                setError(err.response.data)
            }
        }
    }

    return (
        <div className='settings-wrapper'>
            <div className="leftbar-wrapper">
                <Leftbar />
            </div>
            <div className="privacy-settings-container">
                <div className="settings-container">
                    <h2>Privacy Settings</h2>
                    <hr />
                    <div className="change-password">
                        <div className="change-password-top">
                            <h3>Change Password</h3>
                            <p>Protect yourself and your friends by choosing a stronger password.</p>
                        </div>
                        <ul className='change-password-middle'>
                            <li>Choose a password that you don't use anywhere else online.</li>
                            <li>Make it easy for you to remember and difficult for others to guess.</li>
                            <li>Never share your password with anyone.</li>
                            <li>Your Password should be minimum six characters long.</li>
                        </ul>
                        <form
                            className='change-password-bottom'
                            onSubmit={handleSavePassword}
                            autoComplete="off"
                        >
                            <label className="change-password-lable">
                                <RiShieldKeyholeLine />
                                <input
                                    type={typeForOldPassword}
                                    placeholder='Current Password'
                                    className="change-password-input"
                                    required
                                    ref={oldPassword}
                                    onChange={e=>setSuccess(false)}
                                />
                                {
                                    typeForOldPassword === 'password' ?
                                        <FaEye className='eyeicon' onClick={e => setTypeForOldPassword('text')} /> :
                                        <FaEyeSlash className='eyeicon' onClick={e => setTypeForOldPassword('password')} />
                                }
                            </label>
                            <label className="change-password-lable">
                                <IoKeyOutline />
                                <input
                                    type={typeForNewPassword}
                                    placeholder='New Password'
                                    className="change-password-input"
                                    required
                                    minLength={6}
                                    ref={newPassword}
                                />
                                {
                                    typeForNewPassword === 'password' ?
                                        <FaEye className='eyeicon' onClick={e => setTypeForNewPassword('text')} /> :
                                        <FaEyeSlash className='eyeicon' onClick={e => setTypeForNewPassword('password')} />
                                }
                            </label>

                            <label className="change-password-lable">
                                <IoKeyOutline />
                                <input
                                    type={typeForConfirmPassword}
                                    placeholder='Retype New Password'
                                    className="change-password-input"
                                    onInput={e => e.target.setCustomValidity('')}
                                    required
                                    ref={confirmNewPassword}
                                />
                                {
                                    typeForConfirmPassword === 'password' ?
                                        <FaEye className='eyeicon' onClick={e => setTypeForConfirmPassword('text')} /> :
                                        <FaEyeSlash className='eyeicon' onClick={e => setTypeForConfirmPassword('password')} />
                                }
                            </label>

                            {
                                error &&
                                <span className="errorMessage">{error}</span>
                            }

                            <button className="button">Save Changes</button>
                        </form>
                        {
                            success &&
                            <span className="successMessage">Congratulations, You have successfully updated your password.</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
