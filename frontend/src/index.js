import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './fixedHeader.scss';
import '@elastic/eui/dist/eui_theme_dark.css';
//import '@elastic/eui/dist/eui_theme_light.css';
//import '@elastic/eui/dist/eui_theme_amsterdam_dark.css';
//import '@elastic/eui/dist/eui_theme_amsterdam_light.css';

import App from './app';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('page')
);

reportWebVitals();
