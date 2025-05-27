import GenerateDescription from 'components/genericComponents/generateDescription/generateDescription'
import useGenerateDescription from '../../hooks/useGenerateDescription/useGenerateDescription'

const Description = () => {
  const { descriptions, error, loading } = useGenerateDescription()

  return (
    <GenerateDescription
      description={descriptions?.descriptionExample11}
      error={error}
      loading={loading}
    />
  )
}

export default Description
