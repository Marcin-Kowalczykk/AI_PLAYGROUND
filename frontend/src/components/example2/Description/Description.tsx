import React from 'react'
import useGenerateDescription from '../../hooks/useGenerateDescription/useGenerateDescription'

const Description = () => {
  const { descriptions, error, loading } = useGenerateDescription()

  return (
    <div>
      {loading && <p>Loading...</p>}
      <ul>{descriptions?.descriptionExample2.map(({ text, id }) => <li key={id}>{text}</li>)}</ul>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Description
