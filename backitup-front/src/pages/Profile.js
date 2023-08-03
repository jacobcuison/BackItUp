import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import Wallet from './wallet/Wallet'
import InvestmentUser from "./wallet/InvestmentUser"
import ViewUser from "../users/ViewUser"
import PostUser from './wallet/PostUser'
import { createClient } from '@supabase/supabase-js'

import { Image } from 'react-bootstrap'

import '../styles/styles.css'

export default function Profile({ currUser, setPageTitle, userType }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [displayA, setDisplayA] = useState(true) // profile
  const [displayB, setDisplayB] = useState(false) // wallet
  const [displayC, setDisplayC] = useState(false) // investments OR posts

  const showA = () => {
    setDisplayA(true)
    setDisplayB(false)
    setDisplayC(false)
  }

  const showB = () => {
    setDisplayA(false)
    setDisplayB(true)
    setDisplayC(false)
  }

  const showC = () => {
    setDisplayA(false)
    setDisplayB(false)
    setDisplayC(true)
  }

  useEffect(() => {
    setPageTitle(`${currUser.USER_NAME}'s Profile • BackItUp`)
    console.log("curr user type", userType);
    console.log("picture showing: ", currUser.USER_PHOTOURL);
  }, []);

  return (
    <div className="container">
      <div className="container my-3">
        <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow">
          <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
            <h1 class="hero-title display-4 fw-bold lh-1"
              style={{ textAlign: "left" }}>Hello, {currUser.USER_NAME}.</h1>
            <p class="lead" style={{ textAlign: "left" }}>
              The world is amazing because of people like you.</p>
          </div>
          <div class="col-lg-4 p-3 p-lg-5 pt-lg-3 overflow-hidden">
            <div className="image-container">
              <div className="circle-crop-with-shadow" style={{ width: "70%" }}>
                <Image
                  src={currUser.USER_PHOTOURL}
                  alt="[No Profile Photo Yet]"
                  className="image-inside-circle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2" style={{ height: '70vh' }}>
          <div class="nav nav-pills bg-light rounded flex-column mt-2">
            <button
              className={displayA
                ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
                : 'btn btn-admin-inactive flex-fill my-2 mx-1'}
              onClick={() => showA()}>My Info</button>
            <button className={displayB
              ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
              : 'btn btn-admin-inactive flex-fill my-2 mx-1'}
              onClick={() => showB()}>My Wallet</button>
            {userType == "Founder" ? <></> :
              <button className={displayC
                ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
                : 'btn btn-admin-inactive flex-fill my-2 mx-1'}
                onClick={() => showC()}>{currUser.USER_TYPE == "Company" ? "My Posts" : "My Portfolio"}</button>
            }
          </div>
        </div>
        <div className="col-md-10">
          {
            displayA
              ? <ViewUser currUser={currUser} />
              : displayB
                ? <Wallet currUser={currUser} />
                : currUser.USER_TYPE === 'Company'
                  ? <PostUser currUser={currUser} />
                  : <InvestmentUser currUser={currUser} />
          }
        </div>
      </div>

    </div>
  )
}
