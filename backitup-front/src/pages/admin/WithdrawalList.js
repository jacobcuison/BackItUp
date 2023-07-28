import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"

import { createClient } from '@supabase/supabase-js'

export default function WithdrawalList() {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise homepage to be blank
  const [wds, setWds] = useState([])

  useEffect(() => {
    loadWds()
  }, []);

  // Get list of users from database
  const loadWds = async () => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('WITHDRAWAL')
        .select('*')

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setWds(data);
        console.log(data);
      }
    }

    await fetchData();
    
    // const result = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listWithdrawal")
    // console.log(result);
    // setWds(result.data)
    // console.log(result.data);
  }

  const clickVerify = async (WITHDRAWAL_ID) => {
    const date = new Date();
    const dt = date.toISOString().substr(0, 19);
    
    async function fetchData() {
      const { data, error } = await supabase
        .from('WITHDRAWAL')
        .update({ WITHDRAWAL_VERIFIED : 1 })
        .eq('WITHDRAWAL_ID', WITHDRAWAL_ID)
        .select()

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        // console.log(POST);
        alert("Successfully verified! Please refresh the page.")
      }
    }

    await fetchData()
    
    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/withdrawal/verify/${withdrawalID}/${dt}`)
    // alert("Successfully verified! Please refresh the page.")
  }

  const clickUnverify = async (WITHDRAWAL_ID) => {
    const date = new Date();
    const dt = date.toISOString().substr(0, 19);
    
    async function fetchData() {
      const { data, error } = await supabase
        .from('WITHDRAWAL')
        .update({ WITHDRAWAL_VERIFIED : -1 })
        .eq('WITHDRAWAL_ID', WITHDRAWAL_ID)
        
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        // console.log(POST);
        alert("Successfully unverified! Please refresh the page.")
      }
    }

    await fetchData()
    
    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/withdrawal/unverify/${withdrawalID}/${dt}`)
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
              <th scope="col">Withdrawal ID</th>
              <th scope="col">Amount</th>
              <th scope="col">Action</th>
              <th scope="col">Verified On</th>
            </tr>
          </thead>
          <tbody>
            {
              wds.map((wd, index) => (
                <tr>
                  <th scope="row" key="index">{index + 1}</th>
                  <td>{wd.WITHDRAWAL_DT}</td>
                  <td>{wd.WALLET_ID}</td>
                  <td>{wd.WITHDRAWAL_ID}</td>
                  <td>{wd.WITHDRAWAL_AMOUNT}</td>
                  <td>
                    {wd.PENDING_STATUS == true
                      ? <button className='btn btn-outline-success max-2' onClick={() => clickVerify(wd.WITHDRAWAL_ID)}>Verify</button>
                      : <button className='btn btn-outline-danger max-2' onClick={() => clickUnverify(wd.WITHDRAWAL_ID)}>Unverify</button>
                    }
                  </td>
                  <td>{wd.WITHDRAWAL_DONE_DT}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
