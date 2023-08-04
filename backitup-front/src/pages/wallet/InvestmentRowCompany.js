import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

export default function InvestmentRowCompany({ inv }) {
  
  const supabase = createClient('https://pasumucntlfumydvqaaz.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc3VtdWNudGxmdW15ZHZxYWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0MzgzMjksImV4cCI6MjAwNjAxNDMyOX0.Y53cKpEG3VlX2wTEiG6HM7nvHP-8CFIM7n-NxRF5QAU')

  const [invsPost, setInvsPost] = useState([]);
  const [creator, setCreator] = useState([]);

  useEffect(() => {
    loadInvs();
  }, []);

  const loadInvs = async () => {
    try {
      let { data: POST, error } = await supabase
        .from('POST')
        .select('*')
        .eq('SHARE_ID', inv.SHARE_ID);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setInvsPost(POST[0]);
        console.log('invdata is', POST[0]);
        console.log('invspost is', invsPost);
        fetchCreator(POST[0].USER_ID); // Call fetchCreator with USER_ID as an argument
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCreator = async (userId) => {
    try {
      let { data: USER, error } = await supabase
        .from('USER')
        .select('*')
        .eq('USER_ID', userId);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('creator is', USER);
        setCreator(USER[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      {creator.USER_NAME}
    </>
  );
}
