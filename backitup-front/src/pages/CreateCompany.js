import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import pwShow from '../images/pw-show.png'
import pwHide from '../images/pw-hide.png'

export default function CreateCompany({ currUser }) {

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
      const data = {
        userName: name,
        userEmail: email,
        userHP: hp,
        userPass: password,
        userType: "Company",
        userEvidence: evidence,
        userLinkedInLink: "",
        userShowContact: true
      };

      console.log(data)

      // Create a user with the created wallet.java
      const response = await axios.post(`https://orbital-1690142964708.azurewebsites.net/api/createCompany/${currUser.userID}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      );
      console.log(response.data);
      navigate("/createcompany/thanks")

    } catch (error) {
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
                placeholder={currUser.userName}
                value={currUser.userName}
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