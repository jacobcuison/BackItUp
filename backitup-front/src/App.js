import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Navbar from "./layout/Navbar"
import Home from "./pages/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AddUser from "./users/AddUser"
import Post from './pages/Post'
import Invest from './pages/Invest'
import Admin from './pages/admin/Admin';
import Thanks from './pages/Thanks';
import { useEffect, useState } from 'react';
import LogIn from './pages/LogIn';
import CreatePost from './pages/CreatePost';
import CreateCompany from './pages/CreateCompany';
import Wallet from './pages/wallet/Wallet';
import Oops from './pages/Oops';
import Topup from './pages/Topup';
import Withdraw from './pages/Withdraw';
import Footer from './layout/Footer'
import { Helmet } from 'react-helmet';
import Profile from './pages/Profile';
import EditUser from './users/EditUser';
import ThanksTopup from './pages/thanks/ThanksTopup'
import ThanksAddUser from './pages/thanks/ThanksAddUser'
import ThanksWithdraw from './pages/thanks/ThanksWithdraw';
import ThanksCreateCompany from './pages/thanks/ThanksCreateCompany';
import EditPost from './pages/EditPost';
import HowToInvest from './pages/get-started/HowToInvest';
import HowToRaise from './pages/get-started/HowToRaise';
import About from './pages/About';
import { gapi } from 'gapi-script'
import AdminPassword from './pages/admin/AdminPassword'
import Resources from './pages/get-started/Resources';
import { createClient } from '@supabase/supabase-js'

function App() {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [isAuth, setIsAuth] = useState({ isLoggedIn: false, userID: null })
  const [currUser, setCurrUser] = useState({})
  const [userType, setUserType] = useState("Public")

  const [pageTitle, setPageTitle] = useState("BackItUp • Equity crowd-funding made easy")

  const { isLoggedIn, isCompany, userID } = isAuth

  return (
    <div className="App">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <Router>
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} currUser={currUser} setCurrUser={setCurrUser} userType={userType} />

        <Routes>

          {/* Public routes */}
          <Route exact path="/" element={<Home setPageTitle={setPageTitle} setUserType={setUserType} isAuth={isAuth} />} />
          <Route exact path="/adduser" element={<AddUser setPageTitle={setPageTitle} setUserType={setUserType} />} />
          <Route path="/post" element={<Post isAuth={isAuth} setPageTitle={setPageTitle} userType={userType} currUser={currUser} />} />
          <Route path="/post/:id" element={<Post isAuth={isAuth} setPageTitle={setPageTitle} userType={userType} currUser={currUser} />} />
          <Route exact path="/thanks" element={<Thanks setPageTitle={setPageTitle} />} />
          <Route exact path="/login" element={<LogIn setCurrUser={setCurrUser} setIsAuth={setIsAuth} setPageTitle={setPageTitle} setUserType={setUserType} />} />
          <Route path="/create" element={<CreatePost currUser={currUser} setPageTitle={setPageTitle} />} />
          <Route path="/createcompany" element={<CreateCompany currUser={currUser} />} />
          <Route path="/wallet" element={<Wallet currUser={currUser} setCurrUser={setCurrUser} />} />
          <Route path="/wallet/:id" element={<Wallet currUser={currUser} />} />
          <Route path="/oops" element={<Oops setPageTitle={setPageTitle} />} />
          <Route path="/profile" element={<Profile currUser={currUser} setPageTitle={setPageTitle} userType={userType} />} />
          <Route path="/profile/:id" element={<Profile currUser={currUser} setPageTitle={setPageTitle} userType={userType} />} />
          {/* <Route path ="/profile" element={<Profile currUser={currUser} setPageTitle={setPageTitle} />} /> */}
          <Route path="/profile/:id/edit" element={<EditUser currUser={currUser} />} />

          <Route path="/getstarted/invest" element={<HowToInvest setPageTitle={setPageTitle} setUserType={setUserType} />} />
          <Route path="/getstarted/raise" element={<HowToRaise setPageTitle={setPageTitle} setUserType={setUserType} />} />
          <Route path="/about" element={<About setPageTitle={setPageTitle} setUserType={setUserType} />} />
          <Route path="/getstarted" element={<Resources setPageTitle={setPageTitle} setUserType={setUserType} />} />

          <Route path="/topup/thanks" element={<ThanksTopup setPageTitle={setPageTitle} />} />
          <Route path="/adduser/thanks" element={<ThanksAddUser setPageTitle={setPageTitle} />} />
          <Route path="/withdraw/thanks" element={<ThanksWithdraw setPageTitle={setPageTitle} />} />
          <Route path="/createcompany/thanks" element={<ThanksCreateCompany setPageTitle={setPageTitle} />} />
          <Route path="/post/:id/edit" element={<EditPost currUser={currUser} isAuth={isAuth} setPageTitle={setPageTitle} />} />

          <Route path="/admin" element={<AdminPassword setUserType={setUserType} setPageTitle={setPageTitle} />} />
          <Route path="/admin/auth" element={<Admin setUserType={setUserType} />} />

          {/* Private routes */}
          <Route path="/invest/:id" element={<Invest isAuth={isAuth} />} />
          <Route path="/topup" element={<Topup currUser={currUser} isAuth={isAuth} setPageTitle={setPageTitle} />} />
          <Route path="/withdraw" element={<Withdraw currUser={currUser} isAuth={isAuth} setPageTitle={setPageTitle} />} />

        </Routes>

        <Footer />
      </Router>

    </div>
  );
}

export default App;
