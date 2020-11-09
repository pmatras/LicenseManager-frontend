import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { AVAILABLE_THEMES_TO_SELECT } from '../../themes/themes';

import {
  EuiHeaderLogo,
  EuiPopover,
  EuiPopoverTitle,
  EuiSelect,
} from '@elastic/eui';

import {
  toggleSettings,
  selectTheme,
  closeSettings,
} from '../../redux/slices/navigationSlice';

const ThemeSwitcher = ({
  areSettingsOpened,
  closeSettings,
  toggleSettings,
  selectedTheme,
  selectTheme,
}) => {
  const settingsButton = (
    <EuiHeaderLogo iconType="gear" onClick={() => toggleSettings()} />
  );

  return (
    <EuiPopover
      ownFocus
      button={settingsButton}
      isOpen={areSettingsOpened}
      closePopover={closeSettings}
      anchorPosition="downRight"
    >
      <EuiPopoverTitle>Select page theme</EuiPopoverTitle>

      <EuiSelect
        options={AVAILABLE_THEMES_TO_SELECT}
        value={selectedTheme}
        onChange={(e) => {
          selectTheme(e.target.value);
          closeSettings();
        }}
      />
    </EuiPopover>
  );
};

ThemeSwitcher.propTypes = {
  areSettingsOpened: PropTypes.bool.isRequired,
  closeSettings: PropTypes.func.isRequired,
  toggleSettings: PropTypes.func.isRequired,
  selectedTheme: PropTypes.string.isRequired,
  selectTheme: PropTypes.func.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  areSettingsOpened: navigation.areSettingsOpened,
  selectedTheme: navigation.selectedTheme,
});

const mapDispatchToProps = (dispatch) => ({
  closeSettings: () => dispatch(closeSettings()),
  toggleSettings: () => dispatch(toggleSettings()),
  selectTheme: (theme) => dispatch(selectTheme(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher);
