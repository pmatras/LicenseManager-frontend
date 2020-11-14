import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

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
import ToastList from '../components/navigation/toastList';
import { ADMIN_NAV_ROUTES, USER_NAV_ROUTES } from '../routes/navigationRoutes';

const HomePage = ({ userRoles }) => {
  const renderNestedRoutes = () => {
    return userRoles.includes('ADMIN')
      ? renderRoutes(ADMIN_NAV_ROUTES)
      : renderRoutes(USER_NAV_ROUTES);
  };

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
            <EuiPageContentBody>
              <Switch>{renderNestedRoutes()}</Switch>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
      <ToastList />
    </Fragment>
  );
};

const renderRoutes = (navigationRoutes) => {
  let id = 0;
  return navigationRoutes.flatMap(({ route, subMenu }) =>
    subMenu.map(({ path, component: Component }) => (
      <Route key={id++} path={`${route}${path}`}>
        {Component ? (
          <Component />
        ) : (
          <div>Content for path: {`${route}${path}`}</div>
        )}
      </Route>
    ))
  );
};

HomePage.propTypes = {
  userRoles: PropTypes.array.isRequired,
};

const mapStateToProps = ({ authentication: { user } }) => ({
  userRoles: user.roles,
});

export default connect(mapStateToProps)(HomePage);
