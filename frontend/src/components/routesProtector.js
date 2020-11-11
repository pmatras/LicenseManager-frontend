import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  rehydrateAuthentication,
  abortRehydration,
} from '../redux/slices/authenticationSlice';

import { getPersistedToken } from '../common/authTokenUtils';

import HomePage from '../views/homePage';
import LoginPage from '../views/loginPage';
import RegisterPage from '../views/registerPage';
import LoadingPage from '../views/loadingPage';

const RoutesProtector = ({
  rehydrationInProgress,
  rehydrateAuthentication,
  abortRehydration,
  isAuthenticated,
}) => {
  useEffect(() => {
    const token = getPersistedToken();
    token !== '' ? rehydrateAuthentication(token) : abortRehydration();
  }, []);

  if (!rehydrationInProgress) {
    return isAuthenticated ? (
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
        <Route render={() => <Redirect to="/" />} />
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
  } else {
    return <LoadingPage />;
  }
};

RoutesProtector.propTypes = {
  rehydrationInProgress: PropTypes.bool.isRequired,
  rehydrateAuthentication: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  abortRehydration: PropTypes.func.isRequired,
};

const mapStateToProps = ({ authentication }) => ({
  rehydrationInProgress: authentication.rehydrationInProgress,
  isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  rehydrateAuthentication: (token) => dispatch(rehydrateAuthentication(token)),
  abortRehydration: () => dispatch(abortRehydration()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutesProtector);
