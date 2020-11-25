import React from 'react';
import PropTypes from 'prop-types';

import {
  EuiColorPicker,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  useColorPickerState,
} from '@elastic/eui';

const EditGroupForm = ({ groupDetails, setGroupDetails }) => {
  const [groupColor, setGroupColor, errors] = useColorPickerState(
    groupDetails.newDisplayColor
  );

  const onGroupNameChange = ({ target: { value, name } }) => {
    setGroupDetails({
      ...groupDetails,
      [name]: value,
    });
  };

  const onGroupColorChange = (color, valid) => {
    setGroupColor(color, valid);
    setGroupDetails({
      ...groupDetails,
      newDisplayColor: color,
    });
  };

  return (
    <EuiForm component="form">
      <EuiFormRow label="New Name">
        <EuiFieldText
          name="newName"
          placeholder="Name"
          value={groupDetails.newName}
          onChange={onGroupNameChange}
        />
      </EuiFormRow>
      <EuiFormRow label="New Color" isInvalid={!!errors} error={errors}>
        <EuiColorPicker
          onChange={onGroupColorChange}
          color={groupColor}
          isInvalid={!!errors}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

EditGroupForm.propTypes = {
  groupDetails: PropTypes.object.isRequired,
  setGroupDetails: PropTypes.func.isRequired,
};

export default EditGroupForm;
