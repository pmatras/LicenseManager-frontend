import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { EuiGlobalToastList } from '@elastic/eui';

import { removeToast } from '../../redux/slices/navigationSlice';

const ToastList = ({ toasts, removeToast }) => {
  return (
    <EuiGlobalToastList
      toasts={toasts}
      dismissToast={removeToast}
      toastLifeTimeMs={5000}
    />
  );
};

ToastList.propTypes = {
  toasts: PropTypes.array.isRequired,
  removeToast: PropTypes.func.isRequired,
};

const mapStateToProps = ({ navigation: { toastsList } }) => ({
  toasts: toastsList,
});

const mapDispatchToProps = (dispatch) => ({
  removeToast: ({ id }) => dispatch(removeToast(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToastList);
