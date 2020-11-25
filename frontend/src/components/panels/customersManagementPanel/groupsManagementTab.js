import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../../common/axios';

import { EuiBadge, EuiButton, EuiInMemoryTable } from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';
import ConfirmModal from '../../modals/confirmModal';
import EditGroupForm from '../../forms/editGroupForm';

const GroupsManagementTab = () => {
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState({});
  const [editedGroupDetails, setEditedGroupDetails] = useState({});

  useEffect(() => {
    getGroupsList();
  }, []);

  const getGroupsList = () => {
    setIsLoading(true);
    axios
      .get('/api/customers/groups_list')
      .then(({ data }) => {
        if (data.length) {
          setGroupsList(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const showEditModal = (group) => {
    setIsEditModalVisible(true);
    setGroupToEdit(group);
    setEditedGroupDetails({
      newName: group.name,
      newDisplayColor: group.displayColor,
    });
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setGroupToEdit({});
    setEditedGroupDetails({});
  };

  const editGroup = () => {
    const { id: groupId } = groupToEdit;
    const { newName, newDisplayColor } = editedGroupDetails;

    axios
      .put('/api/customers/edit_group', { groupId, newName, newDisplayColor })
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getGroupsList();
      })
      .catch((error) => createDangerToast('Error', error));

    closeEditModal();
  };

  const deleteGroup = ({ id }) => {
    axios
      .delete(`/api/customers/delete_group?group_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getGroupsList();
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const actions = [
    {
      name: 'Edit group',
      description: 'Edit this group',
      icon: 'documentEdit',
      type: 'icon',
      isPrimary: true,
      onClick: showEditModal,
    },
    {
      name: 'Delete group',
      description: 'Delete this group',
      icon: 'trash',
      type: 'icon',
      isPrimary: true,
      onClick: deleteGroup,
    },
  ];

  const columns = [
    {
      field: 'name',
      name: 'Group',
      sortable: true,
      footer: ({ items }) =>
        `${items.length} ${items.length === 1 ? 'group' : 'groups'}`,
    },
    {
      field: 'displayColor',
      name: 'Color',
      render: (displayColor) => (
        <EuiBadge color={displayColor} style={{ width: '50%' }} />
      ),
    },
    {
      field: 'Actions',
      actions: actions,
    },
  ];

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getGroupsList}
    >
      Refresh
    </EuiButton>
  );

  const editGroupModal = isEditModalVisible ? (
    <ConfirmModal
      title={`Edit Group ${groupToEdit.name}`}
      content={
        <EditGroupForm
          groupDetails={editedGroupDetails}
          setGroupDetails={setEditedGroupDetails}
        />
      }
      closeModal={closeEditModal}
      confirmModal={editGroup}
    />
  ) : null;

  return (
    <Fragment>
      {editGroupModal}
      <EuiInMemoryTable
        itemId="id"
        items={groupsList}
        noItemsMessage="No groups found"
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

export default GroupsManagementTab;
