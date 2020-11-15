import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../../common/axios';

import { EuiInMemoryTable, EuiHealth, EuiButton } from '@elastic/eui';

import ConfirmModal from '../../modals/confirmModal';
import ActivateUserForm from '../../forms/activateUserForm';
import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const UsersActivationTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsersList, setPendingUsersList] = useState([]);
  const [isActivationModalVisible, setIsActivationModalVisible] = useState(
    false
  );
  const [userToActivate, setUserToActivate] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    getPendingUsersList();
  }, []);

  const getPendingUsersList = () => {
    axios
      .get('/api/admin/pending_users')
      .then(({ data }) => {
        if (data.length) {
          setPendingUsersList(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast(
          'Error',
          error.response ? error.response.message : error.message
        );
        setIsLoading(false);
      });
  };

  const deletePendingUser = ({ id }) => {
    axios
      .post(`/api/admin/delete_pending_user?user_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getPendingUsersList();
      })
      .catch((error) =>
        createDangerToast(
          'Error',
          error.response ? error.response.message : error.message
        )
      );
  };

  const closeActivationModal = () => {
    setIsActivationModalVisible(false);
    setUserToActivate({});
    setSelectedRoles([]);
  };

  const showActivationModal = (user) => {
    setIsActivationModalVisible(true);
    setUserToActivate(user);
  };

  const activateUser = () => {
    const { id: userId } = userToActivate;
    const roles = selectedRoles.map(({ label }) => label);
    axios
      .post('/api/admin/activate_user', { userId, roles })
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getPendingUsersList();
      })
      .catch((error) =>
        createDangerToast(
          'Error',
          error.response ? error.response.data.message : error.message
        )
      );
    closeActivationModal();
  };

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getPendingUsersList}
    >
      Refresh
    </EuiButton>
  );

  const actions = [
    {
      name: 'Activate pending user',
      description: `Activate pending user's account`,
      icon: 'check',
      type: 'icon',
      onClick: showActivationModal,
    },
    {
      name: 'Delete pending user',
      description: `Delete pending user's account`,
      icon: 'trash',
      type: 'icon',
      onClick: deletePendingUser,
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
      name: 'Account enabled',
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

  const userActivationModal = isActivationModalVisible ? (
    <ConfirmModal
      title={'Activate user'}
      content={
        <ActivateUserForm
          user={userToActivate}
          selectedRoles={selectedRoles}
          selectRoles={setSelectedRoles}
        />
      }
      closeModal={closeActivationModal}
      confirmModal={activateUser}
    />
  ) : null;

  return (
    <Fragment>
      {userActivationModal}
      <EuiInMemoryTable
        itemId="id"
        items={pendingUsersList}
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
    </Fragment>
  );
};

export default UsersActivationTab;
