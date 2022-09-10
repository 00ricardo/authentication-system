import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route, Switch
  , BrowserRouter as Router
} from 'react-router-dom';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import ConfirmEmail from './Screens/ConfirmEmail';
import ForgotPassword from './Screens/ForgotPassword';
import reportWebVitals from './reportWebVitals';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/password-reset">
          <ForgotPassword />
        </Route>
        <Route path="/confirm-email/">
          <ConfirmEmail />
        </Route>
      </Switch>
    </Router>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
