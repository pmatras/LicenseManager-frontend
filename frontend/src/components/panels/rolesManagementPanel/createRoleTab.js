import React, { useState, useEffect } from 'react';
import axios from '../../../common/axios';

import {
  EuiButton,
  EuiComboBox,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const CreateRoleTab = () => {
  const [availablePermissionsList, setAvailablePermissionsList] = useState([]);
  const [arePermissionsLoading, setArePermissionsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [areUsersLoading, setAreUsersLoading] = useState(true);
  const [roleDetails, setRoleDetails] = useState({
    roleName: '',
    selectedPermissions: [],
    selectedUsers: [],
  });

  useEffect(() => {
    getPermissionsList();
    getUsersList();
  }, []);

  const getPermissionsList = () => {
    setArePermissionsLoading(true);
    axios
      .get('/api/admin/permissions_list')
      .then(({ data }) => {
        if (data.length) {
          setAvailablePermissionsList(
            data.map((permission) => ({ label: permission }))
          );
        }
        setArePermissionsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setArePermissionsLoading(false);
      });
  };

  const getUsersList = () => {
    setAreUsersLoading(true);
    axios
      .get('/api/admin/users')
      .then(({ data }) => {
        if (data.length) {
          setUsersList(
            data.map(({ id, username }) => ({ id, label: username }))
          );
        }
        setAreUsersLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setAreUsersLoading(false);
      });
  };

  const onRoleNameChange = ({ target: { value, name } }) => {
    setRoleDetails({
      ...roleDetails,
      [name]: value.toUpperCase(),
    });
  };

  const onSelectedPermissionsChange = (selectedPermissions) => {
    setRoleDetails({
      ...roleDetails,
      selectedPermissions,
    });
  };

  const onSelectedUsersChange = (selectedUsers) => {
    setRoleDetails({
      ...roleDetails,
      selectedUsers,
    });
  };

  const createNewRole = () => {
    const { roleName, selectedPermissions, selectedUsers } = roleDetails;
    const payload = {
      name: roleName,
      permissions: selectedPermissions.map(({ label }) => label),
      usersIds: selectedUsers.map(({ id }) => id),
    };
    axios
      .post('/api/admin/create_role', payload)
      .then(({ data }) => createSuccessToast('Success', data.message))
      .catch((error) => createDangerToast('Error', error));
  };

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>Role Name</h3>}
        description={
          <EuiText>
            Select name for newly created role, note that role name will be
            transformed to upper case
          </EuiText>
        }
      >
        <EuiFormRow label="Role Name">
          <EuiFieldText
            name="roleName"
            placeholder="NAME"
            value={roleDetails.roleName}
            onChange={onRoleNameChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Role Permissions</h3>}
        description={
          <EuiText>
            Select permissions for newly created role from available ones
          </EuiText>
        }
      >
        <EuiFormRow label="Role Permissions">
          <EuiComboBox
            placeholder="Select permissions"
            options={availablePermissionsList}
            selectedOptions={roleDetails.selectedPermissions}
            onChange={onSelectedPermissionsChange}
            isClearable
            isLoading={arePermissionsLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Role&apos;s users</h3>}
        description={
          <EuiText>
            Select users who will be assigned to new role at once or leave
            blank. If users list is long, you can search for user by typing text
            in field
          </EuiText>
        }
      >
        <EuiFormRow label="Assigned Users">
          <EuiComboBox
            placeholder="Select users"
            options={usersList}
            selectedOptions={roleDetails.selectedUsers}
            onChange={onSelectedUsersChange}
            isClearable
            isLoading={areUsersLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={createNewRole}>
        Create role
      </EuiButton>
    </EuiForm>
  );
};

export default CreateRoleTab;
