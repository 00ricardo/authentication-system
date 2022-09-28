import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route, Routes
  , BrowserRouter as Router
} from 'react-router-dom';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import ConfirmEmail from './screens/ConfirmEmail';
import ForgotPassword from './screens/ForgotPassword';
import reportWebVitals from './reportWebVitals';
import Home from './screens/Home';
export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/system" element={<Home protected />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password-reset" element={<ForgotPassword />} />
        <Route path="/confirm-email/" element={<ConfirmEmail />} />
      </Routes>
    </Router>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
