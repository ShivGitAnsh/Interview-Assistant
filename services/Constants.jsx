import { MdDashboard } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { CiCircleList } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdComputer } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { FaBriefcase } from "react-icons/fa";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";

export const SideBarOptions = [
    {
        name: "Dashboard",
        icon: MdDashboard,
        path: "/dashboard",
    },
    {
        name: "Scheduled Interview",
        icon: SlCalender,
        path: "/scheduled-interview",
    },
    {
        name: "All Interview",
        icon: CiCircleList,
        path: "/all-interview",
    },
    {
        name: "Profile",
        icon: CgProfile,
        path: "/profile",
    },
    
]

export const InterviewType = [
    {
        title : 'Technical',
        icon : MdComputer,
    },
    {
        title : 'Behavioral',
        icon : CiUser,
    },
    {
        title : 'Experience',
        icon : FaBriefcase,
    },
    {
        title : 'Problem Solving',
        icon : IoExtensionPuzzleOutline,
    },
    {
        title : 'Leadership',
        icon : RiTeamFill,
    },


]

export const QUESTIONS_PROMPT = `You are an expert technical interviewer. 
Based on the following inputs, generate a well-structured list of high-quality interview questions: 
Job Title: {{jobTitle}} 
Job Description: {{jobDescription}} 
Interview Duration: {{Duration}} 
Interview Type: {{type}} 

Your task: 
Analyze the job description to identify key responsibilities, required skills, and expected experience. 
Generate a list of interview questions depending on interview duration. 
Adjust the number and depth of questions to match the interview duration. 
Ensure the questions match the tone and structure of a real-life {{type}} interview. 

Format your response as a valid JSON object ONLY, with the following structure:

{
  "interviewQuestions": [
    {
      "question": "Your question text here",
      "type": "Technical"  // or Behavioral, Experience, Problem Solving, Leadership
    }
  ]
}

Do NOT include any variable assignments, code snippets, or explanatory text. 
Return only the JSON object with the key "interviewQuestions" and the array of questions.
Use double quotes for all JSON keys and string values as per JSON standard.
The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`;


export const FEEDBACK_PROMPT = `{{conversation}}

Based on the interview conversation, provide a detailed evaluation of the candidate's performance .

REQUIREMENTS:
1. Rate each category from 1-10 (10 being best)
2. Keep summary exactly 3 lines
3. Recommendation must be either "Yes" or "No"
4. Recommendation message should be 1 concise line
5. Response MUST be valid JSON only - no additional text

FORMAT STRICTLY AS THIS JSON (DO NOT INCLUDE ANY OTHER TEXT):

{
  "technicalSkills": number,
  "communication": number,
  "problemSolving": number,
  "experience": number,
  "summary": "line1\nline2\nline3",
  "recommendation": "Yes/No",
  "recommendationMsg": "string"
}

Important: If you include any text outside this JSON structure, the system will fail.`;


