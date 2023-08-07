import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

export default function Chat({ currUser, setPageTitle }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [chat, setChat] = useState([])
  const [focus, setFocus] = useState(null)

  useEffect(() => {
    setPageTitle(`Chat • BackItUp`)
    loadChat()
  }, []);

  const loadChat = async () => {

    const { data: MESSAGING, error } = await supabase
      .from('MESSAGING')
      
  .select('*, MSG_USER_SENDER:USER(*) as sender, MSG_USER_RECEIVER:USER(*) as receiver')

      .or(`MSG_USER_SENDER.eq.${currUser.USER_ID}`)
      .or(`MSG_USER_RECEIVER.eq.${currUser.USER_ID}`)
      .order('MSG_SENT_DT', { ascending: true });

//       const { data, error } = await supabase
//   .from('MESSAGING')
//   .select(‘*, MSG_USER_SENDER:USER(*) as sender, MSG_USER_RECEIVER:USER(*) as receiver')
// .or((MSG_USER_SENDER = ${userA} AND MSG_USER_RECEIVER = ${userB}))
// .or((MSG_USER_SENDER = ${userB} AND MSG_USER_RECEIVER = ${userA}))
// .order('MSG_SENT_DT', { ascending: true });

    // let { data: MESSAGING, error } = await supabase
    //   .from('MESSAGING')
    //   .select('*, USER(*)')
    //   .or('MSG_USER_SENDER.eq.' + currUser.USER_ID,
    //     'MSG_USER_RECEIVER.eq.' + currUser.USER_ID)
    //   .order('MSG_SENT_DT', { ascending: true });
    // // .eq('POST_STATUS', status)

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      if (MESSAGING[0] == undefined) {
        setChat('No messages found. Click on posts to start chatting!')
      } else {
        setChat(MESSAGING);
      }
      console.log(MESSAGING);
      // console.log(POST);
    }
  }

  return (
    <div className='container'>

      <h1 className='hero-title display-4 fw-bold mt-2' style={{ textAlign: "left" }}>All Chats</h1>
      <div className='container mb-5'>
        <div className='row'>
          <div className='col-md-3 border rounded shadow-sm p-3' style={{ minHeight: '60vh' }}>
            {chat.map((cht) => (
              <div>
                {cht.MSG_USER_RECEIVER}
              </div>
            ))}
          </div>

          <div className='col-md-9'>
            {
              focus == null
                ? <div className='border rounded shadow-sm p-3' style={{ minHeight: '60vh', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ textAlign: 'center' }}>Select a chat to view messages.</span>
                </div>
                : <div className=''>
                  {focus}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
