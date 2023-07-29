import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import moment from 'moment'
import Loader from '../components/Loader'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/styles.css'
import { createClient } from '@supabase/supabase-js'

export default function EditPost({ currUser, isAuth, setPageTitle }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // const [post, setPost] = useState({
  //     post_TITLE: "",
  //     post_DESCRIPTION: "",
  //     post_CONTENT: "",
  //     post_SUSTAINABLE: "",
  //     postURL: "",
  //     SHARE_COUNT_TOTAL: "",
  //     SHARE_COUNT_PRICE: "",
  //     SHARE_COUNT_MIN: "",
  //     post_RAISED_DT: ""
  // })
  const [post, setPost] = useState("")
  const { id } = useParams()

  const [postRaiseDate, setPostRaiseDate] = useState(post.postCreateDT);
  const [postEndDate, setPostEndDate] = useState(post.postExpireDT);

  const { postTitle, postContent, postDescription, postSustainable, postURL,
    share } = post;

  // const { shareCountTotal, shareCountMin, shareCountCurrent, shareCountPrice } = share

  const [checked, setChecked] = useState(false)
  const [value, setValue] = useState("0")

  useEffect(() => {
    setPageTitle("Edit Post • BackItUp")

    loadPost()

  }, [])

  const loadPost = async () => {
    const result = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/post/${id}`) // change the link as necessary
    setPost(result.data)
    // setShare((post.share.shareCountCurrent) * 100 / post.share.shareCountTotal);
    console.log(result.data);
    // console.log(share);
    setLoading(false)
  }

  const handleCheckChange = (event) => {
    setChecked(!checked);
  }

  const handleChange = (event) => {
    // testing valuation
    // console.log(parseInt(SHARE_COUNT_TOTAL), "total is");
    // console.log(parseFloat(SHARE_COUNT_PRICE), "price is");
    setValue(parseInt(share.shareCountTotal) * parseFloat(share.shareCountPrice))
    setPost({ ...post, [event.target.name]: event.target.value });
    // console.log(SHARE_COUNT_TOTAL);
    console.log(post);
  }

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {

      async function updatePost() {
        const { data, error } = await supabase
          .from('POST')
          .update({ POST_TITLE: postTitle})
          .update({ POST_DESCRIPTION: postDescription})
          .update({ POST_CONTENT:  postContent})
          .update({ POST_URL: postURL})
          .update({ POST_SUSTAINABLE: checked})
          .eq('POST_ID', post.POST_ID)
          .select()
        
          if (error) {
            console.error('Error updating data:', error);
          } else {
            navigate("/")
          }
      }

      await updatePost()

    //   const apiUrl = `/api/editPost/${post.postID}`;
    //   const date = new Date();
    //   // const exp = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
    //   // const formattedExp = exp.toISOString().substr(0, 19)
    //   const formattedDate = date.toISOString().substr(0, 19);
    //   const pdata = {
    //     postTitle: postTitle,
    //     postDescription: postDescription,
    //     postContent: postContent,
    //     postURL: postURL,
    //     postSustainable: checked,
    //     // shareCountTotal: parseInt(share.shareCountTotal),
    //     // shareCountMin: parseInt(share.shareCountMin),
    //     // shareCountCurrent: share.shareCountCurrent,
    //     // shareCountPrice: parseFloat(share.shareCountPrice),
    //     // postStatus: 0,
    //     // postCreateDT: formattedDate,
    //     // postRaiseDT: post.postCreateDT,
    //     postExpireDT: post.postExpireDT,
    //     // postRaisedDT: postRaiseDate.toISOString().substr(0, 19),
    //     // postExpireDT: postEndDate.toISOString().substr(0, 19),
    //     // userID: currUser.userID
    //   };

    //   console.log(pdata)

    //   fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(pdata)
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       // Handle the response data
    //       console.log(data);
    //     })
    //   console.log("post updateeeeee success");
    //   navigate("/")

    } catch (error) {
      console.error(error);
      console.log("post edit failure")
    }
  };

  return (
    <div className="container my-5">
      <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
        <h2 className="text-center m-4">Edit Details</h2>
        {loading ? <div className='container-center-login'><Loader /></div> :
          <form onSubmit={(event) => onSubmit(event)}>
            <div className="row g-3" style={{ textAlign: "left" }}>
              <h4>General Information</h4>
              <div className="col-md-6">
                <div>
                  <label
                    htmlFor="Title"
                    className="form-label">
                    Title
                  </label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="My Title"
                    name="postTitle"
                    value={postTitle}
                    onChange={(event) => handleChange(event)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label
                  htmlFor="Company"
                  className="form-label">
                  Company
                </label>
                <input class="form-control" type="text" placeholder={`${post.USER_NAME}`} aria-label="Disabled input example" disabled></input>
              </div>
              <div className="row">
                <div className="col-md-11">
                  <label
                    htmlFor="Description"
                    className="form-label">
                    Description
                  </label>
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="A one-line summary of your project"
                    name="postDescription"
                    value={postDescription}
                    onChange={(event) => handleChange(event)}
                  />
                </div>

                <div class="col-md-1 align-self-end">
                  <input type="checkbox" class="btn-check" id="btn-check" value={postSustainable}
                    onChange={(event) => handleCheckChange(event)} autocomplete="off" />
                  <label class={checked ? "btn btn-success" : "btn btn-outline-dark"} for="btn-check">ESG</label>
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="Content"
                  className="form-label">
                  Pitch
                </label>
                <textarea
                  type={"text"}
                  class="form-control"
                  placeholder="A summary of why your idea will change the world. Possible things to include: goals, user flows, and innovations."
                  name="postContent"
                  value={postContent}
                  onChange={(event) => handleChange(event)}
                  id="exampleFormControlTextarea1"
                  rows="3"></textarea>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="Pitch"
                  className="form-label">
                  Link to Pitch Deck
                </label>
                <input
                  type={"text"}
                  className="form-control"
                  placeholder="Google Drive, Dropbox, etc"
                  name="postURL"
                  value={postURL}
                  onChange={(event) => handleChange(event)}
                />
                <small id="urlHelp" className="form-text text-muted">Please ensure that the link is visible to the public.</small>
              </div>
              <hr />
              <h4>Fundraising Information</h4>
              <div className="col-md-4">
                <label
                  htmlFor="shareCountTotal"
                  className="form-label">
                  Total Shares
                </label>
                <input
                  disabled type={"text"}
                  className="form-control"
                  placeholder="999"
                  name="share.shareCountTotal"
                  value={share.SHARE_COUNT_TOTAL}
                  onChange={(event) => handleChange(event)}
                />
              </div>

              <div className="col-md-4">

                <label
                  htmlFor="shareCountPrice"
                  className="form-label">
                  Share Price
                </label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    disabled type={"text"}
                    className="form-control"
                    placeholder="Round off to the nearest 0.01"
                    name="share.shareCountPrice"
                    value={share.SHARE_COUNT_PRICE}
                    onChange={(event) => handleChange(event)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="shareCountMin"
                  className="form-label">
                  Minimum Share Purchase
                </label>
                <input
                  disabled type={"text"}
                  className="form-control"
                  placeholder="1"
                  name="share.shareCountMin"
                  value={share.SHARE_COUNT_MIN}
                  onChange={(event) => handleChange(event)}
                />
              </div>
              <div>
                <h5>Your current company valuation: ${value}</h5>
              </div>

              <hr />
              <h4>Post Information</h4>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                {/* <DatePicker
                        type={"text"}
                        value={post_RAISED_DT}
                        name="post_RAISED_DT"
                        onChange={handleChange}
                        minDate={moment()}
                        
                        className="form-control"
                        disabledKeyboardNavigation
                    /> */}
                <DatePicker
                  id="custom"
                  isClearable
                  className='form-control'
                  filterDate={d => {
                    return new Date() < d;
                  }}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mmaa"
                  selected={postRaiseDate}
                  onChange={date => setPostRaiseDate(date)}
                  selectsStart
                  startDate={postRaiseDate}
                  endDate={postEndDate}
                />
              </div>
              <div className='col-md-4 custom-datepicker'>
                <label className='form-label'>End Date</label>
                <DatePicker
                  id="custom"
                  isClearable
                  className='form-control'
                  filterDate={d => {
                    return new Date() < d;
                  }}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mmaa"
                  selected={postEndDate}
                  selectsEnd
                  startDate={postRaiseDate}
                  endDate={postEndDate}
                  minDate={postRaiseDate}
                  onChange={date => setPostEndDate(date)}
                />
              </div>

              <button type="submit" className="btn btn-solid-dark">Save Changes</button>

            </div>
          </form>
        }
      </div>
    </div>

  )
}