import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fredoka/700.css'
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/700.css'
import './index.less'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
