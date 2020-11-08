import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './redux/configureStore';
import RoutesProtector from './components/routesProtector';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RoutesProtector />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
