import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';

import EmailAlertsTab from './emailAlertsTab';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const AlertsPanel = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Alerts Settings');
  }, []);

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

AlertsPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(AlertsPanel);
