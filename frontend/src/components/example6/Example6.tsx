import Description from './Description/Description'
import GenerateGetFlagComponents from 'components/genericComponents/GenerateGetFlagComponents/generateGetFlagComponents'

const Example6 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example6"
      getFlagEndpoint="get-flag-example6"
    />
  )
}

export default Example6
