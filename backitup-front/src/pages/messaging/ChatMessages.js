import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

export default function ChatMessages({ focus, currUser }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [msg, setMsgs] = useState([])

  useEffect(() => {
    loadChatMessages()
    console.log(msg);
  }, [focus]);

  const loadChatMessages = async () => {

    const { data: MESSAGING, error } = await supabase
      .from('MESSAGING')
      .select('*')
      .or('MSG_USER_SENDER.eq.' + focus +',MSG_USER_RECEIVER.eq.' + focus)
      .order('MSG_SENT_DT', { ascending: true });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setMsgs(MESSAGING);
      console.log('msgs to load are: ', MESSAGING);
    }
  }

  return (
    <div>
      {msg.map((message) => (
        <div className='m-2' key={message.id} style={{ textAlign: message.MSG_USER_SENDER === currUser.USER_ID ? 'right' : 'left' }}>
          {message.MSG_CONTENT}
        </div>
      ))}
    </div>
  )
}
