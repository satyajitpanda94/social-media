import React, { useContext, useRef, useState } from 'react'
import { GrClose } from "react-icons/gr";
import './EditProfile.scss'
import { MdFileUpload } from "react-icons/md";
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function EditProfile({ openEditProfile, setOpenEditProfile }) {
    const apiBaseURL = process.env.REACT_APP_API_BASE_URL

    const { user } = useContext(AuthContext)

    const { data: currentUser } = useQuery({
        queryKey: ["user", user._id],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseURL}/user/${user._id}`)
            return res.data
        }
    })

    const [userInputs, setUserInputs] = useState({
        profilePic: null,
        coverPic: null,
        name: currentUser?.name,
        school: currentUser?.school,
        college: currentUser?.college,
        worksAt: currentUser?.worksAt,
        currentAddress: currentUser?.currentAddress,
        permanentAddress: currentUser?.permanentAddress,
        gender: currentUser?.gender,
    })

    const profilePicProgress = useRef()
    const coverPicProgress = useRef()
    const [isDisabled, setIsDisabled] = useState(false)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: ({ userId, userInputs }) => {
            return axios.put(`${apiBaseURL}/user/${userId}`, userInputs)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['profileUser'] })
        }
    })

    const handleUserInputChange = (e) => {
        setUserInputs(pre => ({ ...pre, [e.target.name]: e.target.value }))
    }

    const uploadPicToFirebase = async (file, imageType, progressRef) => {
        setIsDisabled(true)

        const storageRef = ref(storage, `${Date.now()}${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressRef.current.value = progress
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUserInputs(pre => ({ ...pre, [imageType]: downloadURL }))
                    progressRef.current.value = 0
                    setIsDisabled(false)
                });
            }
        )
    }

    const updateProfile = async (e) => {
        e.preventDefault();

        mutation.mutate({ userId: user._id, userInputs })

        if (userInputs.profilePic) {
            await axios.post(`${apiBaseURL}/post`, {
                userId: user._id,
                img: userInputs.profilePic,
            })
            await queryClient.invalidateQueries({ queryKey: ['allposts'] })
            await queryClient.invalidateQueries({ queryKey: ['profilePostsByPage'] })
            await queryClient.invalidateQueries({ queryKey: ['user'] })
        }
        if (userInputs.coverPic) {
            await axios.post(`${apiBaseURL}/post`, {
                userId: user._id,
                img: userInputs.coverPic,
            })
            await queryClient.invalidateQueries({ queryKey: ['allposts'] })
            await queryClient.invalidateQueries({ queryKey: ['profilePostsByPage'] })
            await queryClient.invalidateQueries({ queryKey: ['user'] })
        }

        setOpenEditProfile(!openEditProfile)
    }

    return (<>
        <div className='edit-profile-top'>
            <span className='heading'>Edit Profile</span>
            <div
                className="close-button"
                onClick={e => setOpenEditProfile(!openEditProfile)}
            >
                <GrClose />
            </div>
        </div>
        <hr />
        <form className="edit-profile-bottom" onSubmit={updateProfile}>
            <div className="profile-pic">
                <span className='title'>Profile picture</span>
                <div className="right">
                    <div className="image-container">
                        <img
                            src={
                                userInputs.profilePic
                                    ? userInputs.profilePic
                                    : currentUser?.profilePic
                                        ? currentUser?.profilePic
                                        : '/avatar.png'
                            }
                            alt="" />
                        <progress ref={profilePicProgress} style={{ width: '100px' }} value="0" max="100" />
                    </div>
                    <label className='upload-button' htmlFor='profilePic' >
                        <input
                            type="file"
                            id='profilePic'
                            style={{ display: 'none' }}
                            onChange={(e) => uploadPicToFirebase(e.target.files[0], 'profilePic', profilePicProgress)}
                        />
                        <MdFileUpload />
                        Upload New
                    </label>
                </div>
            </div>
            <div className="cover-pic">
                <span className='title'>Cover picture</span>
                <div className="right">
                    <div className="image-container">
                        <img
                            src={
                                userInputs.coverPic
                                    ? userInputs.coverPic
                                    : currentUser?.coverPic
                                        ? currentUser?.coverPic
                                        : '/coverpic.jpg'
                            }
                            alt="" />
                        <progress ref={coverPicProgress} style={{ width: '100px' }} value="0" max="100" />
                    </div>
                    <label className='upload-button' htmlFor='coverPic' >
                        <input
                            type="file"
                            id='coverPic'
                            style={{ display: 'none' }}
                            onChange={(e) => uploadPicToFirebase(e.target.files[0], 'coverPic', coverPicProgress)}
                        />
                        <MdFileUpload />
                        Upload New
                    </label>
                </div>
            </div>

            <hr />

            <h2>Intro</h2>

            <div className="intro-item">
                <h3>Name</h3>
                <input type="text" name="name" required onChange={handleUserInputChange} value={userInputs.name || ''} />
            </div>
            <div className="intro-item">
                <h3>Works At</h3>
                <input type="text" name='worksAt' required onChange={handleUserInputChange} value={userInputs.worksAt || ''} />
            </div>
            <div className="intro-item">
                <h3>Studied At (School)</h3>
                <input type="text" name='school' required onChange={handleUserInputChange} value={userInputs.school || ''} />
            </div>
            <div className="intro-item">
                <h3>Studied At (College)</h3>
                <input type="text" name='college' required onChange={handleUserInputChange} value={userInputs.college || ''} />
            </div>
            <div className="intro-item">
                <h3>Lives In</h3>
                <input type="text" name='currentAddress' required onChange={handleUserInputChange} value={userInputs.currentAddress || ''} />
            </div>
            <div className="intro-item">
                <h3>From</h3>
                <input type="text" name='permanentAddress' required onChange={handleUserInputChange} value={userInputs.permanentAddress || ''} />
            </div>

            <hr />

            <div className='gender' onChange={handleUserInputChange} >
                <h3>Gender</h3>
                <div className="radio-buttons">
                    <label htmlFor='male' className='radio-button'>
                        <input type="radio" id='male' name='gender' value="male" checked={userInputs.gender === 'male'} onChange={e => { }} required />
                        Male
                    </label>
                    <label htmlFor='female' className='radio-button'>
                        <input type="radio" id='female' name='gender' value="female" checked={userInputs.gender === 'female'} onChange={e => { }} />
                        Female
                    </label>
                    <label htmlFor='other' className='radio-button'>
                        <input type="radio" id='other' name='gender' value="other" checked={userInputs.gender === 'other'} onChange={e => { }} />
                        Other
                    </label>
                </div>
            </div>

            <hr />

            <button
                className="submit-button"
                type='submit'
                disabled={isDisabled}
            >
                Save Changes
            </button>
        </form>
    </>)
}
