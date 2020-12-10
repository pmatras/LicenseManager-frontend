import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import CreateLicenseTemplateTab from './createLicenseTemplateTab';
import LicenseTemplatesManagementTab from './licenseTemplatesManagementTab';
import CreateLicenseTab from './createLicenseTab';
import LicensesManagementTab from './licensesManagementTab';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const LicensesPanel = ({ changePageTitle, userRoles }) => {
  useEffect(() => {
    changePageTitle('Licenses');
  }, []);

  const tabs = [
    {
      id: 'licenses-management',
      name: 'Licenses Management',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <LicensesManagementTab />
        </Fragment>
      ),
    },
    {
      id: 'license-create',
      name: 'Create License',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <CreateLicenseTab />
        </Fragment>
      ),
    },
  ];

  if (userRoles.includes('ADMIN')) {
    tabs.splice(1, 0, {
      id: 'license-templates-management',
      name: 'License Templates Management',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <LicenseTemplatesManagementTab />
        </Fragment>
      ),
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
  changePageTitle: PropTypes.func.isRequired,
  userRoles: PropTypes.array.isRequired,
};

const mapStateToProps = ({ authentication: { user } }) => ({
  userRoles: user.roles,
});

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LicensesPanel);
