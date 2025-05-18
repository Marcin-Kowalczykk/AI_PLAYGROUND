import React from 'react'
import Example1 from './components/example1/Example1'
import Example2 from './components/example2/Example2'
import Example3 from './components/example3/example3'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavBar from 'components/NavBar/NavBar'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/example1" />} />
        <Route path="/example1" element={<Example1 />} />
        <Route path="/example2" element={<Example2 />} />
        <Route path="/example3" element={<Example3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
