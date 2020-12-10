import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import RolesManagementTab from './rolesManagementTab';
import CreateRoleTab from './createRoleTab';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const RolesPanel = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Roles');
  }, []);

  const tabs = [
    {
      id: 'roles-management',
      name: 'Roles Management',
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <RolesManagementTab />
        </Fragment>
      ),
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

RolesPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(RolesPanel);
