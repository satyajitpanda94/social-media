import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Registration from './pages/registration/Registration'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import { AuthContext } from './context/authContext'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Profile from './pages/profile/Profile'
import Photo from './pages/photo/Photo'
import Photos from './pages/photos/Photos'
import AllFriends from './pages/allFriends/AllFriends'
import SearchResult from './pages/searchResult/SearchResult'
import Navbar from './components/navbar/Navbar'
import Messenger from './pages/messenger/Messenger'
import ScrollToTop from './components/scrollToTop/ScrollToTop'
import Settings from './pages/settings/Settings'
import PageNotFound from './pages/pageNotFound/PageNotFound'

export default function App() {
  const { user } = useContext(AuthContext)
  const queryClient = new QueryClient()

  return (<div>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/signup' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/photo/:id' element={<Photo />} />
          <Route element={
            user && <>
              <Navbar />
              <Outlet />
            </>
          }>
            <Route path='/' element={user ? <Home /> : <Login />} />
            <Route path='/profile/:id' element={user ? <Profile /> : <Login />} />
            <Route path='/profile/:id/photos' element={user ? <Photos /> : <Login />} />
            <Route path='/profile/:id/friends' element={user ? <AllFriends /> : <Login />} />
            <Route path='/search' element={user ? <SearchResult /> : <Login />} />
            <Route path='/messages/:id' element={user ? <Messenger /> : <Login />} />
            <Route path='/settings' element={user ? <Settings /> : <Login />} />
          </Route>
          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </div>
  )
}
