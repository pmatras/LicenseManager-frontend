import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import CreateLicenseTemplateTab from './createLicenseTemplateTab';

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
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CreateLicenseTemplateTab />
        </Fragment>
      ),
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
