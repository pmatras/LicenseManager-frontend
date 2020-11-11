import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './fixedHeader.scss';

import App from './app';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('page')
);

reportWebVitals();
