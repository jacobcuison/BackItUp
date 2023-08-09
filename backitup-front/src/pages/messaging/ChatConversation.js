import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

export default function ChatConversation({ cht, currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [conv, setConv] = useState([])

  useEffect(() => {
    loadChatDetails()
  }, []);

  const loadChatDetails = async () => {

    console.log('ChatConversation cht is: ', cht);

    const find = currUser.USER_TYPE == 'Company' ? cht.MSG_USER_SENDER : cht.MSG_USER_RECEIVER

    const { data: USER, error } = await supabase
      .from('USER')
      .select('*')
      .eq('USER_ID', find)

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setConv(USER[0])
      console.log(USER[0]);
      // console.log(POST);
    }
  }


  return (
    <div>
      {conv.USER_NAME}
    </div>
  )
}
