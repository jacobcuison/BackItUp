import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../styles/styles.css'
import { createClient } from '@supabase/supabase-js'

export default function Invest({ isAuth, currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  const [amt, setAmount] = useState("")
  const [post, setPost] = useState([])
  const [fromWallet, setFromWallet] = useState([])
  const [toWallet, setToWallet] = useState([])
  const { id } = useParams()

  useEffect(() => {
    loadPost()
  }, [])

  const loadPost = async () => {
    try {
      async function fetchPost() {
        let { data: POST_WITH_SHARE, error } = await supabase
          .from('POST')
          .select('*, SHARE(*)')
          .eq('POST_ID', id);

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setPost(POST_WITH_SHARE[0])
        }
      }

      await fetchPost()
    } catch (error) {

    }
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
try {
    console.log('POST is ', post);

    async function getUser(USER_ID, change) {
      const { data: USER, error } = await supabase
        .from('USER')
        .select()
        .eq('USER_ID', USER_ID)

      if (error) {
        console.log('Error getting User');
      } else {
        return USER[0]
      }
    }

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

    const value = post.SHARE.SHARE_COUNT_PRICE * amt

    // Get user wallet
    const from = await getWallet(currUser.WALLET_ID)
    setFromWallet(from)
    console.log('lolsies is ', from);

    // Get company User
    console.log('getting this userid   ', post.USER_ID);
    const toUser = await getUser(post.USER_ID)
    // console.log('testing this one out ', post);
    
    console.log('getting this walletid', toUser);
    const to = await getWallet(toUser.WALLET_ID)
    setToWallet(to)
    console.log('i have set the to wallet to ', to);

    async function changeWallet(WALLET, change) {
      if (change < 0 && WALLET.ACTIVE_BALANCE < -change) {
        alert('Please check you have sufficient balance.')  
        throw new Error('Please check you have sufficient balance.')
      }

      if (amt < post.SHARE.SHARE_COUNT_MIN) {
        alert('Your investment does not meet the minimum number of shares to purchase.')  
        throw new Error('Your investment does not meet the minimum number of shares to purchase.')
      }

      if (amt > post.SHARE.SHARE_COUNT_TOTAL - post.SHARE.SHARE_COUNT_CURRENT) {
        alert('There are insufficient remaining shares.')  
        throw new Error('There are insufficient remaining shares.')
      }

      const { data, error } = await supabase
        .from('WALLET')
        .update({ 'ACTIVE_BALANCE': WALLET.ACTIVE_BALANCE + change })
        .eq('WALLET_ID', WALLET.WALLET_ID)
        .select()

      if (error) {
        console.log('Error changing wallet', error);
      }
    }

   

    // Decrease investor wallet
    await changeWallet(from, -value)
    // Increase company wallet
    await changeWallet(to, value)

    async function sendNotification() {
      const { data, error } = await supabase
        .from('NOTIFICATION')
        .insert([
          {
            USER_ID: 10,
            NOTI_TYPE: 'INVESTMENT',
            NOTI_MESSAGE: 'You have successfully invested $' + value + ' in ' + post.POST_TITLE + "!",
            NOTI_READ: false,
            NOTI_DT: formattedDate,
          },
        ])
        .select()

      if (error) {
        console.log('Error sending notification');
      }
    }

    await sendNotification()

    console.log('from is meeee', fromWallet);

    async function registerPayment() {
      const { data, error } = await supabase
        .from('PAYMENT')
        .insert([
          {
            PAYMENT_AMOUNT: value,
            WALLET_ID_FROM: from.WALLET_ID,
            WALLET_ID_TO: to.WALLET_ID,
            PAYMENT_DT: formattedDate
          }
        ])
        .select('PAYMENT_ID')
      
      if (error) {
        console.log('Cannot register payment: ', error);
      } else {
        return data[0].PAYMENT_ID
      }
    }

    const paymentID = await registerPayment()
    console.log(paymentID);

    async function registerInvestment() {
      const { data, error } = await supabase
        .from('INVESTMENT')
        .insert([
          {
            USER_ID: currUser.USER_ID,
            SHARE_ID: post.SHARE.SHARE_ID,
            SHARE_AMOUNT: amt,
            PAYMENT_ID: paymentID,
            INVEST_DT: formattedDate,
            INVEST_ACTIVE: 1,
          }
        ])
        .select()
      
        if (error) {
          console.log('Cannot register investment: ', error);
        }
    }

    await registerInvestment()
    navigate("/thanks")

    // const result =
    //   await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/invest/${id}/${props.isAuth.userID}/${amt}/${formattedDate}`)
    // if (result.data > 0) {
    //   navigate("/thanks")
    // } else {
    //   result.data === -1
    //     ? alert("Invalid user.")
    //     : result.data === -2
    //       ? alert("Invalid share.")
    //       : result.data === -3
    //         ? alert("Insufficient Purchasing Minimum Share Amount.")
    //         : result.data === -4
    //           ? alert("Insufficient Remaining Share.")
    //           : alert("Insufficient Active Balance.")
    // }
  } catch (error) {
    console.log(error);
    // alert(error.message)
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
