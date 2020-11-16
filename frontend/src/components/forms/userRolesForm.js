import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../common/axios';

import { EuiComboBox, EuiFormRow, EuiSpacer, EuiText } from '@elastic/eui';

import { createDangerToast } from '../../common/toastsUtils';

const UserRolesForm = ({ user, selectedRoles, selectRoles }) => {
  const [rolesList, setRolesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRolesList();
  }, []);

  const getRolesList = () => {
    setIsLoading(true);
    axios
      .get('/api/admin/roles_list')
      .then(({ data }) => {
        if (data.length) {
          setRolesList(data.map(({ name }) => ({ label: name })));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error.message);
        setIsLoading(false);
      });
  };

  const onSelectedRolesChange = (selectedRoles) => {
    selectRoles(selectedRoles);
  };

  const { firstName, lastName, username } = user;
  return (
    <Fragment>
      <EuiText grow={false} textAlign="left">
        {`User: ${firstName} ${lastName} with username ${username}`}
      </EuiText>
      <EuiSpacer size="xl" />
      <EuiFormRow>
        <EuiComboBox
          placeholder="Select user's roles"
          options={rolesList}
          selectedOptions={selectedRoles}
          onChange={onSelectedRolesChange}
          isClearable
          isLoading={isLoading}
        />
      </EuiFormRow>
    </Fragment>
  );
};

UserRolesForm.propTypes = {
  user: PropTypes.object.isRequired,
  selectedRoles: PropTypes.array.isRequired,
  selectRoles: PropTypes.func.isRequired,
};

export default UserRolesForm;
