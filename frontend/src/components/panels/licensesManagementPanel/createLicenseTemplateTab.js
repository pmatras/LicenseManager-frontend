import React, { useEffect, useState } from 'react';
import axios from '../../../common/axios';

import {
  EuiBasicTable,
  EuiButton,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

const CreateLicenseTemplateTab = () => {
  const [supportedFieldTypes, setSupportedFieldTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [fieldDetails, setFieldDetails] = useState({
    fieldName: '',
    fieldType: '',
  });
  const [declaredFields, setDeclaredFields] = useState([]);

  useEffect(() => {
    getSupportedFieldTypes();
  }, []);

  const getSupportedFieldTypes = () => {
    axios
      .get('/api/templates/supported_types')
      .then(({ data }) => {
        if (data.length) {
          setSupportedFieldTypes(
            data.map((type) => ({ value: type, text: type }))
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const onTemplateNameChange = ({ target: { value } }) => {
    setTemplateName(value);
  };

  const onFieldDetailsChange = ({ target: { value, name } }) => {
    setFieldDetails({
      ...fieldDetails,
      [name]: value,
    });
  };

  const addNewField = () => {
    const { fieldName, fieldType } = fieldDetails;
    declaredFields.some(({ fieldName: name }) => name === fieldName)
      ? createDangerToast(
          'Error',
          new Error(`${fieldName} field is already declared`)
        )
      : setDeclaredFields([...declaredFields, { fieldName, fieldType }]);
  };

  const deleteField = ({ fieldName }) => {
    setDeclaredFields(
      declaredFields.filter(({ fieldName: name }) => name !== fieldName)
    );
  };

  const createNewTemplate = () => {
    const payload = {
      name: templateName,
      fields: declaredFields.reduce(
        (fields, { fieldName, fieldType }) => ({
          ...fields,
          [fieldName]: fieldType,
        }),
        {}
      ),
    };

    axios
      .post('/api/templates/create', payload)
      .then(({ data }) => createSuccessToast('Success', data.message))
      .catch((error) => createDangerToast('Error', error));
  };

  const actions = [
    {
      name: 'Delete field',
      icon: 'trash',
      type: 'icon',
      onClick: deleteField,
    },
  ];

  const columns = [
    {
      field: 'fieldName',
      name: 'Field Name',
    },
    {
      field: 'fieldType',
      name: 'Field Type',
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  return (
    <EuiForm component="form">
      <EuiDescribedFormGroup
        title={<h3>Template Name</h3>}
        description={
          <EuiText>Select name for newly created license template</EuiText>
        }
      >
        <EuiFormRow label="Template Name">
          <EuiFieldText
            name="name"
            placeholder="Name"
            value={templateName}
            onChange={onTemplateNameChange}
          />
        </EuiFormRow>
      </EuiDescribedFormGroup>
      <EuiDescribedFormGroup
        title={<h3>Template Fields</h3>}
        description={
          <EuiText>
            Select name for each template field with its type from supported
            ones
          </EuiText>
        }
      >
        <EuiFormRow label="Template Name">
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow>
              <EuiFieldText
                name="fieldName"
                placeholder="Field Name"
                value={fieldDetails.fieldName}
                onChange={onFieldDetailsChange}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSelect
                name="fieldType"
                hasNoInitialSelection
                options={supportedFieldTypes}
                value={fieldDetails.fieldType}
                onChange={onFieldDetailsChange}
                isLoading={isLoading}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                iconSide="right"
                iconType="plusInCircle"
                onClick={addNewField}
              >
                Add Field
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>
        <EuiSpacer size="l" />
        <EuiBasicTable
          items={declaredFields}
          noItemsMessage="No fields specified"
          columns={columns}
        />
      </EuiDescribedFormGroup>
      <EuiSpacer size="xl" />
      <EuiButton fill onClick={createNewTemplate}>
        Create License Template
      </EuiButton>
    </EuiForm>
  );
};

export default CreateLicenseTemplateTab;
