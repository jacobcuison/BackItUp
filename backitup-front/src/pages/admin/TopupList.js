import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"

import { createClient } from '@supabase/supabase-js'

export default function TopupList() {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise homepage to be blank
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, []);

  // Get list of users from database
  const loadUsers = async () => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('TOPUP')
        .select('*')

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setUsers(data);
        console.log(data);
      }
    }

    await fetchData();


    // const result = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listTopup")
    console.log(users);
    // setUsers(result.data)
    // console.log(result.data);
  }

  const clickVerify = async (TOPUP) => {

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

      const currWallet = await getWallet(TOPUP.WALLET_ID)

      async function changeWallet(WALLET, change) {
        const { data, error } = await supabase
          .from('WALLET')
          .update({ 'ACTIVE_BALANCE': WALLET.ACTIVE_BALANCE + change })
          .eq('WALLET_ID', WALLET.WALLET_ID)
          .select()

        if (error) {
          console.log('Error changing wallet', error);
        } else {

        }
      }

      await changeWallet(currWallet, TOPUP.TOPUP_AMOUNT)

      async function fetchData() {
      let { data, error } = await supabase
        .from('TOPUP')
        .update({
          TOPUP_VERIFIED: 1,
          TOPUP_DONE_DT: formattedDate
        })
        .eq('TOPUP_ID', TOPUP.TOPUP_ID)
        .select()

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        // console.log(POST);
        alert("Successfully verified! Please refresh the page.")
      }
    }

    await fetchData();

    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/topup/verify/${user.topupID}/${formattedDate}`)
    // alert("Successfully verified! Please refresh the page.")
  }

  const clickUnverify = async (TOPUP) => {

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

    const currWallet = await getWallet(TOPUP.WALLET_ID)

    async function changeWallet(WALLET, change) {
      const { data, error } = await supabase
        .from('WALLET')
        .update({ 'ACTIVE_BALANCE': WALLET.ACTIVE_BALANCE - change })
        .eq('WALLET_ID', WALLET.WALLET_ID)
        .select()

      if (error) {
        console.log('Error changing wallet', error);
      } else {

      }
    }

    await changeWallet(currWallet, TOPUP.TOPUP_AMOUNT)

    async function fetchData() {
    let { data, error } = await supabase
      .from('TOPUP')
      .update({
        TOPUP_VERIFIED: -1,
        TOPUP_DONE_DT: formattedDate
      })
      .eq('TOPUP_ID', TOPUP.TOPUP_ID)
      .select()

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      // setPosts(POST);
      // console.log(POST);
      alert("Successfully verified! Please refresh the page.")
    }
  }

  await fetchData();


    // axios.get(`https://orbital-1690146023037.azurewebsites.net/${userID}/unverify`)
    // alert("Successfully unverified! Please refresh the page.")
  }

  return (
    <div className='container'>
      <div className='py-4'>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Wallet ID</th>
              <th scope="col">Top-up ID</th>
              <th scope="col">Amount</th>
              <th scope="col">Action</th>
              <th scope="col">Verified on</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user, index) => (
                <tr>
                  <th scope="row" key="index">{index + 1}</th>
                  <td>{user.TOPUP_DT}</td>
                  <td>{user.WALLET_ID}</td>
                  <td>{user.TOPUP_ID}</td>
                  <td>{user.TOPUP_AMOUNT}</td>
                  <td>
                    {user.TOPUP_VERIFIED !== 1
                      ? <button className='btn btn-outline-success max-2' onClick={() => clickVerify(user)}>Verify</button>
                      : <button className='btn btn-outline-danger max-2' onClick={() => clickUnverify(user)}>Unverify</button>
                    }
                  </td>
                  <td>{user.TOPUP_DONE_DT}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
