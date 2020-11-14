import React, { Fragment } from 'react';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import UsersManagementTab from './usersManagementTab';
import UsersActivationTab from './usersActivationTab';

const UsersPanel = () => {
  const tabs = [
    {
      id: 'users-management',
      name: 'Users Management',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <UsersManagementTab />
        </Fragment>
      ),
    },
    {
      id: 'users-pending',
      name: 'Pending Users',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <UsersActivationTab />
        </Fragment>
      ),
    },
  ];

  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default UsersPanel;
