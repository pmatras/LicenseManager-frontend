import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';
import moment from 'moment';

import {
  EuiButton,
  EuiCallOut,
  EuiDatePicker,
  EuiDescribedFormGroup,
  EuiFieldNumber,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const CreateLicenseTab = () => {
  const [customersList, setCustomersList] = useState([]);
  const [isCustomersListLoading, setIsCustomersListLoading] = useState(true);
  const [templatesList, setTemplatesList] = useState([]);
  const [templatesOptionsList, setTemplatesOptionsList] = useState([]);
  const [isTemplatesListLoading, setIsTemplatesListLoading] = useState(true);
  const [licenseDetails, setLicenseDetails] = useState({
    name: '',
    customerId: '',
    expirationDate: moment(),
    templateId: '',
    values: {},
  });

  useEffect(() => {
    getCustomersList();
    getTemplatesList();
  }, []);

  const getCustomersList = () => {
    axios
      .get('/api/customers/customers_list')
      .then(({ data }) => {
        if (data.length) {
          setCustomersList(
            data.map(({ id, name }) => ({ value: id, text: name }))
          );
        }
        setIsCustomersListLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsCustomersListLoading(false);
      });
  };

  const getTemplatesList = () => {
    axios
      .get('/api/templates/list')
      .then(({ data }) => {
        if (data.length) {
          setTemplatesList(data);
          setTemplatesOptionsList(
            data.map(({ id, name }) => ({
              value: id,
              text: name,
            }))
          );
        }
        setIsTemplatesListLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsTemplatesListLoading(false);
      });
  };

  const onDetailsChange = ({ target: { name, value } }) => {
    setLicenseDetails({
      ...licenseDetails,
      [name]: value,
    });
  };

  const onExpirationDateChange = (expirationDate) => {
    setLicenseDetails({
      ...licenseDetails,
      expirationDate,
    });
  };

  const onFieldsValueChange = ({ target: { name, value } }) => {
    setLicenseDetails({
      ...licenseDetails,
      values: {
        ...licenseDetails.values,
        [name]: value,
      },
    });
  };

  const onSwitchChange = ({ target: { checked } }, fieldName) => {
    setLicenseDetails({
      ...licenseDetails,
      values: {
        ...licenseDetails.values,
        [fieldName]: checked,
      },
    });
  };

  const renderFieldsValueSelection = () => {
    const { templateId } = licenseDetails;
    if (templateId === '') {
      return null;
    }

    const { fields, name } = templatesList.find(({ id }) => id == templateId);

    if (!Object.keys(fields).length) {
      return (
        <EuiDescribedFormGroup
          title={<h3>Fields Values</h3>}
          description={
            <EuiText>
              Please enter proper values for fields defined in license template
            </EuiText>
          }
        >
          <EuiCallOut color="danger" size="s">
            {`License template ${name} doesn't have any fields defined`}
          </EuiCallOut>
        </EuiDescribedFormGroup>
      );
    }

    return (
      <EuiDescribedFormGroup
        title={<h3>Fields Values</h3>}
        description={
          <EuiText>
            Please enter proper values for fields defined in license template
          </EuiText>
        }
      >
        {Object.keys(fields)
          .map((key) => ({
            fieldName: key,
            fieldType: fields[key],
          }))
          .map(({ fieldName, fieldType }, index) => {
            let field;
            switch (fieldType) {
              case 'String':
              case 'Character':
                field = (
                  <EuiFormRow label={`${fieldName}: ${fieldType}`} key={index}>
                    <EuiFieldText
                      name={fieldName}
                      placeholder={fieldName}
                      value={licenseDetails.values[fieldName]}
                      onChange={onFieldsValueChange}
                      compressed
                    />
                  </EuiFormRow>
                );
                break;
              case 'Boolean':
                field = (
                  <EuiFormRow label={`${fieldName}: ${fieldType}`} key={index}>
                    <EuiSwitch
                      label={
                        licenseDetails.values[fieldName] ? 'True' : 'False'
                      }
                      name={fieldName}
                      checked={licenseDetails.values[fieldName]}
                      onChange={(e) => onSwitchChange(e, fieldName)}
                      compressed
                    />
                  </EuiFormRow>
                );
                break;
              default:
                field = (
                  <EuiFormRow label={`${fieldName}: ${fieldType}`} key={index}>
                    <EuiFieldNumber
                      name={fieldName}
                      placeholder={fieldName}
                      value={licenseDetails.values[fieldName]}
                      onChange={onFieldsValueChange}
                      compressed
                    />
                  </EuiFormRow>
                );
            }
            return field;
          })}
      </EuiDescribedFormGroup>
    );
  };

  const parseNumericValues = (object) => {
    const parsed = {};
    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (typeof value === 'string' && isFinite(value)) {
        parsed[key] = Number(value);
      } else {
        parsed[key] = value;
      }
    });

    return parsed;
  };

  const generateLicense = () => {
    const details = licenseDetails;
    const { values } = details;
    delete details.values;
    const payload = {
      ...parseNumericValues(details),
      values: {
        ...parseNumericValues(values),
      },
    };

    payload.expirationDate = licenseDetails.expirationDate.format(
      'YYYY-MM-DD HH:mm'
    );

    axios
      .post('/api/licenses/create', payload)
      .then(({ data }) => createSuccessToast('Success', data.message))
      .catch((error) => createDangerToast('Error', error));
  };

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>License Name</h3>}
        description={<EuiText>Select name for newly created license</EuiText>}
      >
        <EuiFormRow label="License Name">
          <EuiFieldText
            name="name"
            placeholder="License"
            value={licenseDetails.name}
            onChange={onDetailsChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Customer</h3>}
        description={
          <EuiText>
            Select customer for which license is being generated
          </EuiText>
        }
      >
        <EuiFormRow label="Customer">
          <EuiSelect
            name="customerId"
            hasNoInitialSelection
            options={customersList}
            value={licenseDetails.customerId}
            onChange={onDetailsChange}
            isLoading={isCustomersListLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Expiration Date</h3>}
        description={
          <EuiText>
            Select exact expiration date with time of generated license
          </EuiText>
        }
      >
        <EuiFormRow label="Expiration Date">
          <EuiDatePicker
            selected={licenseDetails.expirationDate}
            showTimeSelect
            onChange={onExpirationDateChange}
            dateFormat="YYYY-MM-DD HH:mm"
            timeFormat="HH:mm"
            minDate={moment()}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>License Template</h3>}
        description={
          <EuiText>
            Please select license template to use for this license generation
          </EuiText>
        }
      >
        <EuiFormRow label="License Template">
          <EuiSelect
            name="templateId"
            hasNoInitialSelection
            options={templatesOptionsList}
            value={licenseDetails.templateId}
            onChange={onDetailsChange}
            isLoading={isTemplatesListLoading}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      {renderFieldsValueSelection()}
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={generateLicense}>
        Generate License
      </EuiButton>
    </EuiForm>
  );
};

export default CreateLicenseTab;
