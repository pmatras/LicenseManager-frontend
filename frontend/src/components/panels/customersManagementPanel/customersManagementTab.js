import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../../common/axios';

import {
  EuiBadge,
  EuiBadgeGroup,
  EuiButton,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiInMemoryTable,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';
import EditCustomerForm from '../../forms/editCustomerForm';
import ConfirmModal from '../../modals/confirmModal';

const CustomersManagementTab = () => {
  const [customersList, setCustomersList] = useState([]);
  const [customersTableItems, setCustomersTableItems] = useState([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [customersGroups, setCustomersGroups] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(false);
  const [editedCustomerDetails, setEditedCustomerDetails] = useState({});

  useEffect(() => {
    getCustomersList();
  }, []);

  const getCustomersList = () => {
    setIsLoading(true);
    axios
      .get('/api/customers/customers_list')
      .then(({ data }) => {
        if (data.length) {
          setCustomersList(data);
          setCustomersTableItems(
            data.map((customer) => ({
              ...customer,
              groups: customer.groups.map(({ name }) => name),
            }))
          );
          const groups = data.flatMap(({ groups }) => groups);
          const uniqueGroups = [];
          groups.forEach((group) => {
            if (uniqueGroups.findIndex(({ id }) => group.id === id) === -1) {
              uniqueGroups.push(group);
            }
          });
          setCustomersGroups(uniqueGroups);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const refreshList = () => {
    getCustomersList();
    setItemIdToExpandedRowMap({});
  };

  const deleteCustomer = ({ id }) => {
    axios
      .delete(`/api/customers/delete_customer?customer_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        refreshList();
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const showEditModal = (customer) => {
    setIsEditModalVisible(true);
    setCustomerToEdit(customer);
    const { groups } = customersList.find(({ id }) => id === customer.id);
    setEditedCustomerDetails({
      newName: customer.name,
      selectedGroups: groups.map(({ name, displayColor }) => ({
        label: name,
        color: displayColor,
      })),
    });
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setCustomerToEdit({});
  };

  const editCustomer = () => {
    const { id: customerId } = customerToEdit;
    const { newName, selectedGroups } = editedCustomerDetails;
    const groups = selectedGroups.map(({ label }) => label);

    axios
      .put('/api/customers/edit_customer', { customerId, newName, groups })
      .then(({ data }) => {
        createSuccessToast('Successs', data.message);
        refreshList();
      })
      .catch((error) => createDangerToast('Error', error));

    closeEditModal();
  };

  const toggleCustomerDetails = (customer) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[customer.id]) {
      delete itemIdToExpandedRowMapValues[customer.id];
    } else {
      const { groups } = customersList.find(({ id }) => id === customer.id);
      const listItems = [
        {
          title: 'Groups',
          description: (
            <EuiBadgeGroup gutterSize="xs">
              {groups.map(({ id, name, displayColor }) => (
                <EuiBadge color={displayColor} key={id}>
                  {name}
                </EuiBadge>
              ))}
            </EuiBadgeGroup>
          ),
        },
      ];
      itemIdToExpandedRowMapValues[customer.id] = (
        <EuiDescriptionList listItems={listItems} compressed />
      );
    }

    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const actions = [
    {
      name: 'Edit customer',
      description: 'Edit this customer',
      icon: 'documentEdit',
      type: 'icon',
      isPrimary: true,
      onClick: showEditModal,
    },
    {
      name: 'Delete customer',
      description: 'Delete this customer',
      icon: 'trash',
      type: 'icon',
      isPrimary: true,
      onClick: deleteCustomer,
    },
  ];

  const columns = [
    {
      field: 'name',
      name: 'Customer',
      sortable: true,
      footer: ({ items }) =>
        `${items.length} ${items.length === 1 ? 'customer' : 'customers'}`,
    },
    {
      field: 'creationDate',
      name: 'Creation Date',
      sortable: true,
    },
    {
      field: 'lastModificationDate',
      name: 'Modification Date',
      render: (modificationDate) => modificationDate || 'N/A',
      sortable: true,
    },
    {
      field: 'groups',
      name: 'Groups',
      hideForMobile: true,
      isMobileHeader: true,
    },
    {
      field: 'Actions',
      actions: actions,
    },
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      render: (customer) => (
        <EuiButtonIcon
          onClick={() => toggleCustomerDetails(customer)}
          aria-label={
            itemIdToExpandedRowMap[customer.id] ? 'Collapse' : 'Expand'
          }
          iconType={
            itemIdToExpandedRowMap[customer.id] ? 'arrowUp' : 'arrowDown'
          }
        />
      ),
      isExpander: true,
    },
  ];

  const renderToolsRight = () => (
    <EuiButton
      color="secondary"
      iconType="refresh"
      iconSide="right"
      onClick={refreshList}
    >
      Refresh
    </EuiButton>
  );

  const editCustomerModal = isEditModalVisible ? (
    <ConfirmModal
      title={`Edit Customer ${customerToEdit.name}`}
      content={
        <EditCustomerForm
          customerDetails={editedCustomerDetails}
          setCustomerDetails={setEditedCustomerDetails}
        />
      }
      closeModal={closeEditModal}
      confirmModal={editCustomer}
    />
  ) : null;

  return (
    <Fragment>
      {editCustomerModal}
      <EuiInMemoryTable
        itemId="id"
        items={customersTableItems}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        noItemsMessage="No customers found"
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
              field: 'groups',
              name: 'Group(s)',
              filterWith: 'includes',
              operator: 'exact',
              multiSelect: 'and',
              options: customersGroups.map(({ name, displayColor }) => ({
                name,
                value: name,
                view: <EuiBadge color={displayColor}>{name}</EuiBadge>,
              })),
              noOptionsMessage: 'No groups fround',
            },
          ],
        }}
        sorting
      />
    </Fragment>
  );
};

export default CustomersManagementTab;
