import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom"
import "../styles/styles.css"
import Search from "../components/Search"
import rocket from "../images/rocket.png"
import Loader from '../components/Loader'

import { createClient } from '@supabase/supabase-js'

export default function Home({ setPageTitle, setUserType, isAuth }) {


  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')


  // Initialise homepage to be blank
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [showAll, setShowAll] = useState('')
  const [esg, setEsg] = useState(false)

  console.log("auth status is", isAuth);

  useEffect(() => {
    loadPosts();
    setUserType("")
  }, []);

  // Get list of posts from database
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

    // async function getDataAndSetPosts() {
    //   try {
        const results = await fetchData();
        // setPosts(results);
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // }
    
    // Call getDataAndSetPosts to fetch data and set the state
    // getDataAndSetPosts();
    
    setPageTitle("BackItUp • Equity crowd-funding made easy")
    // const result1 = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listPosts/status/1") // change the link
    // const result2 = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listPosts/status/2")
    // setPosts([...result1.data, ...result2.data])
    setLoading(false)
    // console.log(result.data);
  }

  const handleSearchChange = (event) => {
    event.preventDefault()
    setShowAll(event.target.value)
  }

  const filterHandler = (event) => {
    if (event.target.checked) {
      setEsg(true)
    } else {
      setEsg(false)
    }
  }

  const postsToShow = (showAll === '') && !esg
    ? posts
    : showAll === ''
      ? posts.filter(post => post.postSustainable)
      : esg
        ? posts.filter(post => post.postTitle.toLowerCase().includes(showAll)).filter(post => post.postSustainable)
        : posts.filter(post => post.postTitle.toLowerCase().includes(showAll))

  return (
    <div className='container-fluid'>
      {loading ? <div className='container-center-login'><Loader /></div>
        :
        <div className='py-4'>
          <h1 className='hero-title display-4 fw-bold' style={{ textAlign: "left" }}>Latest Posts</h1>
          <div>
            <Search
              filterBy={showAll}
              changeBy={handleSearchChange}
              filterHandler={filterHandler}
              setEsg={setEsg} />
          </div>
          <div className="grid-container">
            {postsToShow.map((post, index) => (
              <Link key={index} className="card-container text-right" to={'/post/' + post.postID}>
                <div className="card">
                  <div className="image-container">

                    <img
                      className="card-img-top"
                      src={post.postPhotoURL == null ? "/images/post/post-default.png" : post.postPhotoURL}
                      alt="Card image cap"
                    />

                  </div>
                  <div className="card-body" style={{ textAlign: "left" }}>
                    <p className="card-text text-left display-6 fw-bold">{post.postTitle}</p>
                    <p className="card-text">{post.postDescription}</p>
                    {post.postSustainable
                      ?
                      <img
                        className="eco-icon"
                        src="images/post/post-esg.png"
                        alt="Eco-friendly Icon"
                      />
                      :
                      <></>
                    }
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div class="card bg-dark text-white mt-5">
            <div class="row">
              <div class="col-md-8">
                <div class="card-img-overlay">
                  <h5 class="card-title fw-bold m-3">Can't find what you're looking for?</h5>
                  <p class="card-text">Be the change that you want to see in the world. Create your own post to make your dreams a reality.</p>
                  <Link
                    class="btn btn-solid-dark mb-3"
                    to={isAuth.isLoggedIn ? "/getstarted/raise" : "/adduser"}>
                    {isAuth ? "Quit dreaming, start building" : "Sign up now"}</Link>
                </div>
              </div>
              <div
                class="col-md-4 d-flex align-items-end justify-content-end"
                style={{ maxHeight: "300px" }} >
                <img
                  class="card-img"
                  src={rocket}
                  alt=""
                  style={{ width: "42%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>

        </div>
      }
    </div>
  )
}
