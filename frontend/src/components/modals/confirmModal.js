import React from 'react';
import PropTypes from 'prop-types';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';

const ConfirmModal = ({ title, content, closeModal, confirmModal }) => {
  return (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>{content}</EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty
            onClick={closeModal}
            iconType="cross"
            iconSide="right"
          >
            Cancel
          </EuiButtonEmpty>
          <EuiButton
            onClick={confirmModal}
            fill
            iconType="check"
            iconSide="right"
          >
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

ConfirmModal.propTypes = {
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmModal: PropTypes.func.isRequired,
};

export default ConfirmModal;
