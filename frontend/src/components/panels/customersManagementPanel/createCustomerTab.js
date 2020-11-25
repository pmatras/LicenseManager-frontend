import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';

import {
  EuiButton,
  EuiComboBox,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const CreateCustomerTab = () => {
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    selectedGroups: [],
  });

  useEffect(() => {
    getGroupsList();
  }, []);

  const getGroupsList = () => {
    setIsLoading(true);
    axios
      .get('/api/customers/groups_list')
      .then(({ data }) => {
        if (data.length) {
          setGroupsList(
            data.map(({ id, name, displayColor }) => ({
              id,
              label: name,
              color: displayColor,
            }))
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const onCustomerNameChange = ({ target: { value, name } }) => {
    setCustomerDetails({
      ...customerDetails,
      [name]: value,
    });
  };

  const onSelectedGroupsChange = (selectedGroups) => {
    setCustomerDetails({
      ...customerDetails,
      selectedGroups,
    });
  };

  const createNewCustomer = () => {
    const { customerName, selectedGroups } = customerDetails;
    const payload = {
      name: customerName,
      groups: selectedGroups.map(({ label }) => label),
    };
    axios
      .post('/api/customers/create_customer', payload)
      .then(({ data }) => createSuccessToast('Success', data.message))
      .catch((error) => createDangerToast('Error', error));
  };

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>Customer Name</h3>}
        description={
          <EuiText>
            Select name for newly created customer, note that this name will be
            used for further licenses management
          </EuiText>
        }
      >
        <EuiFormRow label="Customer Name">
          <EuiFieldText
            name="customerName"
            placeholder="Name"
            value={customerDetails.customerName}
            onChange={onCustomerNameChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Customer&apos;s Groups</h3>}
        description={
          <EuiText>
            Select groups, to which new customer will be assigned at once or
            leave blank to make it later. If groups list is long, you can search
            for group by typing text in field. Note that one customer can be
            assigned to multiple groups and groups are distinct for every user.
          </EuiText>
        }
      >
        <EuiFormRow label="Customer's Groups">
          <EuiComboBox
            placeholder="Select groups"
            options={groupsList}
            selectedOptions={customerDetails.selectedGroups}
            onChange={onSelectedGroupsChange}
            isClearable
            isLoading={isLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={createNewCustomer}>
        Create group
      </EuiButton>
    </EuiForm>
  );
};

export default CreateCustomerTab;
