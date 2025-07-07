"use client"
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import FormContainer from './_components/FormContainer';
import QuestionList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from './_components/InterviewLink';
import ProtectedRoute from '../../_components/ProtectedRoute';

function CreateInterview() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState();
    const [interviewId, setInterviewId] = useState();
    const {user} = useUser();
    const onHandleInputChange = (field, value) => {
       setFormData(prev => ({
        ...prev,
        [field] : value, 
       })) 
    }

    const onGoToNext=()=> {
      if(user?.credits <= 0){
        toast('You have no credits left! Please purchase credits to continue.');
        return;
      }
      if(!formData?.jobPosition|| !formData?.jobDescription || !formData?.Duration || !formData?.type){
        toast('Please Enter all details!')
        return;
      }
      setStep(step+1);
    }

    const onCreateLink=(interview_id)=>{
         setInterviewId(interview_id);
         setStep(step+1)
    }
  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
        <div className='flex gap-5 items-center'>
            <FaArrowLeftLong onClick={() => router.back()} className = 'cursor-pointer'/>
            <h2 className='font-bold text-2xl'>Create New Interview</h2>
        </div>
            <Progress value = {step * 33.33} className={'my-5'}/>
            {step==1?<FormContainer onHandleInputChange = {onHandleInputChange}
            GoToNext={() => onGoToNext()}/>:
            step == 2?<QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)}/>:
            step == 3?<InterviewLink interview_id = {interviewId} formData = {formData}/> : null}
    </div>

  )
}

export default CreateInterview