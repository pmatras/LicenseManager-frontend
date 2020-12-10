import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from '../../../common/axios';

import { EuiBadge, EuiButton, EuiHealth, EuiInMemoryTable } from '@elastic/eui';

import { createDangerToast } from '../../../common/toastsUtils';
import { changePageTitle } from '../../../redux/slices/navigationSlice';

const LicensesOverviewPanel = ({ changePageTitle }) => {
  const [licensesList, setLicensesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [licenseCustomersList, setLicenseCustomersList] = useState([]);
  const [licenseTemplatesList, setLicenseTemplatesList] = useState([]);

  useEffect(() => {
    changePageTitle('Licenses Overview');
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

  const downloadLicenseFile = ({ id }, type = 'license') => {
    const operation = type === 'license' ? 'download_file' : 'download_keys';
    axios
      .get(`/api/licenses/${operation}?license_id=${id}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const filename = decodeURI(
          response.headers['content-disposition'].split('filename=')[1]
        );
        const downloadURL = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadURL;
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
      });
  };

  const actions = [
    {
      name: 'Download license file',
      description: 'Download encrypted license file',
      icon: 'download',
      type: 'icon',
      isPrimary: true,
      onClick: downloadLicenseFile,
    },
    {
      name: 'Download license keys file',
      description: `Download file with license file's required keys`,
      icon: 'document',
      type: 'icon',
      isPrimary: true,
      onClick: (license) => downloadLicenseFile(license, 'license_keys'),
    },
  ];

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
    {
      field: 'Actions',
      actions,
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
};

LicensesOverviewPanel.propTypes = {
  changePageTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  changePageTitle: (title) => dispatch(changePageTitle(title)),
});

export default connect(null, mapDispatchToProps)(LicensesOverviewPanel);
