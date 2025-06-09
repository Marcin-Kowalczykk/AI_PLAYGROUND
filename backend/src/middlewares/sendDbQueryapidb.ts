import axios from 'axios'

export const sendDbQuery = async (query: string, task: string): Promise<any> => {
  const payload = {
    task,
    apikey: process.env.POLIGON_API_KEY,
    query,
  }
  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/apidb`, payload)

    return response.data
  } catch (error) {
    console.error('Error in sendDbQuery:', error)
    throw error
  }
}
