"use client"
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import CandidateList from './_components/CandidateList';

function InterviewDetail() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetInterviewDetail();
    }
  }, [user]);

  const GetInterviewDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interviews')
        .select(`jobPosition, jobDescription, type, questionList, Duration, interview_id, created_at,
                interview-feedback(userEmail, userName, feedback, created_at)`)
        .eq('userEmail', user?.email)
        .eq('interview_id', interview_id)
        .single(); // Use .single() since you only want one record

      if (error) throw error;
      
      // Data will be a single object when using .single()
      setInterviewDetail(data || null);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setInterviewDetail(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-2xl'>Interview Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : interviewDetail ? (
        <>
        <InterviewDetailContainer interviewDetail={interviewDetail} />
        <CandidateList candidateList = {interviewDetail?.['interview-feedback']}/>
        </>
      ) : (
        <p>No interview details found</p>
      )}
    </div>
  )
}

export default InterviewDetail