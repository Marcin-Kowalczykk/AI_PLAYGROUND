import useGenerateDescription from '../../hooks/useGenerateDescription/useGenerateDescription'
import React from 'react'

const Description = () => {
  const { descriptions, error, loading } = useGenerateDescription()

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>{descriptions?.descriptionExample1.map(({ text, id }) => <li key={id}>{text}</li>)}</ul>
    </div>
  )
}

export default Description
