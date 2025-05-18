import useGenerateDescription from '../../hooks/useGenerateDescription/useGenerateDescription'
import GenerateDescription from 'components/genericComponents/generateDescription/generateDescription'

const Description = () => {
  const { descriptions, error, loading } = useGenerateDescription()

  return (
    <GenerateDescription
      description={descriptions?.descriptionExample2}
      error={error}
      loading={loading}
    />
  )
}

export default Description
