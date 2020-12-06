import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from '../../common/axios';

import {
  EuiButtonIcon,
  EuiCallOut,
  EuiCopy,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiTextArea,
  EuiToolTip,
} from '@elastic/eui';

import { createDangerToast } from '../../common/toastsUtils';

const LicenseDetailsForm = ({ licenseDetails }) => {
  const { id, licenseKey } = licenseDetails;
  const [isLicenseKeyVisible, setIsLicenseKeyVisible] = useState(false);
  const [licenseFile, setLicenseFile] = useState({});
  const [isLicenseFileVisible, setIsLicenseFileVisible] = useState(false);

  useEffect(() => {
    getDecryptedLicenseContent();
  }, []);

  const getDecryptedLicenseContent = () => {
    axios
      .get(`/api/licenses/decrypted_content?license_id=${id}`)
      .then(({ data }) => setLicenseFile(data))
      .catch((error) => createDangerToast('Error', error));
  };

  const toggleLicenseKey = () => {
    setIsLicenseKeyVisible(!isLicenseKeyVisible);
  };

  const toggleLicenseFileContent = () => {
    setIsLicenseFileVisible(!isLicenseFileVisible);
  };

  return (
    <EuiForm component="form">
      <EuiFormRow
        fullWidth
        label={
          <EuiToolTip
            content={`License Key should be given to customer alongside with license file. 
              Note that license key is unique and closely linked to a specific license file. 
              Alongside with license template's public key it allows to check in secure way if license file hasn't been changed by unathorized people.
               Public key is also usefull for license decrypting purposes.`}
            position="bottom"
          >
            <span>
              License Key <EuiIcon type="iInCircle" color="subdued" />
            </span>
          </EuiToolTip>
        }
      >
        <EuiFieldText
          fullWidth
          readOnly
          value={isLicenseKeyVisible ? licenseKey : ''}
          prepend={
            <EuiCopy textToCopy={licenseKey} afterMessage="License Key copied">
              {(copy) => (
                <EuiButtonIcon
                  isDisabled={!isLicenseKeyVisible}
                  iconType="copyClipboard"
                  onClick={copy}
                />
              )}
            </EuiCopy>
          }
          append={
            <EuiButtonIcon
              iconType={isLicenseKeyVisible ? 'eyeClosed' : 'eye'}
              onClick={toggleLicenseKey}
            />
          }
        />
      </EuiFormRow>
      <EuiFormRow
        fullWidth
        label={
          <EuiToolTip
            content={
              'This is content of encrypted license file - usefull for developers'
            }
            position="bottom"
          >
            <span>
              Decrypted License File
              <EuiIcon type="iInCircle" color="subdued" />
            </span>
          </EuiToolTip>
        }
        labelAppend={
          <EuiButtonIcon
            iconType={isLicenseFileVisible ? 'eyeClosed' : 'eye'}
            onClick={toggleLicenseFileContent}
          />
        }
      >
        <EuiFlexGroup direction="column">
          {isLicenseFileVisible && (
            <EuiFlexItem>
              <EuiCallOut
                heading="h6"
                title={
                  licenseFile.verified
                    ? 'License content successfully verified'
                    : `License content isn't verified`
                }
                color={licenseFile.verified ? 'success' : 'danger'}
                size="s"
              >
                {licenseFile.verified
                  ? `You can be sure that license file's content hasn't been changed since license generation`
                  : `License file's content hasn't been verified successfully - somebody unauthorized changed its content since license generation. Be aware of it.`}
              </EuiCallOut>
            </EuiFlexItem>
          )}

          <EuiFlexItem>
            <EuiTextArea
              fullWidth
              readOnly
              value={
                isLicenseFileVisible
                  ? JSON.stringify(JSON.parse(licenseFile.fileContent), null, 2)
                  : ''
              }
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    </EuiForm>
  );
};

LicenseDetailsForm.propTypes = {
  licenseDetails: PropTypes.object.isRequired,
};

export default LicenseDetailsForm;
