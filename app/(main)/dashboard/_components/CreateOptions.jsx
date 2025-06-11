import Link from 'next/link';
import React from 'react'
import { CiVideoOn } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";

function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5'>
        <Link href={'/dashboard/create-interview'} className='bg-white border border-gray-200 p-5 rounded-lg flex flex-col gap-2 cursor-pointer'>
            <CiVideoOn className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12'/>
            <h2 className='font-bold'>Create New Interview</h2>
            <p className='text-gray-500'>Create and schedule AI interviews for preparation</p>
        </Link>
        <div className='bg-white border border-gray-200 p-5 rounded-lg flex flex-col gap-2'>
            <FaPhone className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12'/>
            <h2 className='font-bold'>Create Phone Screening Call</h2>
            <p className='text-gray-500'>Practice real interview scenarios. Schedule your screening call today.
              <span className='font-bold text-primary px-1'>(Currently Not Functional)</span></p>
        </div>
    </div>
  )
}

export default CreateOptions