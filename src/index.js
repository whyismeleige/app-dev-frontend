import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css';

const root = ReactDOM.createRoot(document.querySelector('body'));
root.render(
  <GoogleOAuthProvider clientId='39036734117-rsm5sghamru8gb46c90nuohuc7bc9tp1.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
);

