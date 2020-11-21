import React from 'react';
import { EuiTabbedContent } from '@elastic/eui';

const CustomersPanel = () => {
  const tabs = [
    {
      id: 'customers-management',
      name: 'Customers Management',
      content: '',
    },
    {
      id: 'groups-management',
      name: 'Groups Management',
      content: '',
    },
    {
      id: 'customers-create',
      name: 'Create Customer',
      content: '',
    },
    {
      id: 'groups-create',
      name: 'Create Group',
      content: '',
    },
  ];

  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default CustomersPanel;
