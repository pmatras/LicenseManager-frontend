import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginPage from '../views/loginPage';
import RegisterPage from '../views/registerPage';

const RoutesProtector = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <Switch>
      <Route path="/home">
        <div></div>
      </Route>
      <Route render={() => <Redirect to="/home" />} />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
      <Route render={() => <Redirect to="/login" />} />
    </Switch>
  );
};

RoutesProtector.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ authentication }) => ({
  isAuthenticated: authentication.isAuthenticated,
});

export default connect(mapStateToProps)(RoutesProtector);
