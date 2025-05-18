import Description from './Description/Description'
import GenerateGetFlagComponents from 'components/genericComponents/generateGetFlagComponents'

const Example5 = () => {
  return (
    <GenerateGetFlagComponents
      description={<Description />}
      title="Example5"
      getFlagEndpoint="get-flag-example5"
    />
  )
}

export default Example5
