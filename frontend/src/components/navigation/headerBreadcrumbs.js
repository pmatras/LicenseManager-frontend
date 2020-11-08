import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { EuiHeaderBreadcrumbs } from '@elastic/eui';

const HeaderBreadcrumbs = () => {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/');
  pathParts.shift();

  let path = '';

  const breadcrumbs = pathParts.map((pathPart) => {
    path += `/${pathPart}`;
    return {
      text: <Link to={path}>{pathPart}</Link>,
    };
  });

  return <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs} />;
};

export default HeaderBreadcrumbs;
