import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../common/axios';

import { EuiComboBox, EuiFieldText, EuiForm, EuiFormRow } from '@elastic/eui';

import { createDangerToast } from '../../common/toastsUtils';

const EditCustomerForm = ({ customerDetails, setCustomerDetails }) => {
  const [availableGroupsList, setAvailableGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGroupsList();
  }, []);

  const getGroupsList = () => {
    setIsLoading(true);
    axios
      .get('/api/customers/groups_list')
      .then(({ data }) => {
        if (data.length) {
          setAvailableGroupsList(
            data.map(({ name, displayColor }) => ({
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

  return (
    <EuiForm component="form">
      <EuiFormRow label="New Name">
        <EuiFieldText
          name="newName"
          placeholder="Name"
          value={customerDetails.newName}
          onChange={onCustomerNameChange}
        />
      </EuiFormRow>
      <EuiFormRow label="Customers Groups">
        <EuiComboBox
          placeholder="Edit customer's groups"
          options={availableGroupsList}
          selectedOptions={customerDetails.selectedGroups}
          onChange={onSelectedGroupsChange}
          isClearable
          isLoading={isLoading}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

EditCustomerForm.propTypes = {
  customerDetails: PropTypes.object.isRequired,
  setCustomerDetails: PropTypes.func.isRequired,
};

export default EditCustomerForm;
