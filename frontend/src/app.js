import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './redux/configureStore';
import RoutesProtector from './components/routesProtector';
import ThemeProvider from './themes/themeProvider';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <RoutesProtector />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
