import { askOpenAiImage } from '../../middlewares/askOpenAI/askOpenAi'

export const generateRobotImage = async (robotDescription: string) => {
  const GET_ROBOT_IMAGE_SYSTEM_PROMPT = `You are and expert in creating detailed, high-quality PNG images of robots. Create a detailed, high-quality PNG image of a robot.
  
    Instructions:
  
    - The image should be 1024x1024 pixels, on a plain background, and match the description as closely as possible.  
    - No text, no watermark.
    - The image should be a PNG file.
    - The image should be a high-quality image.
    - The image should be a high-resolution image.
    
    I will provide you with a description of a robot. You will need to create a detailed, high-quality PNG image of a robot based on the description, remember to follow the instructions.
    
    Description: ${robotDescription}
    `

  const response = await askOpenAiImage({
    systemPrompt: GET_ROBOT_IMAGE_SYSTEM_PROMPT,
    isTracing: true,
    tracingOptions: {
      traceName: 'Example8 Generate Robot Image',
      sessionId: 'example8-generate-robot-image',
      spanName: 'generateRobotImage',
    },
  })

  const imageUrl = response.answer

  console.log('Generated robot image URL:', imageUrl)
  return imageUrl
}
