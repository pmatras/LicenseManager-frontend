import React, { Fragment } from 'react';

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
import HeaderNavigation from '../components/navigation/headerNavigation';
import CollapsibleSideNav from '../components/navigation/collapsibleSideNav';

const HomePage = () => {
  return (
    <Fragment>
      <HeaderNavigation />
      <CollapsibleSideNav />
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
            <EuiPageContentBody></EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </Fragment>
  );
};

export default HomePage;
