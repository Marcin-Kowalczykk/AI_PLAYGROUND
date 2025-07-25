import GenerateGetFlagComponents from 'components/genericComponents/GenerateGetFlagComponents/generateGetFlagComponents'
import Description from './Description/Description'

const Example9 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example9"
      getFlagEndpoint="get-flag-example9"
    />
  )
}

export default Example9
