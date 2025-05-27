import GenerateGetFlagComponents from 'components/genericComponents/GenerateGetFlagComponents/generateGetFlagComponents'
import Description from './Description/Description'

const Example11 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example11"
      getFlagEndpoint="get-flag-example11"
    />
  )
}

export default Example11
