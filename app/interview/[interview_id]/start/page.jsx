'use client';

import { InterviewDataContext } from '@/context/InterviewDataContext';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CiPhone, CiTimer } from 'react-icons/ci';
import { FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';
import { MdMic } from 'react-icons/md';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import TimeCounter from '../../_components/TimerCounter';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { supabase } from '@/services/supabaseClient';

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [vapi, setVapi] = useState(null);
  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const conversationRef = useRef(null);
  const { interview_id } = useParams();
  const router = useRouter();

  // Initialize Vapi
  useEffect(() => {
    const client = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    setVapi(client);

    return () => {
      client?.stop();
    };
  }, []);

  // Start the call when both interviewInfo and vapi are ready
  useEffect(() => {
    if (interviewInfo && vapi) {
      startCall();
      setupVapiListeners(vapi);
    }
  }, [interviewInfo, vapi]);

  const startCall = async () => {
    try {
      if (!vapi || !interviewInfo?.interviewData) return;

      let questionList = interviewInfo.interviewData.questionList
        .map(item => item?.question)
        .filter(Boolean)
        .join(', ');

      const assistantOptions = {
        name: 'AI Recruiter',
        firstMessage: `Hi ${interviewInfo.userName}, how are you? Ready for your interview on ${interviewInfo.interviewData.jobPosition}?`,
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        voice: {
  provider: "vapi",
  voiceId: "Elliot", // or another default
},
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `
                You are an AI voice assistant designed to conduct mock interviews for the role of "${interviewInfo.interviewData.jobPosition}".
                Your role is to:
                - Ask the candidate a set of pre-defined questions one at a time.
                - Wait and listen carefully to each response before proceeding.
                - Encourage, assess, and give feedback during the interview.
                - Keep the tone friendly, confident, and supportive.

                Start with:
                "Hi ${interviewInfo.userName}! Welcome to your mock interview for the ${interviewInfo.interviewData.jobPosition} role. Let's get started!"

                Ask one question at a time from the list:
                Questions: ${questionList}

                Offer rephrasing if needed, and provide short feedback like:
                - "Nice, that's a thoughtful response!"
                - "Would you like to rephrase that?"

                After 5–7 questions, summarize performance and say goodbye:
                "Great work today! Keep practicing and best of luck!"
              `.trim(),
            },
          ],
        },
      };

      await vapi.start(assistantOptions);
    } catch (error) {
      console.error('❌ Error starting Vapi call:', error);
      toast.error('Failed to start interview');
    }
  };

  const setupVapiListeners = (client) => {
    if (!client) return;

    client.on('call-start', () => {
      toast.success('Call Connected...');
    });

    client.on('speech-start', () => {
      setActiveUser(false);
    });

    client.on('speech-end', () => {
      setActiveUser(true);
    });

    client.on('message', (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
        conversationRef.current = message.conversation;
      }
    });

    client.on('call-end', () => {
      toast.success('Interview Ended');
      GenerateFeedback();
    });
  };

  const stopInterview = async () => {
    try {
      if (vapi) {
        await vapi.stop();
        toast.success('Call has been ended');
      }
    } catch (error) {
      console.error('Error stopping interview:', error);
      toast.error('Failed to end interview');
    }
  };

  const GenerateFeedback = async () => {
    setLoading(true);
    try {
      const convo = conversation || conversationRef.current;
      if (!convo) throw new Error('No conversation data');

      const response = await axios.post('/api/ai-feedback', {
        conversation: JSON.stringify(convo),
        jobPosition: interviewInfo?.interviewData?.jobPosition,
      });

      const content = response?.data?.content || '';
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('Invalid feedback format');
      }

      const feedbackData = JSON.parse(content.slice(jsonStart, jsonEnd));

      const requiredFields = [
        'technicalSkills', 'communication',
        'problemSolving', 'experience',
        'summary', 'recommendation', 'recommendationMsg'
      ];

      for (const field of requiredFields) {
        if (!feedbackData.hasOwnProperty(field)) {
          throw new Error(`Missing field: ${field}`);
        }
      }

      const { error } = await supabase
        .from('interview-feedback')
        .insert([{
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id,
          feedback: feedbackData,
          recommended: feedbackData.recommendation === 'Yes',
        }]);

      if (error) throw error;

      router.push(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Feedback generation failed, redirecting...');
      router.push(`/interview/${interview_id}/completed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-20 lg:px-28 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>
        AI Interview Session
        <span className='flex gap-2 items-center'>
          <CiTimer />
          <TimeCounter duration={
            Number(interviewInfo?.interviewData?.Duration?.split(' ')[0]) * 60
          } />
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {!activeUser && (
              <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />
            )}
            <Image
              src='/ai.avif'
              alt='AI'
              width={150}
              height={150}
              className='w-[60px] h-[60px] rounded-full object-cover'
            />
          </div>
          <h2>AI Interviewer</h2>
        </div>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {activeUser && (
              <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />
            )}
            <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5'>
              {interviewInfo?.userName?.[0] || 'U'}
            </h2>
          </div>
          <h2>{interviewInfo?.userName || 'User'}</h2>
        </div>
      </div>

      <div className='flex items-center gap-5 justify-center mt-7'>
        <AlertConfirmation stopInterview={stopInterview}>
          {!loading ? (
            <CiPhone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
          ) : (
            <FiLoader className='animate-spin h-12 w-12' />
          )}
        </AlertConfirmation>
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>
        Interview In Progress...
      </h2>
    </div>
  );
}

export default StartInterview;
