import React from 'react';
import PropTypes from 'prop-types';

import {
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';

const DetailsModal = ({ title, content, closeModal }) => {
  return (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal} style={{ width: '50vw' }}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>{content}</EuiModalBody>
        <EuiModalFooter>
          <EuiButton fill onClick={closeModal}>
            Close
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

DetailsModal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default DetailsModal;
