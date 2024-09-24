import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { PostCreation } from './components/Post';
import { AuthProvider } from './context/AuthContext';




function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Track if the user is logged in
  console.log(isAuthenticated)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />

          {/* Protected Post Creation Route */}
          <Route
            path='/create-post'
            element={isAuthenticated ? <PostCreation /> : <Navigate to='/login' />} 
          />

          {/* Default Route */}
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

