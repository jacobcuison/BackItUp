
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import pwShow from '../images/pw-show.png'
import pwHide from '../images/pw-hide.png'
import logoWords from "../images/logo-words.png"
import axios from 'axios'
import "../styles/styles.css"
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode"
import { createClient } from '@supabase/supabase-js'

export default function LogIn({ setCurrUser, setIsAuth, setPageTitle, setUserType }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  useEffect(() => {
    setPageTitle("Log In • BackItUp")
    setUserType("")
  }, [])

  const [token, setToken] = useState([])
  const [showPassword, setShowPassword] = useState(false);

  const clientId = "502112046738-80gbpokjtcn2qqur1su4g69jp28dtvgk.apps.googleusercontent.com"

  const { email, password } = token

  const handleChange = (event) => {
    setToken({ ...token, [event.target.name]: event.target.value });
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Google auth
  const handleCallbackResponse = async (response) => {
    console.log(response.credential);
    var userObject = jwt_decode(response.credential)
    console.log(userObject);
    try {
      console.log(userObject.sub);
      const isVerified =
        await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/verifyUserbyAuth/${userObject.sub}/GOOGLE`)
      console.log(isVerified.data, "API result is<<<<<<<<<<<<<<<<<<,");
      if (parseInt(isVerified.data) >= 0) {
        setIsAuth({ isLoggedIn: true, userID: isVerified.data })
        const currResponse = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/user/${isVerified.data}`).then()
        const curr = currResponse.data
        setCurrUser(curr)
        setUserType(`${curr.userType}`)
        console.log(curr.userType, "set user type to");
        navigate("/")
        console.log("login SUCCESS");
      } else {
        alert('You do not have a BackItUp account linked to this Google account.')
      }
    } catch (error) {
      alert('You do not have a BackItUp account linked to this Google account. Please sign up!')
      console.log("gooogle failed");
    }
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "502112046738-80gbpokjtcn2qqur1su4g69jp28dtvgk.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    )
  }, [])

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      async function fetchUser(USER_ID) {
        let { data: USER, error } = await supabase
          .from('USER')
          .select('*')
          .eq('USER_ID', USER_ID)

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setCurrUser(USER)
          setUserType(`${USER.USER_TYPE}`)
          console.log(USER, "result of fetchUser API call");
        }
      }

      await fetchUser()
      async function logIn() {
        let { data: USER, error } = await supabase
          .from('USER')
          .select('*')
          .eq('USER_EMAIL', email)
          .eq('USER_PASSWORD', password)
        if (error) {
          alert('You have input an incorrect email/password. Please refresh and try again.')
        } else {
          setIsAuth({ isLoggedIn: true, userID: USER })
          await fetchUser(USER).then(navigate('/'))
        }
      }

      await logIn()
      // const details = {
      //   userEmail: email,
      //   userPass: password
      // }

      // console.log(password, "password submitted is")

      // const isVerified =
      //   await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/verifyUser/${details.userEmail}/${details.userPass}`).then()
      // console.log(isVerified.data, "API result");

      // setIsAuth({ isLoggedIn: true, userID: isVerified.data })
      // const currResponse = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/user/${isVerified.data}`).then()
      // const curr = currResponse.data
      // setCurrUser(curr)
      // setUserType(`${curr.userType}`)
      // console.log(curr.userType, "set user type to");
      // navigate("/")
      // console.log("login SUCCESS");

    } catch (error) {
      console.error(error);
      console.log("diu")
      window.alert('You have input an incorrect email/password. Please refresh and resubmit the form.')
    }

  };

  return (
    <div className="container-center-login">
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 border rounded p-4 mt-2 shadow">
            <img src={logoWords} alt="BackItUp" style={{ maxHeight: 50 }} className="m-2 mb-4" />
            <form onSubmit={(event) => onSubmit(event)}>

              <div className="mb-3">
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="Email address"
                  name="email"
                  value={email}
                  onChange={(event) => handleChange(event)}
                />
              </div>

              <div className="mb-3">
                <div className="password-input-wrapper">
                  <input
                    required type={showPassword ? 'text' : 'password'}
                    className={showPassword ? "form-control" : "form-control password-input"}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(event) => handleChange(event)}
                  />
                  <button type="button" className="btn password-toggle" onClick={handleTogglePassword}>
                    <img src={showPassword ? pwHide : pwShow} style={{ height: 30 }} />
                  </button>

                </div>
              </div>
              <button
                type="submit"
                className="btn btn-solid-dark mb-3"
                disabled={!(email !== undefined && password !== undefined)} >Submit</button>
              <hr />
              <div id="signInDiv" className='btn btn-block mb-2'></div>
              <div>
                <small
                  id="loginHelp"
                  className="form-text text-muted">Don't have an account?
                  <a href="/adduser">Sign up today.</a></small>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
