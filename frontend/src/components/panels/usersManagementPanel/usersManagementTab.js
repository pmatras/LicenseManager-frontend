import { EuiButton, EuiHealth, EuiInMemoryTable } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import axios from '../../../common/axios';

import {
  createSuccessToast,
  createDangerToast,
} from '../../../common/toastsUtils';

const UsersManagementTab = () => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
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
      }}
      sorting
    />
  );
};

export default UsersManagementTab;
