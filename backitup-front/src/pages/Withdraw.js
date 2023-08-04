import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Oops from './Oops.js'
import qr from '../paynow.jpg'
import { createClient } from '@supabase/supabase-js'

export default function Withdraw({ currUser, isAuth, setPageTitle }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  useEffect(() => {
    setPageTitle("Withdraw • BackItUp")
  }, [])

  const [topup, setTopup] = useState({
    walletID: "",
    withdrawalAmount: "",
    withdrawalPaynow: "",
    withdrawalDT: "",
    withdrawalVerified: ""
  })

  const { wallet_ID, withdrawalAmount, withdrawalPaynow, dt, verified } = topup;
  const handleChange = (e) => {
    setTopup({ ...topup, [e.target.name]: e.target.value })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const date = new Date();
      const formattedDate = date.toISOString().substr(0, 19);

      async function getWallet(WALLET_ID) {
        const { data: WALLET, error } = await supabase
          .from('WALLET')
          .select()
          .eq('WALLET_ID', WALLET_ID)
  
        if (error) {
          console.log('Cannot get wallet :', error);
        } else {
          return WALLET[0]
        }
      }

      const userWallet = await getWallet(currUser.WALLET_ID)

      if (parseFloat(withdrawalAmount) < 0) {
        alert('Please enter a positive number.')
        throw new Error()
      }

      if (parseFloat(withdrawalAmount) > userWallet.ACTIVE_BALANCE) {
        alert('Please ensure you have sufficient balance.')
        throw new Error()
      }

      async function withdraw() {
        const { data, error } = await supabase
          .from('WITHDRAWAL')
          .insert([
            {
              WITHDRAWAL_AMOUNT: parseFloat(withdrawalAmount),
              WITHDRAWAL_PAYNOW: parseInt(withdrawalPaynow),
              WITHDRAWAL_DT: formattedDate,
              WITHDRAWAL_VERIFIED: 0,
              WALLET_ID: currUser.WALLET_ID,
            },
          ])
          .select()

        if (error) {

          // alert("Please enter a valid amount.")
          console.log("withdrawal failure", error)
        } else {
        }

      }

      await withdraw()

      

      async function changeWallet(WALLET, change) {
        const { data, error } = await supabase
          .from('WALLET')
          .update({ 'ACTIVE_BALANCE': WALLET.ACTIVE_BALANCE + change })
          .eq('WALLET_ID', WALLET.WALLET_ID)
          .select()
  
        if (error) {
          console.log('Error changing wallet', error);
        } else {
          navigate("/withdraw/thanks")
        }
      }

      await changeWallet(userWallet, parseFloat(withdrawalAmount))
      // const data = {
      //   walletID: currUser.wallet.wallet_ID,
      //   withdrawalAmount: parseFloat(withdrawalAmount),
      //   withdrawalPaynow: parseInt(withdrawalPaynow),
      //   withdrawalDT: formattedDate,
      //   withdrawalVerified: 0
      // };

      // const response = await axios.post('https://orbital-1690146023037.azurewebsites.net/api/withdrawal', data, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });

      // if (response.data == "") {
      //   throw new Error()
      // }

      // console.log(response, "withdrawal responseeee <>SA<D>AS<DA><DSA>D");
      // console.log("withdrawal success");
      navigate("/withdraw/thanks")
    } catch (error) {
      // alert("Please enter a valid amount.")
      console.log("withdrawal failure")
    }


  }

  return (
    <div>
      {
        !isAuth.isLoggedIn
          ? <Oops />
          : <div className="container-center-login">
            <div className="col-md-6 border rounded p-4 mt-2 shadow">
              <h2 className="text-center m-4">Withdrawal</h2>
              <form onSubmit={(event) => onSubmit(event)}>
                <div className="row g-3 my-3" style={{ textAlign: "left" }}>
                  <div className='col-md-6'>
                    <label htmlFor="Name" className="form-label">
                      Amount
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        required
                        type={"text"}
                        className="form-control"
                        placeholder="Enter a number..."
                        name="withdrawalAmount"
                        value={withdrawalAmount}
                        onChange={(event) => handleChange(event)} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <label htmlFor="Paynow" className="form-label">
                      PayNow Number
                    </label>
                    <input
                      required
                      type={"text"}
                      className="form-control"
                      placeholder="Enter a number..."
                      name="withdrawalPaynow"
                      value={withdrawalPaynow}
                      onChange={(event) => handleChange(event)} />
                    <small className="form-text text-muted">Our team will credit this PayNow account.</small>
                  </div>
                </div>
                <button type="submit" className="btn btn-solid-dark mt-3">Confirm</button>
              </form>
            </div>
          </div>

      }
    </div>

  )
}

