import React from 'react';

import {
  EuiPage,
  EuiPageHeaderSection,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiPageHeader,
} from '@elastic/eui';

const HomePage = () => {
  return (
    <EuiPage style={{ height: '100vh' }} restrictWidth>
      <EuiPageBody component="div">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="m">
              <h1>Page title</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>Page abilities</EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent style={{ height: '100vh', width: '100%' }}>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle>
                <h2>Content title</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
            <EuiPageContentHeaderSection>
              Content abilities
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <div>Content</div>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};

export default HomePage;
