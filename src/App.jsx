import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage'

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </main>
  )
}

export default App