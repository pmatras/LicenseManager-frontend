import React from 'react';

import { EuiLoadingSpinner } from '@elastic/eui';

const LoadingPage = () => {
  return (
    <EuiLoadingSpinner
      size="xl"
      style={{ top: '50%', left: '50%', position: 'fixed' }}
    />
  );
};

export default LoadingPage;
