import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../common/axios';

import { EuiComboBox, EuiFormRow } from '@elastic/eui';

import { createDangerToast } from '../../common/toastsUtils';

const RolePermissionsForm = ({ selectedPermissions, selectPermissions }) => {
  const [availablePermissionsList, setAvailablePermissionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPermissionsList();
  }, []);

  const getPermissionsList = () => {
    setIsLoading(true);
    axios
      .get('/api/admin/permissions_list')
      .then(({ data }) => {
        if (data.length) {
          setAvailablePermissionsList(
            data.map((permission) => ({ label: permission }))
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  return (
    <EuiFormRow label="Role's permissions">
      <EuiComboBox
        placeholder="Select permissions"
        options={availablePermissionsList}
        selectedOptions={selectedPermissions}
        onChange={selectPermissions}
        isClearable
        isLoading={isLoading}
      />
    </EuiFormRow>
  );
};

RolePermissionsForm.propTypes = {
  selectedPermissions: PropTypes.array.isRequired,
  selectPermissions: PropTypes.func.isRequired,
};

export default RolePermissionsForm;
