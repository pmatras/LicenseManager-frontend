import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import store from './redux/configureStore';
import RegisterPage from './views/registerPage';
import LoginPage from './views/loginPage';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route render={() => <Redirect to="/login" />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
