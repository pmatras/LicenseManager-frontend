import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
} from '@elastic/eui';

import icon from '../../icon.svg';
import { toggleMenu } from '../../redux/slices/navigationSlice';

const HeaderNavigation = ({ isMenuOpened, isMenuDocked, toggleMenu }) => {
  const padding = { paddingRight: '10px', paddingLeft: '10px' };

  return (
    <EuiHeader position="fixed">
      <EuiHeaderSection side="left" grow={false}>
        {!isMenuDocked && (
          <EuiHeaderSectionItem border="right" style={padding}>
            <EuiHeaderLogo
              iconType={isMenuOpened ? 'menuLeft' : 'menu'}
              onClick={() => toggleMenu()}
            />
          </EuiHeaderSectionItem>
        )}
        <EuiHeaderSectionItem border="right" style={padding}>
          <EuiHeaderLogo iconType={icon} onClick={(e) => e.preventDefault()}>
            <Link to="/home">License Manager</Link>
          </EuiHeaderLogo>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection side="right" grow={false}>
        <EuiHeaderSectionItem border="left" style={padding}>
          <EuiHeaderLogo iconType="gear" onClick={(e) => e.preventDefault()} />
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </EuiHeader>
  );
};

HeaderNavigation.propTypes = {
  isMenuOpened: PropTypes.bool.isRequired,
  isMenuDocked: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  isMenuOpened: navigation.isMenuOpened,
  isMenuDocked: navigation.isMenuDocked,
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch(toggleMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNavigation);
