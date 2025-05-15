import { useEffect, useState } from 'react'
import axios from 'axios'
import { IDescriptions, IDescriptionsResponse } from './model'

const useGenerateDescription = () => {
  const [descriptions, setDescriptions] = useState<IDescriptions | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const response = await axios.get<IDescriptionsResponse>('/internal.api/descriptions')
        setDescriptions(response.data.descriptions)
      } catch (error) {
        setError(
          `Failed to fetch description data, you still can use the rest of the app, remember to run a server: ${error}`,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDescriptions()
  }, [])

  return { descriptions, error, loading }
}

export default useGenerateDescription
