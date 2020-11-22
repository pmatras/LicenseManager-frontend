import React, { Fragment } from 'react';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import CustomersManagementTab from './customersManagementTab';

const CustomersPanel = () => {
  const tabs = [
    {
      id: 'customers-management',
      name: 'Customers Management',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CustomersManagementTab />
        </Fragment>
      ),
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
