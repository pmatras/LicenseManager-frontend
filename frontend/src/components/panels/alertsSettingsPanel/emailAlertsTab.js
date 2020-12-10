import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';
import moment from 'moment';

import {
  EuiButton,
  EuiDatePicker,
  EuiDescribedFormGroup,
  EuiFieldNumber,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const EmailAlertsTab = () => {
  const [emailAlertsSettings, setEmailAlertsSettings] = useState({});

  useEffect(() => {
    getEmailAlertsSettings();
  }, []);

  const getEmailAlertsSettings = () => {
    axios
      .get('/api/alerts/email_settings')
      .then(({ data }) => {
        const activeHoursFrom = data.activeHoursFrom
          ? moment(data.activeHoursFrom, 'HH:mm')
          : moment().hours(0).minutes(0);
        const activeHoursTo = data.activeHoursTo
          ? moment(data.activeHoursTo, 'HH:mm')
          : moment().hours(23).minutes(59);
        setEmailAlertsSettings({
          ...data,
          activeHoursFrom,
          activeHoursTo,
        });
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const settingsHandler = ({ target: { name, value } }) => {
    setEmailAlertsSettings({
      ...emailAlertsSettings,
      [name]: value,
    });
  };

  const onTimeChange = (selectedTime, type = 'activeHoursFrom') => {
    setEmailAlertsSettings({
      ...emailAlertsSettings,
      [type]: selectedTime,
    });
  };

  const saveEmailAlertsSettings = () => {
    const { threshold, activeHoursFrom, activeHoursTo } = emailAlertsSettings;
    const payload = {
      threshold: Number(threshold),
      activeHoursFrom: activeHoursFrom.format('HH:mm'),
      activeHoursTo: activeHoursTo.format('HH:mm'),
    };

    axios
      .put('/api/alerts/email_settings', payload)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        getEmailAlertsSettings();
      })
      .catch((error) => createDangerToast('Error', error));
  };

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>Threshold in days</h3>}
        description={
          <EuiText>
            Define threshold in days determining days left to license expiration
            date, which will trigger alert sending
          </EuiText>
        }
      >
        <EuiFormRow label="Threshold">
          <EuiFieldNumber
            name="threshold"
            placeholder="14"
            value={emailAlertsSettings.threshold}
            onChange={settingsHandler}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Time range of enabled email alerts</h3>}
        description={
          <EuiText>
            Define time range within you want to receive email alerts
          </EuiText>
        }
      >
        <EuiFormRow label="Active hours from">
          <EuiDatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={emailAlertsSettings.activeHoursFrom}
            onChange={(selectedTime) => onTimeChange(selectedTime)}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </EuiFormRow>
        <EuiFormRow label="Active hours to">
          <EuiDatePicker
            showTimeSelect
            showTimeSelectOnly
            selected={emailAlertsSettings.activeHoursTo}
            onChange={(selectedTime) =>
              onTimeChange(selectedTime, 'activeHoursTo')
            }
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={saveEmailAlertsSettings}>
        Save
      </EuiButton>
    </EuiForm>
  );
};

export default EmailAlertsTab;
