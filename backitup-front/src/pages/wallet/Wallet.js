import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import TopupList from "./TopupList"
import WithdrawalListUser from "./WithdrawalListUser"
import { createClient } from '@supabase/supabase-js'

export default function Wallet({ currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise Wallet page to be blank
  const [wallet, setWallet] = useState([])
  const [invs, setInvs] = useState([])
  const [topups, setTopups] = useState([])
  const [wds, setWds] = useState([])
  const { id } = useParams()

  const [displayA, setDisplayA] = useState(true) // topups
  const [displayB, setDisplayB] = useState(false) // withdrawals

  const showA = () => {
    setDisplayA(true)
    setDisplayB(false)
  }

  const showB = () => {
    setDisplayA(false)
    setDisplayB(true)
  }

  useEffect(() => {
    loadWallet()
    console.log('curruser is: ', currUser);
  }, []);

  // Get Wallet details from database
  const loadWallet = async () => {

    async function fetchWallet() {
      let { data: WALLET, error } = await supabase
        .from('WALLET')
        .select('*')
        .eq('WALLET_ID', currUser.WALLET_ID)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setWallet(WALLET[0]);
        console.log('my wallet render is: ', WALLET);
      }
    }

    async function fetchTopup() {
      console.log('fetching topup from this wallet, ', wallet);
      let { data: USER, error } = await supabase
        .from('TOPUP')
        .select('*')
        .eq('WALLET_ID', id)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setTopups(USER[0]);
      }
    }

    async function fetchWithdrawal() {
      let { data: USER, error } = await supabase
        .from('WITHDRAWAL')
        .select('*')
        .eq('WALLET_ID', id)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setWds(USER[0]);
      }
    }

    await fetchWallet()
    // .then(async () =>

    //   await fetchTopup()).then(async () => await fetchWithdrawal())


    // const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/user/${currUser.userID}/wallet`) // change the link as necessary
    // setWallet(result.data)

    // const result2 = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/listTopUp/${id}`)
    // setTopups(result2.data)

    // const result3 = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/listWithdrawal/${id}`)
    // setWds(result3.data)

  }


  return (
    <div className='container'>
      <div className='border rounded p-4 mt-2 shadow'>

        <div className="row">
          <div className="d-flex mx-2 align-items-center" style={{ textAlign: "left" }}>

            <div className="col-md-9">

              <h3>Active Balance: ${wallet.ACTIVE_BALANCE}</h3>
            </div>
            <div className='col-md-3'>
              <Link className="btn btn-solid-dark m-2" to="/topup">
                Top-up
              </Link>
              <Link className="btn btn-outline-dark m-2" to="/withdraw">
                Withdraw
              </Link>
            </div>

          </div>
        </div>
        <hr />
        <div className="row">
          <div class="nav nav-pills nav-fill bg-light rounded mx-2">
            <button className={displayA
              ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
              : 'btn btn-admin-inactive flex-fill my-2 mx-1'}
              onClick={() => showA()}>Recent Top-ups</button>
            <button className={displayB
              ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
              : 'btn btn-admin-inactive flex-fill my-2 mx-1'}
              onClick={() => showB()}>Recent Withdrawals</button>
          </div>
          {
            displayA
              ? <TopupList wallet={currUser.WALLET_ID} />
              : <WithdrawalListUser wallet={currUser.WALLET_ID} />
          }
        </div>
      </div>
    </div>
  )
}
