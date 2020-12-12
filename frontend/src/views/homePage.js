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
import EditUserAccountPanel from '../components/panels/editUserAccountPanel/editUserAccountPanel';

const HomePage = ({ userRoles, pageTitle }) => {
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
                <h1>{pageTitle}</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
            <EuiPageHeaderSection></EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection></EuiPageContentHeaderSection>
              <EuiPageContentHeaderSection></EuiPageContentHeaderSection>
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
  return [
    ...navigationRoutes.flatMap(({ route, subMenu }) =>
      subMenu.map(({ path, component: Component }) => (
        <Route key={id++} path={`${route}${path}`}>
          {Component ? (
            <Component />
          ) : (
            <div>Content for path: {`${route}${path}`}</div>
          )}
        </Route>
      ))
    ),
    <Route key={id} path="/account/settings">
      <EditUserAccountPanel />
    </Route>,
  ];
};

HomePage.propTypes = {
  userRoles: PropTypes.array.isRequired,
  pageTitle: PropTypes.string.isRequired,
};

const mapStateToProps = ({ authentication: { user }, navigation }) => ({
  userRoles: user.roles,
  pageTitle: navigation.pageTitle,
});

export default connect(mapStateToProps)(HomePage);
