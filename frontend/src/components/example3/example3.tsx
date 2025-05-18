import Description from './Description/Description'
import GenerateGetFlagComponents from 'components/genericComponents/GenerateGetFlagComponents/generateGetFlagComponents'

const Example3 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example3"
      getFlagEndpoint="get-flag-example3"
    />
  )
}

export default Example3
