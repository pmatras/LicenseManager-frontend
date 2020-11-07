import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  authenticateUser,
  setFormMessage,
} from '../../redux/slices/authenticationSlice';

import icon from '../../icon.svg';

import {
  EuiButton,
  EuiCallOut,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { connect } from 'react-redux';

const LoginForm = ({
  isAuthenticationInProgress,
  authenticationMessage: { success, text },
  setFormMessage,
  authenticateUser,
}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const formHandler = ({ target: { name, value } }) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { username, password } = credentials;
    return username.length && password.length;
  };

  const submitLoginRequest = () => {
    if (validateForm()) {
      authenticateUser(credentials);
      setFormMessage({ success: true, text: '' });
    } else {
      setFormMessage({ success: false, text: 'Please fill in every field' });
    }
  };

  return (
    <Fragment>
      <EuiFlexGroup grow="false" justifyContent="center">
        <EuiFlexItem>
          <EuiIcon
            type={icon}
            size="original"
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '40%',
            }}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="xl" />
      {text !== '' && (
        <EuiFormRow fullWidth>
          <EuiCallOut
            title={text}
            color={success ? 'success' : 'danger'}
            iconType="alert"
          />
        </EuiFormRow>
      )}
      <EuiFormRow fullWidth label="Username">
        <EuiFieldText
          name="username"
          placeholder="Enter your username"
          value={credentials.username}
          onChange={formHandler}
          isInvalid={!success}
        />
      </EuiFormRow>
      <EuiSpacer size="xl" />
      <EuiFormRow fullWidth label="Password">
        <EuiFieldPassword
          name="password"
          fullWidth
          placeholder="Enter your password"
          value={credentials.password}
          type="dual"
          onChange={formHandler}
          isInvalid={!success}
        />
      </EuiFormRow>
      <EuiSpacer size="xl" />
      <EuiSpacer size="xl" />
      <EuiFlexGroup alignItems="center" justifyContent="center">
        <EuiButton
          fill
          size="m"
          onClick={() => {
            submitLoginRequest();
          }}
          minWidth="50%"
          isLoading={isAuthenticationInProgress}
        >
          Log in
        </EuiButton>
      </EuiFlexGroup>
      <EuiSpacer size="xl" />
      <EuiSpacer size="xl" />
      <EuiFlexGroup alignItems="center" justifyContent="center">
        <EuiText>
          Doesn&apos;t have an account? <Link to="/register">Sign up</Link>
        </EuiText>
      </EuiFlexGroup>
    </Fragment>
  );
};

LoginForm.propTypes = {
  isAuthenticationInProgress: PropTypes.bool.isRequired,
  authenticationMessage: PropTypes.object.isRequired,
  setFormMessage: PropTypes.func.isRequired,
  authenticateUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ authentication }) => ({
  isAuthenticationInProgress: authentication.isAuthenticationInProgress,
  authenticationMessage: authentication.authenticationMessage,
});

const mapDispatchToProps = (dispatch) => ({
  setFormMessage: (errorMessage) => dispatch(setFormMessage(errorMessage)),
  authenticateUser: (credentials) => dispatch(authenticateUser(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
