import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import pwShow from '../images/pw-show.png'
import pwHide from '../images/pw-hide.png'
import { createClient } from '@supabase/supabase-js'

export default function CreateCompany({ currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  const [company, setCompany] = useState({
    userName: "",
    userEmail: "",
    userHP: "",
    userPass: "",
    userType: "",
    userVerified: false,
    userEvidence: "",
    userLinkedInLink: "",
    userShowContact: true
  })

  const { name, email, hp, password, evidence } = company;

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setCompany({ ...company, [event.target.name]: event.target.value });
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      async function insertData() {
        const { data, error } = await supabase
          .from('USER')
          .insert([
            {
              USER_NAME: name,
              USER_EMAIL: email,
              USER_HP: hp,
              USER_PASS: password,
              USER_TYPE: 'Company',
              USER_VERIFIED: 0,
              USER_LINKEDINLINK: '',
              USER_SHOWCONTACT: true,
              USER_OAUTHTYPE: 'USER',
              USER_OAUTHIDENTIFIER: '',
              USER_EVIDENCE: '',
              USER_PHOTOURL: '',
              WALLET_ID: currUser.WALLET_ID,
            },
          ])
          .select()

        if (error) {

          alert("Error occured. Please try again.")
          console.error('Error inserting data:', error);
        } else {
          navigate("/createcompany/thanks")
          // console.log(POST);
        }
      }

      await insertData()

      // const data = {
      //   userName: name,
      //   userEmail: email,
      //   userHP: hp,
      //   userPass: password,
      //   userType: "Company",
      //   userEvidence: evidence,
      //   userLinkedInLink: "",
      //   userShowContact: true
      // };

      // console.log(data)

      // Create a user with the created wallet.java
      // const response = await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/createCompany/${currUser.userID}`, data, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }

      // );
      // console.log(response.data);

    } catch (error) {
      console.log(error);
      alert("Error occured. Please try again.")
    }


  };

  return (
    <div className="container-center-signup">
      <div className="col-md-6 border rounded p-4 mt-2 shadow">
        <h2 className="text-center m-4">Make your dreams come true.</h2>
        <form onSubmit={(event) => onSubmit(event)}>
          <div className='row g-3' style={{ textAlign: "left" }}>
            <div className="col-md-6 mb-3">
              <label
                htmlFor="Name"
                className="form-label">
                Company Name
              </label>
              <input
                required type={"text"}
                className="form-control"
                placeholder=""
                name="name"
                value={name}
                onChange={(event) => handleChange(event)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label
                htmlFor="Founder"
                className="form-label">
                Founder
              </label>
              <input
                required type={"text"}
                className="form-control"
                placeholder={currUser.USER_NAME}
                value={currUser.USER_NAME}
                name="founder"
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <label
                htmlFor="Email"
                className="form-label">
                Company Email
              </label>
              <input
                required type={"text"}
                className="form-control"
                placeholder=""
                name="email"
                value={email}
                onChange={(event) => handleChange(event)}
              />
            </div>
            <div className=" col-md-6 mb-3">
              <label
                htmlFor="HP"
                className="form-label">
                Company HP Number
              </label>
              <input
                required type={"text"}
                className="form-control"
                placeholder="+65 9123 4567"
                name="hp"
                value={hp}
                onChange={(event) => handleChange(event)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label
                htmlFor="Password"
                className="form-label">
                Password
              </label>
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
            <button type="submit" className="btn btn-solid-dark">Submit</button>
          </div>
        </form>
      </div>

    </div>

  )
}