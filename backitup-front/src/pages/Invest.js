import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/styles.css'
import { createClient } from '@supabase/supabase-js'

export default function Invest(props) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  const [amt, setAmount] = useState("")
  const [curr, setCurr] = useState("")
  const { id } = useParams()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    async function fetchUser() {
      let { data: USER, error } = await supabase
        .from('USER')
        .select('*')
        .eq('USER_ID', props.isAuth.userID)
        
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setCurr(USER);
        // console.log(POST);
      }
    }

    await fetchUser()

    // console.log(props.isAuth.userID);
    // const currUser = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/user/${props.isAuth.userID}`)
    // setCurr(currUser.data)
    // console.log("nice you hav eloaded curr user" + currUser.userID);
  }

  const onInputChange = (event) => {
    const result = event.target.value.replace(/\D/g, '');
    setAmount(result);
  }

  // Post user investment info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    // const { userID } = 999;
    // console.log(userID, "curr user is (investpg)");
    const date = new Date();
    const formattedDate = date.toISOString().substr(0, 19);
    
    // async function invest() {
    //   let { data: USER, error } = await supabase
    //     .from('INVEST')
    //     .select('*')
    //     .eq('POST_ID', inv.SHARE_ID)
    //     // .eq('POST_STATUS', status)

    //   if (error) {
    //     console.error('Error fetching data:', error);
    //   } else {
    //     setInvsPost(POST);
    //     // console.log(POST);
    //   }
    // }

    const result =
      await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/invest/${id}/${props.isAuth.userID}/${amt}/${formattedDate}`)
    if (result.data > 0) {
      navigate("/thanks")
    } else {
      result.data === -1
      ? alert("Invalid user.")
      : result.data === -2
      ? alert("Invalid share.")
      : result.data === -3
      ? alert("Insufficient Purchasing Minimum Share Amount.")
      : result.data === -4
      ? alert("Insufficient Remaining Share.")
      : alert("Insufficient Active Balance.")
    }
  }

  return (

    <div className="container-center-login">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Back the future now!</h2>
          <form onSubmit={(event) => onSubmit(event)}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">
                Amount
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Enter a number..."
                name="amt"
                value={amt}
                onChange={(event) => onInputChange(event)} />
            </div>
            <button type="submit" className="btn btn-solid-dark">Invest Now!</button>
          </form>
        </div>
      </div>
    </div>
  )
}
