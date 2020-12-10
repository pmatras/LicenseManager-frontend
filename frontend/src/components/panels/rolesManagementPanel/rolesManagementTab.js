import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../../common/axios';

import { EuiButton, EuiInMemoryTable } from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';
import ConfirmModal from '../../modals/confirmModal';
import RolePermissionsForm from '../../forms/rolePermissionsForm';

const RolesManagementTab = () => {
  const [rolesList, setRolesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    getRolesList();
  }, []);

  const getRolesList = () => {
    setIsLoading(true);
    axios
      .get('/api/admin/roles_list')
      .then(({ data }) => {
        if (data.length) {
          setRolesList(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const deleteRole = ({ id }) => {
    axios
      .delete(`/api/admin/delete_role?role_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getRolesList();
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const showEditModal = (name) => {
    setRoleToEdit(name);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setRoleToEdit('');
    setSelectedPermissions([]);
    setIsEditModalVisible(false);
  };

  const editRole = () => {
    const permissions = selectedPermissions.map(({ label }) => label);

    axios
      .put('/api/admin/edit_role', { name: roleToEdit, permissions })
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getRolesList();
      })
      .catch((error) => createDangerToast('Error', error));

    closeEditModal();
  };

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getRolesList}
    >
      Refresh
    </EuiButton>
  );

  const actions = [
    {
      name: 'Edit role',
      description: `Edit role's permissions`,
      icon: 'documentEdit',
      type: 'icon',
      onClick: ({ name }) => showEditModal(name),
      available: ({ name }) => name !== 'ADMIN',
    },
    {
      name: 'Delete role',
      description: `Delete role`,
      icon: 'trash',
      type: 'icon',
      onClick: deleteRole,
      available: ({ name }) => name !== 'ADMIN',
    },
  ];

  const columns = [
    {
      field: 'name',
      name: 'Role',
      sortable: true,
      width: '30%',
    },
    {
      field: 'permissions',
      name: 'Permissions',
      width: '70%',
      render: (permissions) => permissions.join(', '),
    },
    {
      field: 'Actions',
      actions: actions,
    },
  ];

  const editRoleModal = isEditModalVisible ? (
    <ConfirmModal
      title={`Edit role ${roleToEdit}`}
      content={
        <RolePermissionsForm
          selectedPermissions={selectedPermissions}
          selectPermissions={setSelectedPermissions}
        />
      }
      closeModal={closeEditModal}
      confirmModal={editRole}
    />
  ) : null;

  return (
    <Fragment>
      {editRoleModal}
      <EuiInMemoryTable
        itemId="id"
        items={rolesList}
        noItemsMessage="No roles found"
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

export default RolesManagementTab;
