import { EuiButton, EuiHealth, EuiInMemoryTable } from '@elastic/eui';
import React, { useState, useEffect, Fragment } from 'react';
import axios from '../../../common/axios';

import {
  createSuccessToast,
  createDangerToast,
} from '../../../common/toastsUtils';
import UserRolesForm from '../../forms/userRolesForm';
import ConfirmModal from '../../modals/confirmModal';

const UsersManagementTab = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = () => {
    setIsLoading(true);
    axios
      .get('/api/admin/users')
      .then((response) => {
        if (response.data.length) {
          setUsersList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        createDangerToast(
          'Error',
          error.response ? error.response.message : error.message
        );
      });
  };

  const lockUserAccount = ({ id }) => {
    axios
      .post(`/api/admin/lock_user?user_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getUsersList();
      })
      .catch((error) =>
        createDangerToast(
          'Error',
          error.response ? error.response.message : error.message
        )
      );
  };

  const unlockUserAccount = ({ id }) => {
    axios
      .post(`/api/admin/unlock_user?user_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getUsersList();
      })
      .catch((error) =>
        createDangerToast(
          'Error',
          error.response ? error.response.message : error.message
        )
      );
  };

  const showEditModal = (user) => {
    setIsEditModalVisible(true);
    setUserToEdit(user);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setUserToEdit({});
    setSelectedRoles([]);
  };

  const editUser = () => {
    const { id: userId } = userToEdit;
    const roles = selectedRoles.map(({ label }) => label);

    axios
      .put('/api/admin/edit_user_roles', { userId, roles })
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getUsersList();
      })
      .catch((error) =>
        createDangerToast(
          'Error',
          error.response ? error.response.data.message : error.message
        )
      );
  };

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getUsersList}
    >
      Refresh
    </EuiButton>
  );
  const actions = [
    {
      name: `Lock user`,
      description: `Lock user's account`,
      icon: 'lock',
      type: 'icon',
      onClick: lockUserAccount,
      available: ({ isActive }) => isActive,
    },
    {
      name: 'Unlock user',
      description: `Unlock user's account`,
      icon: 'lockOpen',
      type: 'icon',
      onClick: unlockUserAccount,
      available: ({ isActive }) => !isActive,
    },
    {
      name: 'Edit user',
      description: `Edit user's roles`,
      icon: 'documentEdit',
      type: 'icon',
      onClick: showEditModal,
    },
  ];

  const columns = [
    {
      field: 'firstName',
      name: 'First name',
      sortable: true,
    },
    {
      field: 'lastName',
      name: 'Last name',
      sortable: true,
    },
    {
      field: 'username',
      name: 'Username',
      sortable: true,
    },
    {
      field: 'email',
      name: 'E-mail',
    },
    {
      field: 'isActive',
      name: 'Active',
      sortable: true,

      render: (isActive) => (
        <EuiHealth color={isActive ? 'success' : 'danger'}>
          {isActive ? 'Enabled' : 'Disabled'}
        </EuiHealth>
      ),
    },
    {
      field: 'creationDate',
      name: 'Creation date',
      sortable: true,
    },
    {
      field: 'Actions',
      actions: actions,
    },
  ];

  const editUserModal = isEditModalVisible ? (
    <ConfirmModal
      title="Edit user"
      content={
        <UserRolesForm
          user={userToEdit}
          selectedRoles={selectedRoles}
          selectRoles={setSelectedRoles}
        />
      }
      closeModal={closeEditModal}
      confirmModal={editUser}
    />
  ) : null;

  return (
    <Fragment>
      {editUserModal}
      <EuiInMemoryTable
        itemId="id"
        items={usersList}
        noItemsMessage="No users found"
        columns={columns}
        loading={isLoading}
        pagination
        search={{
          toolsRight: renderToolsRight(),
          box: {
            incremental: true,
          },
          filters: [
            {
              type: 'field_value_toggle_group',
              field: 'isActive',
              items: [
                {
                  value: true,
                  name: 'Enabled',
                },
                {
                  value: false,
                  name: 'Disabled',
                },
              ],
            },
          ],
        }}
        sorting
      />
    </Fragment>
  );
};

export default UsersManagementTab;
