import { DescriptionList } from 'components/hooks/useGenerateDescription/model'

const GenerateDescription: React.FC<{
  description: DescriptionList | undefined
  loading: boolean
  error: string | null
}> = ({
  description,
  loading,
  error,
}: {
  description: DescriptionList | undefined
  loading: boolean
  error: string | null
}) => {
  return (
    <div>
      {loading && <p>Loading...</p>}
      {description?.length ? (
        <ul style={{ marginBottom: '10px' }}>
          {description?.map(({ text, id }) => <li key={id}>{text}</li>)}
        </ul>
      ) : (
        <p>there is no no data</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default GenerateDescription
