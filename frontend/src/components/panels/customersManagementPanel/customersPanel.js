import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import CustomersManagementTab from './customersManagementTab';
import CreateGroupTab from './createGroupTab';
import CreateCustomerTab from './createCustomerTab';
import GroupsManagementTab from './groupsManagementTab';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const CustomersPanel = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Customers');
  }, []);

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
      content: (
        <Fragment>
          <EuiSpacer size="xl" />
          <GroupsManagementTab />
        </Fragment>
      ),
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

CustomersPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(CustomersPanel);
