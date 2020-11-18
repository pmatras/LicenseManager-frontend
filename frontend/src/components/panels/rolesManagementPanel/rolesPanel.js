import React, { Fragment } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import CreateRoleTab from './createRoleTab';

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
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CreateRoleTab />
        </Fragment>
      ),
    },
  ];
  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default RolesPanel;
