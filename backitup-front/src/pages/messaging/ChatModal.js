import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js'

const ChatModal = ({ isOpen, onClose, creator, currUser }) => {

  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [textInput, setTextInput] = useState('');

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Do something with the input value (e.g., save it or perform an action)
    console.log('Text input:', textInput);

    const date = new Date();
    const formattedDate = date.toISOString().substr(0, 19);

    const { data, error } = await supabase
      .from('MESSAGING')
      .insert([
        {
          MSG_CONTENT: textInput,
          MSG_USER_SENDER: currUser.USER_ID,
          MSG_USER_RECEIVER: creator.USER_ID,
          MSG_READ: false,
          MSG_SENT_DT: formattedDate,
        },
      ])
      .select();

    if (error) {
      console.log('Error sending message', error);
    } else {
      alert('Message sent successfully!')
      onClose()
    }
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div class="modal-dialog shadow-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Start Chatting!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Recipient:</label>
                <input type="text" class="form-control" id="recipient-name" placeholder={creator.USER_NAME} disabled/>
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Message:</label>
                <textarea class="form-control" id="message-text" value={textInput} onChange={(event) => handleChange(event)}></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" class="btn btn-solid-dark" onClick={e => handleSubmit(e)}>Send message</button>
          </div>
        </div>
      </div>
    </div>
    // <div className="modal" tabIndex="-1" role="dialog" style={{ display: isOpen ? 'block' : 'none' }}>
    //   <div className="modal-dialog" role="document">
    //     <div className="modal-content">
    //       <div className="modal-header">
    //         <h5 className="modal-title">Enter Text</h5>
    //         <button type="button" className="close" onClick={onClose}>
    //           <span>&times;</span>
    //         </button>
    //       </div>
    //       <div className="modal-body">
    //         <form onSubmit={handleSubmit}>
    //           <div className="form-group">
    //             <label htmlFor="textInput">Text Input:</label>
    //             <input
    //               type="text"
    //               id="textInput"
    //               className="form-control"
    //               value={textInput}
    //               onChange={handleChange}
    //               required
    //             />
    //           </div>
    //           <button type="submit" className="btn btn-primary">
    //             Save
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ChatModal;
