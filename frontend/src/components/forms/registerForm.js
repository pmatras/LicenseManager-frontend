import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { registerUser } from '../../redux/slices/registrationSlice';
import icon from '../../icon.svg';

import {
  EuiButton,
  EuiCallOut,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFormRow,
  EuiIcon,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

const RegisterForm = ({
  isRegistrationInProgress,
  registrationMessage: { success, text },
  registerUser,
}) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const formsHandler = ({ target: { name, value } }) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const submitRegisterRequest = () => {
    registerUser(userData);
  };

  return (
    <Fragment>
      <EuiFlexGroup justifyContent="center" alignItems="center">
        <EuiIcon
          type={icon}
          size="original"
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '30%',
          }}
        />
      </EuiFlexGroup>
      <EuiSpacer size="xl" />
      {text !== '' && (
        <EuiFormRow>
          <EuiCallOut
            title={text}
            color={success ? 'success' : 'danger'}
            iconType={success ? 'email' : 'alert'}
          />
        </EuiFormRow>
      )}
      <EuiSpacer size="xl" />
      <EuiFormRow fullWidth label="Username">
        <EuiFieldText
          name="username"
          placeholder="Enter your username"
          value={userData.username}
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow fullWidth label="Password">
        <EuiFieldPassword
          name="password"
          placeholder="Enter your password"
          value={userData.password}
          type="dual"
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow fullWidth label="E-mail">
        <EuiFieldText
          name="email"
          placeholder="Enter your e-mail"
          value={userData.email}
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow fullWidth label="First name">
        <EuiFieldText
          name="firstName"
          placeholder="Enter your first name"
          value={userData.firstName}
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow fullWidth label="Last name">
        <EuiFieldText
          name="lastName"
          placeholder="Enter your last name"
          value={userData.lastName}
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiSpacer size="xl" />
      <EuiSpacer size="xl" />
      <EuiFlexGroup
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <EuiButton
          fill
          size="xl"
          onClick={() => {
            submitRegisterRequest();
          }}
          isLoading={isRegistrationInProgress}
        >
          Sign up
        </EuiButton>
        <EuiSpacer size="xl" />
        <EuiText>
          Already have an account? <Link to="/login">Log in</Link>
        </EuiText>
      </EuiFlexGroup>
    </Fragment>
  );
};

RegisterForm.propTypes = {
  isRegistrationInProgress: PropTypes.bool.isRequired,
  registrationMessage: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isRegistrationInProgress: state.isRegistrationInProgress,
  registrationMessage: state.registrationMessage,
  registrationErrorMessage: state.registrationErrorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: (userData) => dispatch(registerUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
