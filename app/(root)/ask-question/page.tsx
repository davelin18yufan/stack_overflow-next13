import Question from '@/components/forms/Question'
import React from 'react'

const page = () => {
  return (
    <div className="h1-bold text-dark100-light900"> 
      <h1>Ask a Question</h1>
      
      <div className="mt-9">
        <Question/>
      </div>
    </div>
  )
}

export default page