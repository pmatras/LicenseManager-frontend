import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from '../../../common/axios';

import {
  EuiAvatar,
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';

import { changePageTitle } from '../../../redux/slices/navigationSlice';
import { validatePassword } from '../../../common/validators';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const EditUserAccountPanel = ({
  changePageTitle,
  username,
  firstName,
  lastName,
}) => {
  const [userDetails, setUserDetails] = useState({
    username,
    password: '',
    rePassword: '',
  });
  const [isFormReadOnly, setIsFormReadOnly] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    changePageTitle('Edit account');
  }, []);

  const toggleFormReadOnly = () => {
    setIsFormReadOnly(!isFormReadOnly);
  };

  const formHandler = ({ target: { name, value } }) => {
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { username, password, rePassword } = userDetails;
    if (username === '') {
      setError('Please fill in username');
      return false;
    }

    if (password !== '' || rePassword !== '') {
      if (password !== rePassword) {
        setError(`Passwords don't match`);
        return false;
      }
      if (!validatePassword(password)) {
        setError('Password must have at least 8 characters');
        return false;
      }
    }

    return true;
  };

  const editUserAccount = () => {
    if (validateForm()) {
      setError('');
      const { username: newUsername, password } = userDetails;
      const payload = {
        username: newUsername !== username ? newUsername : null,
        password: password || null,
      };

      axios
        .put('/api/account/edit', payload)
        .then(({ data }) => {
          setIsFormReadOnly(true);
          createSuccessToast('Success', data.message);
        })
        .catch((error) => createDangerToast('Error', error));
    }
  };

  return (
    <EuiPanel style={{ width: '40%', marginLeft: '30%', marginRight: '30%' }}>
      <EuiFlexGroup
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <EuiFlexItem>
          <EuiAvatar name={`${firstName} ${lastName}`} size="xl" />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="xl" />
      <EuiForm component="div" isInvalid={!!error} error={error}>
        <EuiFormRow label="Change username">
          <EuiFieldText
            readOnly={isFormReadOnly}
            name="username"
            value={userDetails.username}
            onChange={formHandler}
          />
        </EuiFormRow>
        <EuiFormRow label="Change Password">
          <EuiFieldPassword
            readOnly={isFormReadOnly}
            name="password"
            placeholder="Password"
            value={userDetails.password}
            type="dual"
            onChange={formHandler}
          />
        </EuiFormRow>
        <EuiFormRow label="Confirm Password">
          <EuiFieldPassword
            readOnly={isFormReadOnly}
            name="rePassword"
            placeholder="Re-enter password"
            value={userDetails.rePassword}
            type="dual"
            onChange={formHandler}
          />
        </EuiFormRow>
        <EuiSpacer size="xl" />
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiButton onClick={toggleFormReadOnly}>Edit Account</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton fill onClick={editUserAccount}>
              Save
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>
    </EuiPanel>
  );
};

EditUserAccountPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const mapStateToProps = ({ authentication: { user } }) => ({
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
});

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserAccountPanel);
