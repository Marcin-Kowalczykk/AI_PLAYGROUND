import Example1 from 'components/example1/Example1'
import Example2 from 'components/example2/Example2'
import Example3 from 'components/example3/Example3'
import Example4 from 'components/example4/Example4'
import Example5 from 'components/example5/Example5'
import Example6 from 'components/example6/Example6'

export const ROUTES = [
  { path: '/example1', element: Example1 },
  { path: '/example2', element: Example2 },
  { path: '/example3', element: Example3 },
  { path: '/example4', element: Example4 },
  { path: '/example5', element: Example5 },
  { path: '/example6', element: Example6 },
] as const
