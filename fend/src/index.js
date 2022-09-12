import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route, Routes
  , BrowserRouter as Router
} from 'react-router-dom';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import ConfirmEmail from './Screens/ConfirmEmail';
import ForgotPassword from './Screens/ForgotPassword';
import reportWebVitals from './reportWebVitals';
import Home from './Screens/Home';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/system" element={<Home />} />
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
