import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import pwShow from '../images/pw-show.png'
import pwHide from '../images/pw-hide.png'
import logoWords from "../images/logo-words.png"
import { createClient } from '@supabase/supabase-js'

import "../styles/styles.css"

export default function ViewUser({ currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  const [show, setShow] = useState(true);
  const [user, setUser] = useState({
    userName: currUser.USER_NAME,
    userEmail: currUser.USER_EMAIL,
    userHP: currUser.USER_HP,
    userPass: currUser.USER_PASS,
    userType: currUser.USER_TYPE,
    userVerified: currUser.USER_VERIFIED,
    userEvidence: currUser.USER_EVIDENCE,
    userLinkedinLink: currUser.USER_LINKEDINLINK,
    userShowContact: currUser.USER_SHOWCONTACT,
    userPhotoURL: currUser.USER_PHOTOURL
  })

  const [photo, setPhoto] = useState(null)
  const [evidence, setEvidence] = useState(null)

  const handleEvidenceChange = (e) => {
    setEvidence(e.target.files[0])
  }

  const [isEdit, setIsEdit] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
    console.log('updating: ', user);
  }

  const handleTogglePassword = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword);
  };

  const handleShowChange = (e) => {
    e.preventDefault()
    setShow(!show)
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleEditToggle = (e) => {
    e.preventDefault()
    setIsEdit(!isEdit);
  };

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      async function updateUser() {
        const { data, error } = await supabase
          .from('USER')
          .update({
            USER_NAME: user.userName,
            USER_EMAIL: user.userEmail,
            USER_HP: user.userHP,
            USER_PASS: user.userPass,
            USER_TYPE: user.userType,
            USER_EVIDENCE: user.userEvidence,
            USER_LINKEDINLINK: user.userLinkedinLink,
            USER_SHOWCONTACT: user.userShowContact,
            USER_PHOTOURL: user.userPhotoURL
          })
          .eq('USER_ID', currUser.USER_ID)
          .select()

        if (error) {
          console.log(error);
        } else {
          console.log('successful update', data);
        }

      }

      await updateUser()

      // // Create a user with the created wallet.java
      // const response = await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/editUser/${currUser.userID}`, user, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }

      // );
      // setIsEdit(!isEdit)

    } catch (error) {
      console.error(error);
      console.log("Edit User failed")
    } finally {
      setIsEdit(!isEdit)
    }

    // try {
    //   // Upload photo to local source folder
    //   const photoFormData = new FormData()
    //   photoFormData.append('file', photo)

    //   await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/user/submitPhoto/${currUser.userID}`, photoFormData)
    //     .then((response) => {
    //       console.log("Successful image upload", response.data);
    //     })

    // } catch (error) {
    //   console.log("Error uploading image", error);
    // }

    // try {
    //   // Upload photo to local source folder
    //   const evidenceFormData = new FormData()
    //   evidenceFormData.append('file', evidence)

    //   await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/user/submitEvidence/${currUser.userID}`, evidenceFormData)
    //     .then((response) => {
    //       console.log("Successful evidence upload", response.data);
    //     })

    // } catch (error) {
    //   console.log("Error uploading evidence", error);
    // }
  };

  return (

    <div className="container">
      <div className="border rounded p-4 mt-2 shadow">
        <h2 className="mb-4" style={{ textAlign: "left" }}>Personal Details</h2>
        <form>
          <div className="row g-3">
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="Name"
                className="form-label">
                Name
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder={`${user.userName}`}
                name="userName"
                value={user.userName}
                onChange={(event) => handleChange(event)}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="HP"
                className="form-label">
                HP Number
              </label>
              <input
                type={"number"} // changed from "text"
                className="form-control"
                placeholder={`${user.userHP}`}
                name="userHP"
                value={user.userHP}
                onChange={(event) => handleChange(event)}

                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }} >
              <label
                htmlFor="Email"
                className="form-label">
                Email
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder={`${user.userEmail}`}
                name="userEmail"
                value={user.userEmail}
                onChange={(event) => handleChange(event)}
                disabled={!isEdit} />
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="Password"
                className="form-label">
                Password
              </label>
              <div className='password-input-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={showPassword ? "form-control" : "form-control password-input"}
                  placeholder={`${user.userPass}`}
                  name="userPass"
                  value={user.userPass}
                  onChange={(event) => handleChange(event)}
                  disabled={!isEdit}
                />
                <button className="btn password-toggle align-end" onClick={e => handleTogglePassword(e)}>
                  <img src={showPassword ? pwHide : pwShow} style={{ height: 30 }} />
                </button>
              </div>
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="Photo"
                className="form-label">
                Profile Photo
              </label>
              <input
                type={"text"}
                className="form-control"
                name="userPhotoURL"
                value={user.userPhotoURL}
                onChange={(event) => handleChange(event)}
                disabled={!isEdit}
              />
              <small id="evidenceHelp" class="form-text text-muted">Please choose a square image.</small>
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="LinkedIn"
                className="form-label">
                LinkedIn
              </label>
              <input
                type={"text"}
                className="form-control"
                name="userLinkedinLink"
                value={user.userLinkedinLink}
                onChange={(event) => handleChange(event)}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="Evidence"
                className="form-label">
                Documents
              </label>
              <input
                type={"text"}
                className="form-control"
                name="userEvidence"
                value={user.userEvidence}
                onChange={(event) => handleChange(event)}
                disabled={!isEdit}
              />

              <small
                id="evidenceHelp"
                class="form-text text-muted">
                This will be cross-referenced by our admin team before we verify your account. After that, you can create a company.</small>
            </div>
            {/* <div className="col-md-6 mb-3" style={{ textAlign: "left" }}>
              <label
                htmlFor="show"
                className="form-label">
                Display contact information?
              </label>
              <input
                type="checkbox"
                className="btn btn-success"
                name="show"
                onChange={(event) => handleShowChange(event)}
                disabled={!isEdit}
              />
            </div> */}
            {
              isEdit
                ? <button
                  type="submit"
                  className="btn btn-solid-dark mb-3"
                  onClick={(e) => onSubmit(e)}>Save Changes</button>
                : <button
                  type="button"
                  className="btn btn-outline-dark mb-3"
                  onClick={(e) => handleEditToggle(e)}>Edit Details</button>
            }
          </div>
        </form>
      </div>
    </div>
  )
}