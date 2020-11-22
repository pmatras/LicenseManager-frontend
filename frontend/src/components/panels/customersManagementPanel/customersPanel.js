import React, { Fragment } from 'react';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import CustomersManagementTab from './customersManagementTab';
import CreateGroupTab from './createGroupTab';
import CreateCustomerTab from './createCustomerTab';

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
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CreateCustomerTab />
        </Fragment>
      ),
    },
    {
      id: 'groups-create',
      name: 'Create Group',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CreateGroupTab />
        </Fragment>
      ),
    },
  ];

  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default CustomersPanel;
