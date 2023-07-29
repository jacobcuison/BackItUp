import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

export default function PostUser({ currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [posts, setPosts] = useState([])

  useEffect(() => {
    loadPosts()
  }, []);

  const loadPosts = async () => {

    async function fetchData() {
      let { data: POST, error } = await supabase
        .from('POST')
        .select('*')
        .eq('USER_ID', currUser.USER_ID)
        // .eq('POST_STATUS', status)

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setPosts(POST);
        // console.log(POST);
      }
    }

    await fetchData();

    // const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/listPosts/comp/${currUser.userID}`)
    // setPosts(result.data)
  }

  return (
    <div className="container">
      <div className="border rounded p-4 mt-2 shadow">
        <h2 className="m-1" style={{ textAlign: "left" }}>My Posts</h2>

        <div>
          <div className='py-4'>
            <table className="table border shadow">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Project</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  posts.map((post, index) => (
                    <tr>
                      <th scope="row" key="index">{index + 1}</th>
                      <td>
                        <Link to={`/post/${post.POST_ID}`}>
                          {post.POST_TITLE}
                        </Link>
                      </td>
                      <td>
                        <Link className="btn btn-solid-dark m-2" to={`/post/${post.POST_ID}/edit`}>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

