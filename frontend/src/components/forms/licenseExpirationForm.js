import { EuiDatePicker, EuiForm, EuiFormRow } from '@elastic/eui';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const LicenseExpirationForm = ({ expirationDate, setExpirationDate }) => {
  return (
    <EuiForm component="form">
      <EuiFormRow label="Expiration Date" fullWidth>
        <EuiDatePicker
          fullWidth
          inline
          selected={expirationDate}
          showTimeSelect
          onChange={setExpirationDate}
          dateFormat="YYYY-MM-DD HH:mm"
          timeFormat="HH:mm"
          minDate={moment()}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

LicenseExpirationForm.propTypes = {
  expirationDate: PropTypes.object.isRequired,
  setExpirationDate: PropTypes.func.isRequired,
};

export default LicenseExpirationForm;
