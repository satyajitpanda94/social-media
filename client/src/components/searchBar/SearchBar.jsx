import React, { useState } from 'react'
import './SearchBar.scss'
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const navigate = useNavigate()
    const [searchedTerm, setSearchedTerm] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchedTerm)
            navigate(`/search?q=${searchedTerm}`)
    }

    return (
        <form
            className='searchbar-container'
            onSubmit={handleSearch}
        >
            <IoSearch />
            <input type="text" value={searchedTerm} onChange={e => setSearchedTerm(e.target.value)} />
        </form>

    )
}
