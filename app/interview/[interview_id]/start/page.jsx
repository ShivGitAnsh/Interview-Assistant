"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CiPhone, CiTimer } from 'react-icons/ci'
import { MdMic } from 'react-icons/md'
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/services/supabaseClient'
import { FiLoader } from 'react-icons/fi'
import TimeCounter from '../../_components/TimerCounter'

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [vapi, setVapi] = useState(null);
  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const { interview_id } = useParams();
  const router = useRouter();
  const conversationRef = useRef(null);

  useEffect(() => {
    const vapiClient = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    setVapi(vapiClient);

    return () => {
      if (vapiClient) {
        vapiClient.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (interviewInfo && vapi) {
      startCall();
    }
  }, [interviewInfo, vapi]);

  const startCall = async () => {
    try {
      if (!vapi) return;

      let questionList = '';
      interviewInfo?.interviewData?.questionList.forEach((item) => {
        questionList += item?.question + ', ';
      });

      questionList = questionList.trim().replace(/,$/, '');

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${interviewInfo.userName}, how are you? Ready for your interview on ${interviewInfo.interviewData.jobPosition}?`,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an AI voice assistant designed to conduct mock interviews for the role of "${interviewInfo.interviewData.jobPosition}".
              Your role is to:
              - Ask the candidate a set of pre-defined questions one at a time.
              - Wait and listen carefully to each response before proceeding.
              - Encourage, assess, and give feedback during the interview.
              - Keep the tone friendly, confident, and supportive.

              Start with a warm and professional greeting like:
              "Hi ${interviewInfo.userName}! Welcome to your mock interview for the ${interviewInfo.interviewData.jobPosition} role. Let's get started!"

              Ask one question at a time from the list below:
              Questions: ${questionList}

              If the candidate struggles, try rephrasing the question or offering a small hint.
              Example:
              - "Take your time — think about how this applies to real-world scenarios."
              - "Would you like me to rephrase that?"

              After each answer, give a short and supportive piece of feedback:
              - "Nice, that's a thoughtful response!"
              - "Interesting point — you could expand more on that if you'd like."
              - "Hmm, not quite — would you like to give it another shot?"

              Maintain a smooth, conversational flow:
              - Use transitions like "Alright, next up..." or "Here comes a tricky one!"
              - Adapt your pace depending on the user's confidence level.

              After around 5 to 7 questions, wrap up with:
              - A brief performance summary
              - Encouraging remarks
              - And a cheerful goodbye, such as:
              "Great work today! You handled some challenging questions really well. Keep practicing and best of luck for the real thing!"

              Key Guidelines:
              - Stay focused on the ${interviewInfo.interviewData.jobPosition} role.
              - Be adaptive, natural, and conversational.
              - Keep messages short and human-like.
              - Never overwhelm the candidate — be patient and helpful.`.trim(),
            },
          ],
        },
      };

      // Set up event listeners before starting the call
      setupVapiListeners(vapi);

      await vapi.start(assistantOptions);
    } catch (error) {
      console.error("❌ Error starting Vapi call:", error);
      if (error?.response?.data?.error) {
        console.error("🔍 Vapi API Error:", error.response.data.error);
      }
      toast.error("Failed to start interview");
    }
  };

  const setupVapiListeners = (vapiClient) => {
    if (!vapiClient) return;

    vapiClient.on("call-start", () => {
      toast.success('Call Connected....');
    });

    vapiClient.on("speech-start", () => {
      setActiveUser(false);
    });

    vapiClient.on("speech-end", () => {
      setActiveUser(true);
    });

    vapiClient.on("message", (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
        conversationRef.current = message.conversation;
      }
    });

    vapiClient.on("call-end", () => {
      toast.success('Interview Ended');
      GenerateFeedback();
    });
  };

  const stopInterview = async () => {
    try {
      if (vapi) {
        await vapi.stop();
        toast.success("Call has been ended");
      }
    } catch (error) {
      console.error("Error stopping interview:", error);
      toast.error("Failed to end interview");
    }
  };

  const GenerateFeedback = async () => {
    setLoading(true);
    try {
      const convo = conversation || conversationRef.current;
      if (!convo) {
        throw new Error("No conversation data available");
      }

      const result = await axios.post('/api/ai-feedback', {
        conversation: JSON.stringify(convo),
        jobPosition: interviewInfo?.interviewData?.jobPosition
      });

      

      // Extract JSON from response (more robust handling)
      let content = result.data.content;
      let jsonStart = content.indexOf('{');
      let jsonEnd = content.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No valid JSON found in response");
      }

      const jsonString = content.slice(jsonStart, jsonEnd);
      const feedbackData = JSON.parse(jsonString);

      // Validate required fields
      const requiredFields = [
        'technicalSkills', 'communication',
        'problemSolving', 'experience',
        'summary', 'recommendation', 'recommendationMsg'
      ];

      requiredFields.forEach(field => {
        if (feedbackData[field] === undefined) {
          throw new Error(`Missing required field: ${field}`);
        }
      });

      // Save to Database
      const { error } = await supabase
        .from('interview-feedback')
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: feedbackData,
            recommended: feedbackData.recommendation === "Yes"
          },
        ]);

      if (error) throw error;

      router.push(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Feedback generated but there was an issue saving it");
      // Still navigate to completed page
      router.push(`/interview/${interview_id}/completed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-20 lg:px-28 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
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
            {!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
            <Image
              src={'/ai.avif'}
              alt='ai'
              width={150}
              height={150}
              className='w-[60px] h-[60px] rounded-full object-cover'
            />
          </div>
          <h2>AI Interviewer</h2>
        </div>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
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
      <h2 className='text-sm text-gray-400 text-center mt-5'>Interview In Progress...</h2>
    </div>
  )
}

export default StartInterview

