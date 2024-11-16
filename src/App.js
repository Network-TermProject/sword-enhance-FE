import './App.css';

import { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Signin from './pages/Signin';
import Ranking from './pages/Ranking';
import Enhance from './pages/Enhance';
import New from './pages/New';

export const LoginContext = createContext();

function App() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onCreateId = (Id) => {
    setUserId(Id);
  }

  const onCreatePassword = (password) => {
    setPassword(password);
  }

  const onCreateConfirmPassword = (confirmPassword) => {
    setConfirmPassword(confirmPassword);
  }

  return (
    <div className='App'>
      <LoginContext.Provider value={{
        onCreateId, onCreatePassword, onCreateConfirmPassword
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<Ranking/>}/>
            <Route path="/signin" element={<Signin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enhance" element={<Enhance />} />
            <Route path="/new" element={<New />} />

          </Routes>
        </Router>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
