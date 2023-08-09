import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import ChatConversation from './ChatConversation';
import ChatMessages from './ChatMessages';

export default function Chat({ currUser, setPageTitle }) {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [chat, setChat] = useState([])
  const [focus, setFocus] = useState(null)
  const [reply, setReply] = useState("")

  useEffect(() => {
    setPageTitle(`Chat • BackItUp`)
    loadChat()
  }, []);

  useEffect(() => {
    loadChat()
  }, [reply])

  useEffect(() => {
    console.log('Focus is', focus);
  }, [focus])

  const handleChangeReply = (e) => {
    setReply(e.target.value)
  }

  const loadChat = async () => {

    const { data: MESSAGING, error } = await supabase
      .from('MESSAGING')
      .select('*')
      .or('MSG_USER_SENDER.eq.' + currUser.USER_ID
        + ',MSG_USER_RECEIVER.eq.' + currUser.USER_ID)
      .order('MSG_SENT_DT', { ascending: true })

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
        const convSet = new Set()
        const convArray = MESSAGING.filter(item => {
          if (!convSet.has(item.MSG_USER_RECEIVER)) {
            convSet.add(item.MSG_USER_RECEIVER);
            return true;
          }
          if (item.MSG_USER_RECEIVER === currUser.USER_ID) {
            return false
          }
          return false;
        });
        console.log('convArray is: ', convArray);
        setChat(convArray);
      }
      console.log('chats areeee', MESSAGING);
      // console.log(POST);
    }
  }

  const handleFocusChange = (cht) => {
    setFocus(cht.MSG_USER_RECEIVER)
    console.log('Focus is', focus);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    // Do something with the input value (e.g., save it or perform an action)
    console.log('Text input:', reply);

    const date = new Date();
    const formattedDate = date.toISOString().substr(0, 19);

    const { data, error } = await supabase
      .from('MESSAGING')
      .insert([
        {
          MSG_CONTENT: reply,
          MSG_USER_SENDER: currUser.USER_ID,
          MSG_USER_RECEIVER: focus,
          MSG_READ: false,
          MSG_SENT_DT: formattedDate,
        },
      ])
      .select();

    if (error) {
      console.log('Error sending message', error);
    } else {
      setReply("")
      console.log('Sent message!');
    }
  }

  return (
    <div className='container'>

      <h1 className='hero-title display-4 fw-bold mt-2' style={{ textAlign: "left" }}>All Chats</h1>
      <div className='container mb-5'>
        <div className='row'>
          <div className='col-md-3 border rounded shadow-sm p-3' style={{ minHeight: '60vh' }}>
            {chat.map((cht) => (
              <div class="nav nav-pills bg-light rounded flex-column mt-2">
                <button className={focus == cht.MSG_USER_RECEIVER ? 'btn btn-admin-dark flex-fill my-2 mx-1 shadow-sm'
                  : 'btn btn-admin-inactive flex-fill my-2 mx-1'} onClick={() => handleFocusChange(cht)}>
                  <ChatConversation cht={cht} currUser={currUser} />
                </button>
              </div>
            ))}
          </div>

          <div className='col-md-9'>
            {
              focus == null
                ? <div className='border rounded shadow-sm p-3' style={{ minHeight: '60vh', background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ textAlign: 'center' }}>Select a chat to view messages.</span>
                </div>
                : <div className='border rounded shadow-sm p-3' style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
                  <ChatMessages focus={focus} currUser={currUser} />

                  <form onSubmit={(event) => onSubmit(event)} className='mt-auto'>

                    <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Write a message..."
                        name="reply"
                        value={reply}
                        onChange={(event) => handleChangeReply(event)}
                      />
                      <button type="submit" className="btn btn-solid-dark">Send</button>
                    </div>
                  </form>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
