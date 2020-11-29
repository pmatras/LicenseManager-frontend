import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiTabbedContent } from '@elastic/eui';

const LicensesPanel = ({ userRoles }) => {
  const tabs = [
    {
      id: 'licenses-management',
      name: 'Licenses Management',
      content: '',
    },
    {
      id: 'license-create',
      name: 'Create License',
      content: '',
    },
  ];

  if (userRoles.includes('ADMIN')) {
    tabs.splice(1, 0, {
      id: 'license-templates-management',
      name: 'License Templates Management',
      content: '',
    });
    tabs.splice(3, 0, {
      id: 'license-templates-create',
      name: 'Create License Template',
      content: '',
    });
  }
  return <EuiTabbedContent tabs={tabs} autoFocus="selected" />;
};

LicensesPanel.propTypes = {
  userRoles: PropTypes.array.isRequired,
};

const mapStateToProps = ({ authentication: { user } }) => ({
  userRoles: user.roles,
});

export default connect(mapStateToProps)(LicensesPanel);
