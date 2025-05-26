import Example1 from 'components/example1/Example1'
import Example10 from 'components/example10/Example10'
import Example2 from 'components/example2/Example2'
import Example3 from 'components/example3/Example3'
import Example4 from 'components/example4/Example4'
import Example5 from 'components/example5/Example5'
import Example6 from 'components/example6/Example6'
import Example7 from 'components/example7/Example7'
import Example8 from 'components/example8/Example8'
import Example9 from 'components/example9/Example9'

export const ROUTES = [
  { path: '/example1', element: Example1 },
  { path: '/example2', element: Example2 },
  { path: '/example3', element: Example3 },
  { path: '/example4', element: Example4 },
  { path: '/example5', element: Example5 },
  { path: '/example6', element: Example6 },
  { path: '/example7', element: Example7 },
  { path: '/example8', element: Example8 },
  { path: '/example9', element: Example9 },
  { path: '/example10', element: Example10 },
] as const
