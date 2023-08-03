import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/styles.css'
import { createClient } from '@supabase/supabase-js'

export default function CreatePost({ currUser, setPageTitle }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  let navigate = useNavigate()

  const [post, setPost] = useState({
    post_TITLE: "",
    post_DESCRIPTION: "",
    post_CONTENT: "",
    post_SUSTAINABLE: "",
    postURL: "",
    SHARE_COUNT_TOTAL: "",
    SHARE_COUNT_PRICE: "",
    SHARE_COUNT_MIN: "",
    post_RAISED_DT: "",
    photoURL: ""
  })

  const [postRaiseDate, setPostRaiseDate] = useState(new Date());
  const [postEndDate, setPostEndDate] = useState(new Date());

  const [photo, setPhoto] = useState(null)

  const { post_TITLE, post_CONTENT, post_DESCRIPTION, post_SUSTAINABLE, postURL,
    SHARE_COUNT_TOTAL, SHARE_COUNT_PRICE, SHARE_COUNT_MIN, post_RAISED_DT, photoURL } = post;

  const [checked, setChecked] = useState(false)
  const [value, setValue] = useState("0")

  const [shareId, setShareId] = useState(null)

  useEffect(() => {
    setPageTitle("Create Post • BackItUp")
  }, [])

  const handleCheckChange = (event) => {
    setChecked(!checked);
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleChange = (event) => {
    setValue(parseInt(SHARE_COUNT_TOTAL) * parseFloat(SHARE_COUNT_PRICE))
    setPost({ ...post, [event.target.name]: event.target.value });
    console.log(post);
  }

  // Post user registration info to database
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const date = new Date();
      const formattedDate = date.toISOString().substr(0, 19);

      async function insertData() {
        console.log('SHAREID FROM INSERTDATA IS: ', shareId);
        const { data, error } = await supabase
          .from('POST')
          .insert([
            {
              POST_TITLE: post_TITLE,
              POST_DESCRIPTION: post_DESCRIPTION,
              POST_CONTENT: post_CONTENT,
              POST_URL: postURL,
              POST_SUSTAINABLE: checked,
              POST_STATUS: 0,
              POST_CREATE_DT: formattedDate, // Replace with an appropriate date and time
              POST_EXPIRE_DT: postEndDate.toISOString().substr(0, 19), // Replace with an appropriate date and time
              POST_RAISE_DT: postRaiseDate.toISOString().substr(0, 19), // Replace with an appropriate date and time
              SHARE_ID: shareId.SHARE_ID,
              USER_ID: currUser.USER_ID,
              POST_PHOTOURL: photoURL
            }
          ])
          .select()

        if (error) {
          console.log('Error inserting post data: ', error);
          // throw new Error()
        } else {
          console.log('it is successful post creation time #swag');
          navigate("/createcompany/thanks")
        }
      }

      async function insertShare() {
        const { data, error } = await supabase
          .from('SHARE')
          .insert([
            {
              SHARE_COUNT_TOTAL: parseInt(SHARE_COUNT_TOTAL),
              SHARE_COUNT_MIN: parseInt(SHARE_COUNT_MIN),
              SHARE_COUNT_CURRENT: 0,
              SHARE_COUNT_PRICE: parseFloat(SHARE_COUNT_PRICE),
              USER_ID: currUser.USER_ID
            },
          ])
          .select('SHARE_ID')

        if (error) {
          console.log('Error inserting share: ', error);
          // throw new Error()
        } else {
          console.log(data[0]);
          console.log('setting share to: ', data[0].SHARE_ID);
          setShareId(data[0])
          // await insertData()
            // .then(async () => await insertData())
        }
      }

      

      // async function insertPhoto() {

      //   async function countPosts() {
      //     let { data: POST, error } = await supabase
      //       .from('POST')
      //       .select('*')
      //     // .eq('POST_STATUS', status)

      //     if (error) {
      //       console.error('Error fetching data:', error);
      //     } else {
      //       return POST.length
      //       console.log(POST);
      //     }
      //   }

      //   let count = await countPosts()

      //   let { data, error } = await supabase
      //     .from('POST')
      //     .update({ POST_PHOTOURL: photoURL })
      //     .eq('POST_ID', count)

      //   if (error) {
      //     console.error('Error fetching data:', error);
      //   } else {
      //     // setInvsPost(POST);
      //     // console.log(POST);
      //   }
      // }

      await insertShare()
        .then(await insertData())
        // .then(navigate("/createcompany/thanks"))

      // const pdata = {
      //   postTitle: post_TITLE,
      //   postDescription: post_DESCRIPTION,
      //   postContent: post_CONTENT,
      //   postURL: postURL,
      //   postSustainable: checked,
      //   shareCountTotal: parseInt(SHARE_COUNT_TOTAL),
      //   shareCountMin: parseInt(SHARE_COUNT_MIN),
      //   shareCountCurrent: 0,
      //   shareCountPrice: parseFloat(SHARE_COUNT_PRICE),
      //   postStatus: 0,
      //   postCreateDT: formattedDate,
      //   postRaisedDT: postRaiseDate.toISOString().substr(0, 19),
      //   postExpireDT: postEndDate.toISOString().substr(0, 19),
      //   userID: currUser.userID
      // };

      // console.log(pdata)

      // Create a user with the created wallet.java
      // const response = await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/createPost`, pdata, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }

      // );
      // const photoFormData = new FormData()
      // photoFormData.append('file', photo)

      // // Get current post ID
      // let count = 0

      // const postList = await axios.get("https://orbital-1690146023037.azurewebsites.net/api/listPosts")
      // console.log("currPOSTID:::", postList.data.length);

      // await axios.post(`https://orbital-1690146023037.azurewebsites.net/api/post/submitPhoto/${postList.data.length}`,
      //   photoFormData)
      //   .then((response) => {
      //     console.log("Successful image upload", response.data);
      //   })

      // console.log("post creation success");

    } catch (error) {
      console.error(error);
      console.log("post creation failure")
    }
  };

  return (
    <div className="container my-5">
      <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
        <h2 className="text-center m-4">Start your journey today.</h2>
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
                  required type={"text"}
                  className="form-control"
                  placeholder="My Title"
                  name="post_TITLE"
                  value={post_TITLE}
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
              <input
                class="form-control"
                type="text"
                placeholder={`${currUser.USER_NAME}`}
                aria-label="Disabled input example"
                disabled></input>
            </div>
            <div className="row">
              <div className="col-md-11">
                <label
                  htmlFor="Description"
                  className="form-label">
                  Description
                </label>
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="A one-line summary of your project"
                  name="post_DESCRIPTION"
                  value={post_DESCRIPTION}
                  onChange={(event) => handleChange(event)}
                />
              </div>

              <div class="col-md-1 align-self-end">
                <input
                  type="checkbox"
                  class="btn-check"
                  id="btn-check"
                  value={post_SUSTAINABLE}
                  onChange={(event) => handleCheckChange(event)}
                  autocomplete="off" />
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
                required type={"text"}
                class="form-control"
                placeholder="A summary of why your idea will change the world. Possible things to include: goals, user flows, and innovations."
                name="post_CONTENT"
                value={post_CONTENT}
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
                required type={"text"}
                className="form-control"
                placeholder="Google Drive, Dropbox, etc"
                name="postURL"
                value={postURL}
                onChange={(event) => handleChange(event)}
              />
              <small id="urlHelp"
                className="form-text text-muted">Please ensure that the link is visible to the public.</small>
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
                required type={"text"}
                className="form-control"
                placeholder="999"
                name="SHARE_COUNT_TOTAL"
                value={SHARE_COUNT_TOTAL}
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
                  required type={"text"}
                  className="form-control"
                  placeholder="Round off to the nearest 0.01"
                  name="SHARE_COUNT_PRICE"
                  value={SHARE_COUNT_PRICE}
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
                required type={"text"}
                className="form-control"
                placeholder="1"
                name="SHARE_COUNT_MIN"
                value={SHARE_COUNT_MIN}
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

            <div className='col-md-4'>
              <div className="mb-3">
                <label
                  htmlFor="Pitch"
                  className="form-label">
                  Cover Photo
                </label>
                <input
                  required type={"text"}
                  className="form-control"
                  placeholder="Google Drive, Dropbox, etc"
                  name="photoURL"
                  value={photoURL}
                  onChange={(event) => handleChange(event)}
                />
                <small id="urlHelp"
                  className="form-text text-muted">Please ensure that the link is visible to the public.</small>
              </div>
              <button type="submit" className="btn btn-solid-dark">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>

  )
}