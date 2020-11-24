import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';

import { EuiBadge, EuiInMemoryTable } from '@elastic/eui';

import { createDangerToast } from '../../../common/toastsUtils';

const GroupsManagementTab = () => {
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  ];
  return (
    <EuiInMemoryTable
      itemId="id"
      items={groupsList}
      noItemsMessage="No groups found"
      columns={columns}
      loading={isLoading}
      pagination
      search={{
        box: {
          incremental: true,
        },
      }}
    />
  );
};

export default GroupsManagementTab;
