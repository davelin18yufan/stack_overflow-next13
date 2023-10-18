import Question from '@/components/forms/Question'
import React from 'react'

const page = () => {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="h1-bold text-dark100-light900">Ask a Question</h1>

      <div className="mt-9">
        <Question />
      </div>
    </div>
  )
}

export default page