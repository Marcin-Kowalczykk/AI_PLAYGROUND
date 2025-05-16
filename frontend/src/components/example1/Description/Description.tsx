import GenerateDescription from 'components/genericComponents/generateDescription'
import useGenerateDescription from '../../hooks/useGenerateDescription/useGenerateDescription'
import React from 'react'

const Description = () => {
  const { descriptions, error, loading } = useGenerateDescription()

  return (
    <GenerateDescription
      description={descriptions?.descriptionExample1}
      error={error}
      loading={loading}
    />
  )
}

export default Description
