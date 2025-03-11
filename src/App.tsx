
import './index.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Register from './pages/register';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/dashboard" element={<Dashboard  />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>

  );
}

export default App;
