import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import Loader from '../../components/Loader'

export default function UsersList() {

  // Initialise homepage to be blank
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, []);

  // Get list of users from database
  const loadUsers = async () => {

    async function fetchData() {
      const { data, error } = await supabase
        .from('USER')
        .select('*')

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setUsers(data);
        console.log(data);
      }
    }

    await fetchData();
    // const result = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/users")
    // console.log(result);
    // setUsers(result.data)
    // console.log(result.data);
    setLoading(false)
  }

  const clickVerify = async (USER_ID) => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('USER')
        .update({ USER_VERIFIED : 1 })
        .eq('USER_ID', USER_ID)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        // console.log(POST);
        alert("Successfully verified! Please refresh the page.")
      }
    }

    await fetchData()

    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/${userID}/verify`)
    // alert("Successfully verified! Please refresh the page.")
  }

  const clickUnverify = async (USER_ID) => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('USER')
        .update({ USER_VERIFIED : -1 })
        .eq('USER_ID', USER_ID)
        
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        // console.log(POST);
        alert("Successfully unverified! Please refresh the page.")
      }
    }

    await fetchData()
    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/${userID}/unverify`)
    // alert("Successfully unverified! Please refresh the page.")
  }

  return (
    <div className='container'>
      <div className='py-4'>
        {loading ? <Loader /> :
          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">HP</th>
                <th scope="col">Password</th>
                <th scope="col">Type</th>
                <th scope="col">Verified</th>
                <th scope="col">Documents</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((user, index) => (
                  <tr>
                    <th scope="row" key="index">{index + 1}</th>
                    <td>{user.USER_NAME}</td>
                    <td>{user.USER_EMAIL}</td>
                    <td>{user.USER_HP}</td>
                    <td>{user.USER_PASS}</td>
                    <td>{user.USER_TYPE}</td>
                    <td>
                      {
                        user.USER_VERIFIED ? 'Y' : 'N'
                      }
                    </td>
                    <td>{user.USER_EVIDENCE == "" ? "" : <a href={`${user.USER_EVIDENCE}`} target="_blank">View</a>}</td>
                    <td>
                      {!user.USER_VERIFIED
                        ? <button className='btn btn-outline-success max-2' onClick={() => clickVerify(user.USER_ID)}>Verify</button>
                        : <button className='btn btn-outline-danger max-2' onClick={() => clickUnverify(user.USER_ID)}>Unverify</button>
                      }
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
