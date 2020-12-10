import React, { Fragment } from 'react';
import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import EmailAlertsTab from './emailAlertsTab';

const AlertsPanel = () => {
  const tabs = [
    {
      id: 'email-alerts-settings',
      name: 'Email Alerts Settings',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <EmailAlertsTab />
        </Fragment>
      ),
    },
  ];

  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

export default AlertsPanel;
