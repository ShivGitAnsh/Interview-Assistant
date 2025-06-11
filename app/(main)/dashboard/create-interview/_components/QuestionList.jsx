import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiLoader } from "react-icons/fi";
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({ formData, onCreateLink }) {

  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', { ...formData });
      const content = result.data.content;

      // Extract JSON block inside ```json ... ```
      let FINAL_CONTENT = content;

      // Try to extract JSON if wrapped in ```json ... ```
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        FINAL_CONTENT = jsonMatch[1].trim();
      }

      let parsed;
      try {
        parsed = JSON.parse(FINAL_CONTENT);
      } catch (err) {
        console.error("JSON parsing failed:", err);
        toast("AI returned invalid question format. Please try again.");
        return;
      }

      if (!parsed?.interviewQuestions || !Array.isArray(parsed.interviewQuestions)) {
        toast("Oops! No valid questions received.");
        return;
      }
      setQuestionList(parsed.interviewQuestions);

    } catch (e) {
      console.error("API Error:", e);
      toast('Server Error, Try Again!');
    } finally {
      setLoading(false);
    }
  };


  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id
        },
      ])
      .select();
    setSaveLoading(false);
    onCreateLink(interview_id)

  }
  return (
    <div>
      {loading && <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
        <FiLoader className="animate-spin" />
        <div >
          <h2 className='font-medium'>Generating Interview Questions</h2>
          <p className='text-primary'>Our AI is crafting personalized questions based on your job position</p>
        </div>
      </div>
      }
      {questionList?.length > 0 &&
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>}
      <div className='flex justify-end mt-10'>
        <Button onClick={() => onFinish()} disabled={saveLoading}>
          {saveLoading && <FiLoader className='animate-spin' />}
          Create Interview Link and Finish
        </Button>
      </div>
    </div>
  )
}

export default QuestionList