import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  EuiCollapsibleNav,
  EuiCollapsibleNavGroup,
  EuiListGroup,
  EuiListGroupItem,
  EuiShowFor,
  EuiText,
} from '@elastic/eui';

import { closeMenu, toggleMenuDock } from '../../redux/slices/navigationSlice';

import {
  ADMIN_NAV_ROUTES,
  USER_NAV_ROUTES,
} from '../../routes/navigationRoutes';

const CollapsibleSideNav = ({
  userRoles,
  isMenuOpened,
  closeMenu,
  isMenuDocked,
  toggleMenuDock,
}) => {
  const renderNavigation = () => {
    return userRoles.includes('ADMIN')
      ? renderNavigationItems(ADMIN_NAV_ROUTES)
      : renderNavigationItems(USER_NAV_ROUTES);
  };

  return (
    <EuiCollapsibleNav
      isOpen={isMenuOpened}
      isDocked={isMenuDocked}
      onClose={closeMenu}
    >
      {renderNavigation()}
      <EuiShowFor sizes={['l', 'xl']}>
        <EuiCollapsibleNavGroup>
          <EuiListGroupItem
            className="eui-yScroll"
            size="xs"
            color="subdued"
            label={`${isMenuDocked ? 'Undock' : 'Dock'} navigation`}
            onClick={() => {
              toggleMenuDock();
            }}
            iconType={isMenuDocked ? 'lock' : 'lockOpen'}
          />
        </EuiCollapsibleNavGroup>
      </EuiShowFor>
    </EuiCollapsibleNav>
  );
};

const renderNavigationItems = (navigationRoutes) =>
  navigationRoutes.map(({ title, icon, route, subMenu }, index) => (
    <EuiCollapsibleNavGroup
      key={index}
      iconType={icon}
      paddingSize="xs"
      iconSize="xl"
      title={<EuiText>{title}</EuiText>}
      isCollapsible={subMenu.length !== 0}
    >
      <EuiListGroup gutterSize="s" size="l">
        {subMenu.map(({ title, icon, path }, index) => (
          <EuiListGroupItem
            key={index}
            color="text"
            label={<Link to={`${route}${path}`}>{title}</Link>}
            iconType={icon}
            href={`${route}${path}`}
          />
        ))}
      </EuiListGroup>
    </EuiCollapsibleNavGroup>
  ));

CollapsibleSideNav.propTypes = {
  userRoles: PropTypes.array.isRequired,
  isMenuOpened: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  isMenuDocked: PropTypes.bool.isRequired,
  toggleMenuDock: PropTypes.func.isRequired,
};

const mapStateToProps = ({ navigation, authentication: { user } }) => ({
  userRoles: user.roles,
  isMenuOpened: navigation.isMenuOpened,
  isMenuDocked: navigation.isMenuDocked,
});

const mapDispatchToProps = (dispatch) => ({
  closeMenu: () => dispatch(closeMenu()),
  toggleMenuDock: () => dispatch(toggleMenuDock()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollapsibleSideNav);
