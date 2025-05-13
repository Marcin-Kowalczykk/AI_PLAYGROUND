import React from 'react'
import './Description.css'

const Description = () => {
  return (
    <div>
      <h4>Description:</h4>
      <ul>
        <li id="example-1-description-id1">Extract sample changing questions from the HTML file</li>
        <li id="example-1-description-id2">
          Basic query to the OpenAI API to get answers to the questions
        </li>
        <li id="example-1-description-id3">
          Send the AI-generated answers to a sample endpoint to retrieve some data
        </li>
      </ul>
    </div>
  )
}

export default Description
