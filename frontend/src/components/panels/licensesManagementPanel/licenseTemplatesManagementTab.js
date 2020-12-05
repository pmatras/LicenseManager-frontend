import React, { Fragment, useEffect, useState } from 'react';
import axios from '../../../common/axios';

import {
  EuiButton,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiText,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';

import {
  createDangerToast,
  createSuccessToast,
} from '../../../common/toastsUtils';

import DetailsModal from '../../modals/detailsModal';
import LicenseTemplateDetailsForm from '../../forms/licenseTemplateDetailsForm';

const LicenseTemplatesManagementTab = () => {
  const [licenseTemplatesList, setLicenseTemplatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
  const [templateDetails, setTemplateDetails] = useState({});
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  useEffect(() => {
    getLicenseTemplatesList();
  }, []);

  const getLicenseTemplatesList = () => {
    setIsLoading(true);
    axios
      .get('/api/templates/list')
      .then(({ data }) => {
        if (data.length) {
          setLicenseTemplatesList(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const refreshList = () => {
    getLicenseTemplatesList();
    setItemIdToExpandedRowMap({});
  };

  const deleteLicenseTemplate = ({ id }) => {
    axios
      .delete(`/api/templates/delete?template_id=${id}`)
      .then(({ data }) => {
        createSuccessToast('Success', data.message);
        refreshList();
      })
      .catch((error) => createDangerToast('Error', error));
  };

  const toggleLicenseTemplateFields = ({ id, fields }) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
    if (itemIdToExpandedRowMapValues[id]) {
      delete itemIdToExpandedRowMapValues[id];
    } else {
      const listItems = [
        {
          title: 'Fields',
          description: (
            <EuiFlexGroup direction="column" gutterSize="s">
              {Object.keys(fields).map((key, index) => (
                <EuiFlexItem grow={false} key={index}>
                  <EuiText size="s" color="danger">
                    <b>{`${key}: ${fields[key]}`}</b>
                  </EuiText>
                </EuiFlexItem>
              ))}
            </EuiFlexGroup>
          ),
        },
      ];
      itemIdToExpandedRowMapValues[id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }

    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  const showTemplateDetails = (template) => {
    setTemplateDetails(template);
    setIsDetailsModalVisible(true);
  };

  const closeTemplateDetails = () => {
    setTemplateDetails({});
    setIsDetailsModalVisible(false);
  };

  const actions = [
    {
      name: 'Delete template',
      description: 'Delete this license template',
      icon: 'trash',
      type: 'icon',
      onClick: deleteLicenseTemplate,
    },
    {
      name: 'Show details',
      description: `Show template's public key details`,
      icon: 'document',
      type: 'icon',
      onClick: showTemplateDetails,
    },
  ];

  const columns = [
    {
      field: 'name',
      name: 'Template',
      sortable: true,
      footer: ({ items }) =>
        `${items.length} ${
          items.length === 1 ? 'license template' : 'license templates'
        }`,
    },
    {
      field: 'creationTime',
      name: 'Creation Time',
      sortable: true,
    },
    {
      field: 'editionTime',
      name: 'Edition Time',
      sortable: true,
      render: (editionTime) => editionTime || 'N/A',
    },
    {
      name: 'Actions',
      actions,
    },
    {
      align: RIGHT_ALIGNMENT,
      width: '40px',
      render: (template) => (
        <EuiButtonIcon
          onClick={() => toggleLicenseTemplateFields(template)}
          aria-label={
            itemIdToExpandedRowMap[template.id] ? 'Collapse' : 'Expand'
          }
          iconType={
            itemIdToExpandedRowMap[template.id] ? 'arrowUp' : 'arrowDown'
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

  const templateDetailsModal = isDetailsModalVisible ? (
    <DetailsModal
      title={`License template ${templateDetails?.name}'s details`}
      content={<LicenseTemplateDetailsForm templateDetails={templateDetails} />}
      closeModal={closeTemplateDetails}
    />
  ) : null;

  return (
    <Fragment>
      {templateDetailsModal}
      <EuiInMemoryTable
        itemId="id"
        items={licenseTemplatesList}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        noItemsMessage="No license templates found"
        columns={columns}
        loading={isLoading}
        pagination
        search={{
          toolsRight: renderToolsRight(),
          box: {
            incremental: true,
          },
        }}
        sorting
      />
    </Fragment>
  );
};

export default LicenseTemplatesManagementTab;
