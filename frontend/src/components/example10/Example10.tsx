import GenerateGetFlagComponents from 'components/genericComponents/GenerateGetFlagComponents/generateGetFlagComponents'
import Description from './Description/Description'

const Example10 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example10"
      getFlagEndpoint="get-flag-example10"
    />
  )
}

export default Example10
