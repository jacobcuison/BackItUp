import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import Loader from '../../components/Loader.jsx'
import { createClient } from '@supabase/supabase-js'

export default function TopupList({ wallet }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise homepage to be blank
  const [topups, setTopups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopups()
    console.log('wallet in topuplist', wallet);
  }, []);

  // Get list of users from database
  const loadTopups = async () => {
    async function fetchData() {
      let { data: USER, error } = await supabase
        .from('TOPUP')
        .select('*')
        .eq('WALLET_ID', wallet) 

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('data received is ', USER);
        setTopups(USER);
        // console.log(POST);
      }
    }

    await fetchData()
    setLoading(false)
    console.log('topups are ', topups);

    // console.log("my wallet", wallet);
    // const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/listTopUp/${wallet.wallet_ID}`)
    // setTopups(result.data)
    
  }

  return (
    <div className='container'>
      <div className='py-4 d-flex align-items-center justify-content-center'>
        {loading ? <Loader /> :
          <table className="table border shadow-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Verified?</th>
              </tr>
            </thead>
            <tbody>
              { topups === undefined
                ? ""
                :
                topups.map((topup, index) => (
                  <tr>
                    <th scope="row" key="index">{index + 1}</th>
                    <td>{topup.TOPUP_DT}</td>
                    <td>{topup.TOPUP_AMOUNT}</td>
                    <td>
                      {topup.PENDING_STATUS
                        ? 'N'
                        : 'Y'}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}
