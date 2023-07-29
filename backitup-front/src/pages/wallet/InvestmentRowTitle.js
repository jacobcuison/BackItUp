import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

export default function InvestmentRowTitle({ inv }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [invsPost, setInvsPost] = useState([])

  useEffect(() => {
    loadInvs()
  }, []);

  const loadInvs = async () => {
    try {
      async function fetchData() {
        let { data: POST, error } = await supabase
          .from('POST')
          .select('*')
          .eq('SHARE_ID', inv.SHARE_ID)
          // .eq('POST_STATUS', status)
  
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setInvsPost(POST);
          // console.log(POST);
        }
      }
  
      await fetchData();
      // const post = await axios.get(`https://orbital-1690146023037.azurewebsites.net/api/postbyshare/${inv.share.shareId}`)
      // setInvsPost(post.data)
      // console.log(post.data);
    } catch (error) {

    }
  }

  return (
    <>
      {invsPost.POST_TITLE}
    </>
  )
}

