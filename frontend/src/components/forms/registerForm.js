import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  registerUser,
  setFormMessage,
} from '../../redux/slices/registrationSlice';
import icon from '../../icon.svg';
import { validateEmail, validatePassword } from '../../common/validators';

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
  EuiTextColor,
} from '@elastic/eui';

const RegisterForm = ({
  isRegistrationInProgress,
  registrationMessage: { success, text },
  registerUser,
  setFormMessage,
}) => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    rePassword: '',
    email: '',
    reEmail: '',
    firstName: '',
    lastName: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    setFormMessage({ success: true, text: '' });
  }, []);

  const formsHandler = ({ target: { name, value } }) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const isFormComplete = () => {
    if (Object.keys(userData).some((key) => userData[key] === '')) {
      setFormMessage({ success: false, text: 'Please fill every field' });

      return false;
    }
    return true;
  };

  const validateReForms = () => {
    const { password, rePassword, email, reEmail } = userData;
    setPasswordError(password === rePassword ? '' : `Passwords don't match`);
    setEmailError(email === reEmail ? '' : `Emails don't match`);

    return password === rePassword && email === reEmail;
  };

  const validateForm = () => {
    const { password, email } = userData;
    const isPasswordValid = validatePassword(password);
    setPasswordError(
      isPasswordValid ? '' : 'Password must have at least 8 characters'
    );
    const isEmailValid = validateEmail(email);
    setEmailError(isEmailValid ? '' : `Email isn't valid`);

    return isPasswordValid && isEmailValid;
  };

  const submitRegisterRequest = () => {
    // eslint-disable-next-line no-unused-vars
    const { rePassword, reEmail, ...registrationData } = userData;
    if (isFormComplete()) {
      if (validateReForms() && validateForm()) {
        registerUser(registrationData);
        setFormMessage({ success: true, text: '' });
      } else {
        setFormMessage({ success: false, text: 'Your form contains errors' });
      }
    }
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
      <EuiFormRow fullWidth label="Password" isInvalid={passwordError !== ''}>
        <EuiFieldPassword
          name="password"
          placeholder="Enter your password"
          value={userData.password}
          type="dual"
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow
        fullWidth
        label="Re-enter password"
        isInvalid={passwordError !== ''}
        helpText={<EuiTextColor color="danger">{passwordError}</EuiTextColor>}
      >
        <EuiFieldPassword
          name="rePassword"
          placeholder="Re-enter your password"
          value={userData.rePassword}
          type="dual"
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow fullWidth label="E-mail" isInvalid={emailError !== ''}>
        <EuiFieldText
          name="email"
          placeholder="Enter your e-mail"
          value={userData.email}
          onChange={formsHandler}
        />
      </EuiFormRow>
      <EuiFormRow
        fullWidth
        label="Re-enter e-mail"
        isInvalid={emailError !== ''}
        helpText={<EuiTextColor color="danger">{emailError}</EuiTextColor>}
      >
        <EuiFieldText
          name="reEmail"
          placeholder="Re-enter your e-mail"
          value={userData.reEmail}
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
          size="m"
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
  setFormMessage: PropTypes.func.isRequired,
};

const mapStateToProps = ({ registration }) => ({
  isRegistrationInProgress: registration.isRegistrationInProgress,
  registrationMessage: registration.registrationMessage,
  registrationErrorMessage: registration.registrationErrorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: (userData) => dispatch(registerUser(userData)),
  setFormMessage: (message) => dispatch(setFormMessage(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
