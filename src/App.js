import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Router>
        <div>
          <Routes />
        </div>
      </Router>
    </div>
  )
}

export default App
