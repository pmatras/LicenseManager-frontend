import React, { useState, useEffect, Fragment } from 'react';
import axios from '../../../common/axios';

import {
  EuiButton,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiHealth,
  EuiInMemoryTable,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';

import {
  createSuccessToast,
  createDangerToast,
} from '../../../common/toastsUtils';
import UserRolesForm from '../../forms/userRolesForm';
import ConfirmModal from '../../modals/confirmModal';

const UsersManagementTab = () => {
  const [usersList, setUsersList] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
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

  const refreshList = () => {
    getUsersList();
    setItemIdToExpandedRowMap({});
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

  const toggleUserDetails = (user) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[user.id]) {
      delete itemIdToExpandedRowMapValues[user.id];
    } else {
      let { roles, emailConfirmed, lastEditTime } = user;
      roles = roles.map(({ name }) => name).join(', ');

      const listItems = [
        {
          title: 'Roles',
          description: roles,
        },
        {
          title: 'E-mail Confirmed',
          description: (
            <EuiHealth color={emailConfirmed ? 'success' : 'danger'}>
              {emailConfirmed ? 'Confirmed' : 'Not Confirmed'}
            </EuiHealth>
          ),
        },
        {
          title: 'Last Edit Time',
          description: lastEditTime || 'N/A',
        },
      ];

      itemIdToExpandedRowMapValues[user.id] = (
        <EuiDescriptionList listItems={listItems} compressed />
      );
    }

    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={refreshList}
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
      isPrimary: true,
      onClick: lockUserAccount,
      available: ({ isActive }) => isActive,
    },
    {
      name: 'Unlock user',
      description: `Unlock user's account`,
      icon: 'lockOpen',
      type: 'icon',
      isPrimary: true,
      onClick: unlockUserAccount,
      available: ({ isActive }) => !isActive,
    },
    {
      name: 'Edit user',
      description: `Edit user's roles`,
      icon: 'documentEdit',
      type: 'icon',
      isPrimary: true,
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
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      isExpander: true,
      render: (user) => (
        <EuiButtonIcon
          onClick={() => toggleUserDetails(user)}
          aria-label={itemIdToExpandedRowMap[user.id] ? 'Collapse' : 'Expand'}
          iconType={itemIdToExpandedRowMap[user.id] ? 'arrowUp' : 'arrowDown'}
        />
      ),
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
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        isExpandable
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
