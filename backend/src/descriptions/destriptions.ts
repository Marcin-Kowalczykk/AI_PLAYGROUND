const generateBasicGetFlagDescription = (exampleNumber: number) => {
  return [
    {
      id: 1,
      text: 'On the interface you can just send request which runs every script to get result flag',
    },
    {
      id: 2,
      text: `All the App logic is in the backend/src/example${exampleNumber} directory`,
    },
    {
      id: 3,
      text: `More information inside Readme.md in Example${exampleNumber} section`,
    },
    {
      id: 4,
      text: 'After button click, You can see all process in the backend terminal',
    },
  ]
}

export const descriptions = {
  descriptionExample1: [
    {
      id: 1,
      text: 'Extract sample changing questions from the HTML file',
    },
    {
      id: 2,
      text: 'Basic query to the OpenAI API to get answers to the questions',
    },
    {
      id: 3,
      text: 'Send the AI-generated answers to a sample endpoint to retrieve some data',
    },
  ],
  descriptionExample2: [
    {
      id: 1,
      text: 'Process below will try to recognize you as a Human',
    },
    {
      id: 2,
      text: 'The app is powered by AI',
    },
    {
      id: 3,
      text: 'The user relies on AI to answer questions without exposing themselves as human',
    },
    {
      id: 4,
      text: 'Click button to send default question to verification Api and start the process',
    },
  ],
  descriptionExample3: generateBasicGetFlagDescription(3),
  descriptionExample4: [
    {
      id: 1,
      text: 'On the interface you can just send request to get system prompts and flag',
    },
  ],
  descriptionExample5: generateBasicGetFlagDescription(5),
  descriptionExample6: generateBasicGetFlagDescription(6),
  descriptionExample7: [
    {
      id: 1,
      text: 'You can add some images to the input',
    },
    {
      id: 2,
      text: 'After click "analyze" system will try to detect which city is on images by LLM',
    },
    {
      id: 3,
      text: 'You can see steps (console.logs) in backend terminal',
    },
  ],
  descriptionExample8: generateBasicGetFlagDescription(8),
  descriptionExample9: generateBasicGetFlagDescription(9),
  descriptionExample10: generateBasicGetFlagDescription(10),
}
