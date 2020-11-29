import React, { useEffect, useState } from 'react';
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

const LicenseTemplatesManagementTab = () => {
  const [licenseTemplatesList, setLicenseTemplatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});

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

  const actions = [
    {
      name: 'Delete template',
      description: 'Delete this license template',
      icon: 'trash',
      type: 'icon',
      onClick: deleteLicenseTemplate,
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

  return (
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
  );
};

export default LicenseTemplatesManagementTab;
