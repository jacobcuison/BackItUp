import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"

import { createClient } from '@supabase/supabase-js'

export default function PaymentsList() {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise homepage to be blank
  const [pmts, setPmts] = useState([])

  useEffect(() => {
    loadPmts()
  }, []);

  // Get list of pmts from database
  const loadPmts = async () => {
    async function fetchData() {
      let { data: PAYMENT, error } = await supabase
        .from('PAYMENT')
        .select('*')
        .eq('WALLET_ID', id)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setPmts(PAYMENT);
        console.log("Payment results: ", PAYMENT);
      }
    }

    const results = await fetchData();
    
    // const result = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listPayment")
    // console.log(result);
    // setPmts(result.data)
    // console.log(result.data);
  }

  // const clickVerify = (paymentId) => {
  //   axios.get(`https://orbital-1690146023037.azurewebsites.net/${paymentId}/verify`)
  //   alert("Successfully verified! Please refresh the page.")
  // }

  // const clickUnverify = (paymentId) => {
  //   axios.get(`https://orbital-1690146023037.azurewebsites.net/${paymentId}/unverify`)
  //   alert("Successfully unverified! Please refresh the page.")
  // }

  return (
    <div className='container'>
      <div className='py-4'>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Payer</th>{/* change to 'Company'? */}
              <th scope="col">Payee</th>{/* see google sheet for db architecture, cell e37 */}
              <th scope="col">Verified</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              pmts.map((pmt, index) => (
                <tr>
                  <th scope="row" key="index">{index + 1}</th>
                  <td>{pmt.PAYMENT_ID}</td>
                  <td>{pmt.PAYMENT_DT}</td>
                  <td>{pmt.PAYMENT_AMOUNT}</td>
                  <td>{pmt.WALLET_FROM.WALLET_ID}</td>
                  <td>{pmt.WALLET_TO.WALLET_ID}</td>
                  <td>
                    {
                      pmt.USER_VERIFIED ? 'Y' : 'N'
                    }
                  </td>
                  <td>
                    {/* {!pmt.USER_VERIFIED
                      ? <button
                        className='btn btn-outline-success max-2'
                        onClick={() => clickVerify(pmt.PAYMENT_ID)}>Verify</button>
                      : <button
                        className='btn btn-outline-danger max-2'
                        onClick={() => clickUnverify(pmt.PAYMENT_ID)}>Unverify</button>
                    } */}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
