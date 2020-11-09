import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  EuiHeaderSectionItemButton,
  EuiAvatar,
  EuiPopover,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiButtonEmpty,
} from '@elastic/eui';

import { logoutUser } from '../../redux/slices/authenticationSlice';
import {
  closeUserMenu,
  toggleUserMenu,
} from '../../redux/slices/navigationSlice';

const UserMenu = ({
  username,
  firstName,
  lastName,
  isLogoutInProgress,
  logoutUser,
  isUserMenuOpened,
  toggleUserMenu,
  closeUserMenu,
}) => {
  const userMenuButton = (
    <EuiHeaderSectionItemButton
      aria-expanded={isUserMenuOpened}
      aria-haspopup="true"
      aria-label="Account menu"
      onClick={toggleUserMenu}
    >
      <EuiAvatar name={`${firstName} ${lastName}`} size="m" />
    </EuiHeaderSectionItemButton>
  );

  return (
    <EuiPopover
      ownFocus
      button={userMenuButton}
      isOpen={isUserMenuOpened}
      anchorPosition="downRight"
      closePopover={closeUserMenu}
      panelPaddingSize="none"
    >
      <EuiFlexGroup
        gutterSize="m"
        className="euiHeaderProfile"
        responsive={false}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <EuiFlexItem grow={false}>
          <EuiAvatar name={`${firstName} ${lastName}`} size="xl" />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText color="default">
            <b>{`${firstName} ${lastName}`}</b>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText>
            <b>@{username}</b>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiButtonEmpty
                size="m"
                flush="left"
                iconSide="left"
                iconType="documentEdit"
                onClick={(e) => e.preventDefault()}
              >
                <Link to="user/settings"> Edit profile</Link>
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                size="m"
                flush="right"
                iconSide="right"
                iconType="push"
                type="submit"
                isLoading={isLogoutInProgress}
                onClick={() => {
                  logoutUser();
                  closeUserMenu();
                }}
              >
                <Link to="/logout">Logout</Link>
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPopover>
  );
};

UserMenu.propTypes = {
  username: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  isLogoutInProgress: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
  isUserMenuOpened: PropTypes.bool.isRequired,
  toggleUserMenu: PropTypes.func.isRequired,
  closeUserMenu: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  authentication: { user, isLogoutInProgress },
  navigation,
}) => ({
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  isUserMenuOpened: navigation.isUserMenuOpened,
  isLogoutInProgress,
});

const mapDispatchToProps = (dispatch) => ({
  toggleUserMenu: () => dispatch(toggleUserMenu()),
  closeUserMenu: () => dispatch(closeUserMenu()),
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
