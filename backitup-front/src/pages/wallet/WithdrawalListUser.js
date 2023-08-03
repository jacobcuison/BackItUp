import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import Loader from '../../components/Loader.jsx'
import { createClient } from '@supabase/supabase-js'

export default function WithdrawalListUser({wallet}) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

    // Initialise homepage to be blank
    const [wds, setWds] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWds()
    }, [] );

    // Get list of users from database
    const loadWds = async () => {
      async function fetchWithdrawal() {
        let { data: USER, error } = await supabase
          .from('WITHDRAWAL')
          .select('*')
          .eq('WALLET_ID', wallet)
  
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setWds(USER[0]);
        }
      }
  
      await fetchWithdrawal();
        // console.log("my wallet", wallet);
        // const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/listWithdrawal/${wallet.wallet_ID}`)
        // setWds(result.data)
      setLoading(false);
     }

  return (
    <div className='container'>
        <div className='py-4 d-flex align-items-center justify-content-center'>
            {loading ? <Loader/> :
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
                { wds == undefined ? '' :
                        wds.map((wd, index) => (
                            <tr>
                            <th scope="row" key="index">{index + 1}</th>
                            <td>{wd.WITHDRAWAL_DT}</td>
                            <td>{wd.WITHDRAWAL_AMOUNT}</td>
                            <td>
                                {wd.PENDING_STATUS
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
