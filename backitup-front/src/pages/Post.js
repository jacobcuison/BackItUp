import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import extLink from '../images/ext-link.png'
import Loader from '../components/Loader.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMobile, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@supabase/supabase-js'

export default function Post({ currUser, isAuth, setPageTitle, userType }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  // Initialise Post page to be blank
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState([])
  const [creator, setCreator] = useState([])
  const [share, setShare] = useState([])
  const { id } = useParams()

  useEffect(() => {
    loadPost()
  }, []);

  // Get Post details from database
  const loadPost = async () => {
    try {
      async function fetchPost() {
        let { data: POST, error } = await supabase
          .from('POST')
          .select('*')
          .eq('POST_ID', id)

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setPost(POST);
          // setShare(post.SHARE_COUNT_CURENT * 100 / post.SHARE_COUNT_TOTAL)
          setPageTitle(`${post.POST_TITLE} • BackItUp`)

          let { data: USER, error } = await supabase
            .from('USER')
            .select('*')
            .eq('USER_ID', post.USER_ID)
          if (error) {
            console.log('Error fetching creator data: ', error);
          } else {
            setCreator(USER)
          }

          setLoading(false)
          console.log("post data is: ", POST);



        }
      }

      await fetchPost()
      // const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/post/${id}`) // change the link as necessary
      // setPost(result.data);
      // setShare((result.data.share.shareCountCurrent * 100) / result.data.share.shareCountTotal);
      // setPageTitle(`${result.data.postTitle} • BackItUp`);
      // setLoading(false)
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <div className='container'>
      {loading
        ? <div className='container-center-login'><Loader /></div>
        :
        <div class="container my-5">
          <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">

            <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
              <h1 class="display-4 fw-bold lh-1" style={{ textAlign: "left" }}>{post.POST_TITLE}</h1>
              <p class="lead" style={{ textAlign: "left" }}>{post.POST_DESCRIPTION}</p>
              <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                <Link className="btn btn-solid-dark btn-lg px-4 me-md-2 fw-bold"
                  to={isAuth.isLoggedIn ? `/invest/${id}` : `/oops`} >
                  Invest
                </Link>
              </div>
            </div>
          </div>
          <div>

          </div>
          <div className="row mt-5 mx-5">

            <div className="col-md-8" style={{ textAlign: "left" }}>
              <div class="progress mb-3">
                <div
                  class="progress-bar bg-success"
                  style={{ width: `${share}%` }}
                  role="progressbar"
                  aria-valuenow={{ share }}
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>

              <img class="rounded-lg-3" src={post.POST_PHOTOURL} alt="" width="720" />
              <h2>{post.POST_DESCRIPTION}</h2>
              <p>{post.POST_CONTENT}</p>
              <a href="https://example.com/faq.html" rel="noreferrer" className='text-align-center'>
                Link to Pitch Deck
                <img src={extLink} alt="Link to Pitch Deck" style={{ height: 12, margin: 5 }} />
              </a>
              <br></br>

            </div>
            <div className="col-md-3 offset-md-1">
              <div style={{ textAlign: "left" }}>
                <p><strong>A PROUD PROJECT BY</strong></p>
                <h3>{creator.USER_NAME}</h3>
                {/* <p><strong>SHARE PRICE</strong></p>
                <h3>{post.SHARE_COUNT_PRICE}</h3>

                <p><strong>REMAINING SHARES</strong></p>
                <h3>{post.REMAINING_SHARE}</h3>
                <p><strong>MINIMUM SHARE PURCHASE</strong></p>
                <h3>{post.SHARE_COUNT_MIN}</h3> */}
              </div>

              <Link
                className={`btn btn-solid-dark btn-lg px-4 me-md-2 fw-bold mt-5 d-flex justify-content-center 
                ${currUser.USER_TYPE === 'Investor' ? "" : "disabled"}`}
                to={isAuth.isLoggedIn ? `/invest/${id}` : `/oops`} >
                Invest
              </Link>
              <hr />
              <div style={{ textAlign: "left" }}>
                {creator.USER_SHOWCONTACT
                  ? <div>
                    <p><strong>CONTACT</strong></p>

                    <a className="contact-icon" href={`mailto:${creator.USER_EMAIL}`}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                    <a className="contact-icon" href={`tel:${creator.USER_HP}`}>
                      <FontAwesomeIcon icon={faMobile} />
                    </a>
                    <a className="contact-icon" href={creator.USER_LINKEDINLINK} target='_blank'>
                      <FontAwesomeIcon icon={faGlobe} />
                    </a>
                  </div>
                  : <></>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
