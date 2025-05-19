import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavBar from 'components/NavBar/NavBar'
import { ROUTES } from './routes'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/example1" />} />
        {ROUTES.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
