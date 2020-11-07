import React from 'react';

import LoginForm from '../components/forms/loginForm';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
} from '@elastic/eui';

const LoginPage = () => {
  return (
    <EuiPage>
      <EuiPageBody component="div" style={{ padding: '10%' }}>
        <EuiPageContent verticalPosition="center" horizontalPosition="center">
          <EuiPageContentBody>
            <LoginForm />
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};

export default LoginPage;
