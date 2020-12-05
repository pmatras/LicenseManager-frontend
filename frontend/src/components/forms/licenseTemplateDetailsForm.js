import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../common/axios';

import {
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiTextArea,
  EuiToolTip,
} from '@elastic/eui';

import { createDangerToast } from '../../common/toastsUtils';

const LicenseTemplateDetailsForm = ({ templateDetails }) => {
  const { id } = templateDetails;
  const [isPublicKeyVisible, setIsPublicKeyVisible] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    getTemplatePublicKey();
  }, []);

  const getTemplatePublicKey = () => {
    axios
      .get(`/api/templates/public_key?template_id=${id}`)
      .then(({ data }) => setPublicKey(data.publicKey))
      .catch((error) => createDangerToast('Error', error));
  };

  const togglePublicKey = () => {
    setIsPublicKeyVisible(!isPublicKeyVisible);
  };

  return (
    <EuiForm component="form">
      <EuiFormRow
        fullWidth
        label={
          <EuiToolTip
            content={`Encoded License Template's Public Key can be used to transform it back into Public Key and should be used in your product's code to check if license file hasn't been changed 
            by unathorized people in conjuction with license key entered by customer. It's also usefull for generating key for decrypting license file's content generated from this template.`}
            position="bottom"
          >
            <span>
              Encoded Public Key <EuiIcon type="iInCircle" color="subdued" />
            </span>
          </EuiToolTip>
        }
        labelAppend={
          <EuiFlexGroup
            gutterSize="s"
            alignItems="center"
            justifyContent="flexEnd"
          >
            <EuiFlexItem grow={false}>
              <EuiCopy
                textToCopy={publicKey}
                afterMessage="Encoded Public Key copied"
              >
                {(copy) => (
                  <EuiButtonIcon
                    isDisabled={!isPublicKeyVisible}
                    iconType="copyClipboard"
                    onClick={copy}
                  />
                )}
              </EuiCopy>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                iconType={isPublicKeyVisible ? 'eyeClosed' : 'eye'}
                onClick={togglePublicKey}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        }
      >
        <EuiTextArea
          fullWidth
          readOnly
          value={isPublicKeyVisible ? publicKey : ''}
        />
      </EuiFormRow>
    </EuiForm>
  );
};

LicenseTemplateDetailsForm.propTypes = {
  templateDetails: PropTypes.object.isRequired,
};

export default LicenseTemplateDetailsForm;
