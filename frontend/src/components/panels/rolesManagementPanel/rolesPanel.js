import React from 'react';
import { EuiTabbedContent } from '@elastic/eui';

const RolesPanel = () => {
  const tabs = [
    {
      id: 'roles-management',
      name: 'Roles Management',
      content: '',
    },
    {
      id: 'roles-create',
      name: 'Create Role',
      content: '',
    },
  ];
  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default RolesPanel;
