import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import UsersManagementTab from './usersManagementTab';
import UsersActivationTab from './usersActivationTab';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const UsersPanel = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Users');
  }, []);

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

UsersPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(UsersPanel);
