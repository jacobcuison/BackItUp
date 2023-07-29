import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import pwShow from '../images/pw-show.jpg'
import pwHide from '../images/pw-hide.jpg'
import logoWords from "../images/logo-words.png"
import AddUserAuth from "./auth/AddUserAuth"
import jwt_decode from "jwt-decode";
import { createClient } from '@supabase/supabase-js'

import "../styles/styles.css"

// Step 1: Email and password input
const Step1 = ({ onNext, user, handleChange, setUser }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission for Step 1
    // Validate email, password, confirm password, etc.
    // Call onNext to proceed to the next step
    onNext();
  };

  const handleCallbackResponse = (response) => {
    console.log(response.credential);
    var userObject = jwt_decode(response.credential)

    setUser({
      ...user,
      userEmail: userObject.email,
      userOauthType: 'GOOGLE',
      userOauthIdentifier: userObject.sub,
    });

    onNext();
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

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="container-center-login">
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 border rounded p-4 mt-2 shadow">
            <form onSubmit={handleSubmit}>
              <h2>Step 1: Account Information</h2>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <label
                  htmlFor="Email"
                  className="form-label">
                  Email
                </label>
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="example@backitup.com"
                  name="userEmail"
                  value={user.userEmail}
                  onChange={(event) => handleChange(event)}
                />
                <small
                  id="emailHelp"
                  class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>

              <button className="btn btn-outline-dark mb-2" type="submit">Next</button>
            </form>
            <hr />
            <div id="signInDiv" className='btn btn-block mb-2'></div>
            <br />
            <small
              id="loginHelp"
              className="form-text text-muted">Already have an account?
              <a href="/login">Log in now.</a></small>
          </div>
        </div>
      </div>
    </div>
  );
};


// Step 2: Other personal details
const Step2 = ({ onPrevious, onSubmit, user, handleChange }) => {

  return (
    <div className="container-center-signu mt-3 mb-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 border rounded p-4 mt-2 shadow">
            <form onSubmit={onSubmit}>
              <h2>Step 2: Personal Information</h2>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <label
                  htmlFor="Password"
                  className="form-label">
                  Password
                </label>
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="Password"
                  name="userPass"
                  value={user.userPass}
                  onChange={(event) => handleChange(event)}
                />
                <small
                  id="passwordHelp"
                  class="form-text text-muted">Please choose a strong password.</small>
              </div>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <label
                  htmlFor="Name"
                  className="form-label">
                  Name
                </label>
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="Kim"
                  name="userName"
                  value={user.userName}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <label
                  htmlFor="HP"
                  className="form-label">
                  HP Number
                </label>
                <input
                  required
                  type={"text"}
                  className="form-control"
                  placeholder="+65 9123 4567"
                  name="userHP"
                  value={user.userHP}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div className="mb-3" style={{ textAlign: "left" }}>
                <label
                  htmlFor="Type"
                  className="form-label">
                  Account Type
                </label>
                <select
                  required
                  class="form-control"
                  name="userType"
                  id="selectList"
                  onChange={(event) => handleChange(event)}>
                  <option value="" defaultValue disabled hidden>Click to choose one...</option>
                  <option value="Founder">Founder</option>
                  <option value="Investor">Investor</option>
                </select>
              </div>


              <button
                className="btn btn-outline-dark mx-1"
                type="button"
                onClick={onPrevious}>Previous</button>
              <button
                className="btn btn-solid-dark mx-1"
                type="submit">Submit</button>
            </form>
          </div></div></div></div>
  );
};


export default function AddUser({ setPageTitle, setUserType }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  useEffect(() => {
    setUserType("")
    setPageTitle("Register • BackItUp")
  }, [])

  const [step, setStep] = useState(1);
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    userHP: "",
    userPass: "",
    userType: "Founder",
    userVerified: false,
    userEvidence: "",
    userOauthType: "",
    userOauthIdentifier: "",
    userShowContact: true
  })

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    console.log(user.userType, "userType is");
  }

  const handleNext = () => {
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      async function createUser() {
        async function countUsers() {
          let { data: USER, error } = await supabase
            .from('USER')
            .select('*')
            // .eq('POST_STATUS', status)
    
          if (error) {
            console.error('Error fetching data:', error);
          } else {
            return USER.length
            console.log(POST);
          }
        }

        let count = await countUsers()
        
        const { data, error } = await supabase
          .from('USER')
          .insert([
            {
              USER_NAME: user.userName,
              USER_EMAIL: user.userEmail,
              USER_HP: user.userHP,
              USER_PASS: user.userPass,
              USER_TYPE: user.userType,
              USER_VERIFIED: 0,
              USER_LINKEDINLINK: '',
              USER_SHOWCONTACT: true,
              USER_OAUTHTYPE: user.userOauthType,
              USER_OAUTHIDENTIFIER: user.userOauthIdentifier,
              USER_EVIDENCE: user.userEvidence,
              USER_PHOTOURL: '',
              WALLET_ID: count,
            },
          ])
          .select()

        if (error) {
          alert("The email address you entered already has an associated BackItUp account.")
        } else {
          navigate("/adduser/thanks")
        }
      }

      await createUser()
      // const data = {
      //   userName: user.userName,
      //   userEmail: user.userEmail,
      //   userHP: user.userHP,
      //   userPass: user.userPass,
      //   userType: user.userType,
      //   userEvidence: user.userEvidence,
      //   userOauthType: user.userOauthType,
      //   userOauthIdentifier: user.userOauthIdentifier
      // };

      // console.log(data)

      // Create a user with the created wallet.java
      // const response = await axios.post('https://orbital-1690146023037.azurewebsites.net/api/createUserbyAuth', data, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }
      // );
      // navigate("/adduser/thanks")
    } catch (error) {
      alert("The email address you entered already has an associated BackItUp account.")
      console.error(error);
    }


  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleNext} user={user} handleChange={handleChange} setUser={setUser} />}
      {step === 2 && (
        <Step2
          onPrevious={handlePrevious}
          onSubmit={onSubmit}
          handleChange={handleChange}
          user={user}
        />
      )}
    </div>

  )
}