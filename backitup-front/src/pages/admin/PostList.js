import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"

import { createClient } from '@supabase/supabase-js'

export default function PostList() {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise homepage to be blank
  const [posts, setPosts] = useState([])

  useEffect(() => {
    loadPosts()
  }, []);

  // Get list of users from database
  const loadPosts = async () => {
    async function fetchData() {
      let { data: POST, error } = await supabase
        .from('POST')
        .select('*')
        // .eq('POST_STATUS', status)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setPosts(POST);
        console.log(POST);
      }
    }

    const results = await fetchData();
    
    // const result = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listPosts")
    // console.log(result);
    // setPosts(result.data)
    // console.log(result.data);
  }

  const clickVerify = async (POST_ID) => {
    const date = new Date();
    const formattedDate = date.toISOString().substr(0, 19);

    async function fetchData() {
      let { data: POST, error } = await supabase
        .from('POST')
        .update({ POST_STATUS : 1,
          POST_APPROVED_DT: formattedDate })
        .eq('POST_ID', POST_ID)
        .select()
       
    
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        console.log(POST);
        alert("Successfully verified! Please refresh the page.")
      }
    }

    await fetchData();
    
    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/post/verify/${postID}/${formattedDate}`)
    
  }

  const clickUnverify = async (POST_ID) => {
    const date = new Date();
    const formattedDate = date.toISOString().substr(0, 19);

    async function fetchData() {
      let { data: POST, error } = await supabase
        .from('POST')
        .select()
        .update({ POST_STATUS : -1, POST_APPROVED_DT: formattedDate })
        .eq('POST_ID', POST_ID)
        
    
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // setPosts(POST);
        console.log(POST);
        alert("Successfully unverified! Please refresh the page.")
      }
    }

    await fetchData();

    // axios.get(`https://orbital-1690146023037.azurewebsites.net/api/post/unverify/${postID}/${formattedDate}`)
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
              <th scope="col">Post Name</th>
              <th scope="col">Description</th>
              <th scope="col">pHOTO</th>
              <th scope="col">Pitch Deck</th>
              <th scope="col">Action</th>
              <th scope="col">Verified on</th>
            </tr>
          </thead>
          <tbody>
            {
              posts.map((post, index) => (
                <tr>
                  <th scope="row" key="index">{index + 1}</th>
                  <td>{post.POST_CREATE_DT}</td>
                  <td>{post.POST_TITLE}</td>
                  <td>{post.POST_DESCRIPTION}</td>
                  <td>{post.POST_PHOTOURL}</td>
                  <td>{post.POST_URL}</td>
                  <td>
                    {post.POST_STATUS === 0
                      ? <button className='btn btn-outline-success max-2' onClick={() => clickVerify(post.POST_ID)}>Verify</button>
                      : <button className='btn btn-outline-danger max-2' onClick={() => clickUnverify(post.POST_ID)}>Unverify</button>
                    }
                  </td>
                  <td>{post.postApprovedDT}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
