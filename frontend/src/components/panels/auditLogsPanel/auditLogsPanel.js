import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from '../../../common/axios';

import { EuiButton, EuiInMemoryTable } from '@elastic/eui';

import { createDangerToast } from '../../../common/toastsUtils';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const AuditLogsPanel = ({ changePageTitle }) => {
  const [auditEventsList, setAuditEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [operationsList, setOperationsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    changePageTitle('Audit Logs');
    getAuditLogs();
    getOperationsList();
  }, []);

  const getAuditLogs = () => {
    setIsLoading(true);
    axios
      .get('/api/audit/logs')
      .then(({ data }) => {
        setIsLoading(false);
        setAuditEventsList(data);
        const usersList = parseUsersList(data);
        setUsersList(usersList);
      })
      .catch((error) => {
        setIsLoading(false);
        createDangerToast('Error', error);
      });
  };

  const getOperationsList = () => {
    axios
      .get('/api/audit/operations_list')
      .then(({ data }) => {
        setOperationsList(
          data.map((operation) => ({
            name: operation,
            value: operation,
          }))
        );
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const parseUsersList = (auditLogs) => {
    return [
      ...new Set(auditLogs.map(({ username }) => username)),
    ].map((username) => ({ name: username, value: username }));
  };

  const columns = [
    {
      field: 'id',
      name: 'Id',
      sortable: true,
      width: '10%',
      footer: ({ items }) =>
        `${items.length} ${
          items.length === 1 ? 'audit event' : 'audit events'
        }`,
    },
    {
      field: 'timestamp',
      name: 'Operation Time',
      sortable: true,
    },
    {
      field: 'operation',
      name: 'Operation Name',
      sortable: true,
    },
    {
      field: 'username',
      name: 'Username',
      sortable: true,
    },
    {
      field: 'details',
      name: 'Details',
      width: '30%',
    },
  ];

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getAuditLogs}
    >
      Refresh
    </EuiButton>
  );

  return (
    <EuiInMemoryTable
      itemId="id"
      items={auditEventsList}
      noItemsMessage="No audit logs found"
      columns={columns}
      loading={isLoading}
      pagination
      search={{
        toolsRight: renderToolsRight(),
        box: {
          incremental: true,
        },
        filters: [
          {
            type: 'field_value_selection',
            field: 'operation',
            name: 'Operation(s)',
            filterWith: 'includes',
            operator: 'exact',
            multiSelect: 'or',
            options: operationsList,
            noOptionsMessage: 'No operations available',
          },
          {
            type: 'field_value_selection',
            field: 'username',
            name: 'Username(s)',
            filterWith: 'includes',
            operator: 'exact',
            multiSelect: 'or',
            options: usersList,
            noOptionsMessage: 'No users available',
          },
        ],
      }}
      sorting
    />
  );
};

AuditLogsPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(AuditLogsPanel);
