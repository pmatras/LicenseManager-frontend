import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';

import { EuiBadge, EuiButton, EuiHealth, EuiInMemoryTable } from '@elastic/eui';

import { createDangerToast } from '../../../common/toastsUtils';

function LicensesManagementTab() {
  const [licensesList, setLicensesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [licenseCustomersList, setLicenseCustomersList] = useState([]);
  const [licenseTemplatesList, setLicenseTemplatesList] = useState([]);

  useEffect(() => {
    getLicensesList();
  }, []);

  const getLicensesList = () => {
    setIsLoading(true);
    axios
      .get('/api/licenses/list')
      .then(({ data }) => {
        if (data.length) {
          setLicensesList(data);
          const customersList = getLicenseCustomersList(data);
          setLicenseCustomersList(customersList);
          const templatesList = getLicenseTemplatesList(data);
          setLicenseTemplatesList(templatesList);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const getLicenseCustomersList = (licensesList) => {
    const customers = licensesList.map(({ customer: { id, name } }) => ({
      id,
      name,
      value: name,
    }));
    const uniqueCustomers = [];
    customers.forEach((customer) => {
      if (!uniqueCustomers.some(({ id }) => id === customer.id)) {
        uniqueCustomers.push(customer);
      }
    });

    return uniqueCustomers;
  };

  const getLicenseTemplatesList = (licensesList) => {
    const templates = licensesList.map(({ usedTemplate: { id, name } }) => ({
      id,
      name,
      value: name,
    }));
    const uniqueTemplates = [];
    templates.forEach((template) => {
      if (!uniqueTemplates.some(({ id }) => id === template.id)) {
        uniqueTemplates.push(template);
      }
    });

    return uniqueTemplates;
  };

  const columns = [
    {
      field: 'name',
      name: 'License',
      sortable: true,
      footer: ({ items }) =>
        `${items.length} ${items.length === 1 ? 'license' : 'licenses'}`,
    },
    {
      field: 'generationDate',
      name: 'Generation Date',
      sortable: true,
    },
    {
      field: 'expirationDate',
      name: 'Expiration Date',
      sortable: true,
    },
    {
      field: 'customer.name',
      name: 'Customer',
      sortable: true,
    },
    {
      field: 'isExpired',
      name: 'Expired',
      render: (isExpired) => (
        <EuiBadge
          color={isExpired ? 'danger' : 'secondary'}
          style={{ width: '75px', textAlign: 'center' }}
        >
          {isExpired ? 'EXPIRED' : 'VALID'}
        </EuiBadge>
      ),
    },
    {
      field: 'isActive',
      name: 'Active',
      render: (isActive) => (
        <EuiHealth color={isActive ? 'success' : 'danger'} />
      ),
    },
  ];

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={getLicensesList}
    >
      Refresh
    </EuiButton>
  );

  return (
    <EuiInMemoryTable
      itemId="id"
      items={licensesList}
      noItemsMessage="No licenses found"
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
            type: 'field_value_toggle_group',
            field: 'isActive',
            items: [
              {
                value: true,
                name: 'Active',
              },
              {
                value: false,
                name: 'Inactive',
              },
            ],
          },
          {
            type: 'field_value_toggle_group',
            field: 'isExpired',
            items: [
              {
                value: false,
                name: 'Valid',
              },
              {
                value: true,
                name: 'Expired',
              },
            ],
          },
          {
            type: 'field_value_selection',
            field: 'customer.name',
            name: 'Customer(s)',
            filterWith: 'includes',
            operator: 'exact',
            multiSelect: 'or',
            options: licenseCustomersList,
            noOptionsMessage: 'No license customers available',
          },
          {
            type: 'field_value_selection',
            field: 'usedTemplate.name',
            name: 'Template(s)',
            filterWith: 'includes',
            operator: 'exact',
            multiSelect: 'or',
            options: licenseTemplatesList,
            noOptionsMessage: 'No license templates available',
          },
        ],
      }}
      sorting
    />
  );
}

export default LicensesManagementTab;
