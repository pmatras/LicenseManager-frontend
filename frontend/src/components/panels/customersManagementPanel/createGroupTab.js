import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';

import {
  EuiButton,
  EuiColorPicker,
  EuiComboBox,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  useColorPickerState,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const CreateGroupTab = () => {
  const [customersList, setCustomersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState({
    groupName: '',
    selectedCustomers: [],
  });
  const [groupColor, setGroupColor, errors] = useColorPickerState('#FFFFFF');

  useEffect(() => {
    getCustomersList();
  }, []);

  const getCustomersList = () => {
    setIsLoading(true);
    axios
      .get('/api/customers/customers_list')
      .then(({ data }) => {
        if (data.length) {
          setCustomersList(
            data.map(({ id, name }) => ({ id, label: name, key: id }))
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const onGroupNameChange = ({ target: { value, name } }) => {
    setGroupDetails({
      ...groupDetails,
      [name]: value,
    });
  };

  const onSelectedCustomersChange = (selectedCustomers) => {
    setGroupDetails({
      ...groupDetails,
      selectedCustomers,
    });
  };

  const createNewGroup = () => {
    const { groupName, selectedCustomers } = groupDetails;
    const payload = {
      name: groupName,
      displayColor: groupColor,
      customersIds: selectedCustomers.map(({ id }) => id),
    };
    axios
      .post('/api/customers/create_group', payload)
      .then(({ data }) => createSuccessToast('Success', data.message))
      .catch((error) => createDangerToast('Error', error));
  };

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>Group Name</h3>}
        description={<EuiText>Select name for newly created group</EuiText>}
      >
        <EuiFormRow label="Group Name">
          <EuiFieldText
            name="groupName"
            placeholder="Name"
            value={groupDetails.groupName}
            onChange={onGroupNameChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Group Color</h3>}
        description={
          <EuiText>
            Select color, which will be associated with this group and used for
            displaying purposes
          </EuiText>
        }
      >
        <EuiFormRow label="Group Color" isInvalid={!!errors} error={errors}>
          <EuiColorPicker
            onChange={setGroupColor}
            color={groupColor}
            isInvalid={!!errors}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Group&apos;s users</h3>}
        description={
          <EuiText>
            Select customers, who will be assigned to new group at once or leave
            blank to make it later. If customers list is long, you can search
            for customer by typing text in field. Note that one customer can be
            assigned to multiple groups and groups are distinct for every user.
          </EuiText>
        }
      >
        <EuiFormRow label="Assigned Customers">
          <EuiComboBox
            placeholder="Select customers"
            options={customersList}
            selectedOptions={groupDetails.selectedCustomers}
            onChange={onSelectedCustomersChange}
            isClearable
            isLoading={isLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={createNewGroup}>
        Create group
      </EuiButton>
    </EuiForm>
  );
};

export default CreateGroupTab;
