import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import ThemeProviderWrapper from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <ThemeProviderWrapper>
    <App />
  </ThemeProviderWrapper>
)
