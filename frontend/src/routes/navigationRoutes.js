import { licensesIcon, settingsIcon, securityIcon } from '../assets/icons';
import RolesPanel from '../components/panels/rolesManagementPanel/rolesPanel';
import UsersPanel from '../components/panels/usersManagementPanel/usersPanel';

const LICENSES_NAV_ROUTE = {
  title: 'Licenses',
  icon: licensesIcon,
  route: '/licenses',
  subMenu: [
    {
      title: 'Overview',
      icon: 'visGauge',
      path: '/overview',
    },
    {
      title: 'Management',
      icon: 'gear',
      path: '/management',
    },
    {
      title: 'Customers',
      icon: 'users',
      path: '/customers',
    },
    {
      title: 'Statistics',
      icon: 'stats',
      path: '/statistics',
    },
  ],
};

const SECURITY_NAV_ROUTE = {
  title: 'Security',
  icon: securityIcon,
  route: '/security',
  subMenu: [
    {
      title: 'Users',
      icon: 'users',
      path: '/users',
      component: UsersPanel,
    },
    {
      title: 'Roles',
      icon: 'user',
      path: '/roles',
      component: RolesPanel,
    },
    {
      title: 'Audit logs',
      icon: 'database',
      path: '/audit',
    },
  ],
};

const SETTINGS_NAV_ROUTE = {
  title: 'Settings',
  icon: settingsIcon,
  route: '/settings',
  subMenu: [
    {
      title: 'Alerts Settings',
      icon: 'email',
      path: '/alerts',
    },
    {
      title: 'Application Settings',
      icon: 'gear',
      path: '/application',
    },
  ],
};

const ADMIN_NAV_ROUTES = [
  LICENSES_NAV_ROUTE,
  SECURITY_NAV_ROUTE,
  SETTINGS_NAV_ROUTE,
];

const USER_NAV_ROUTES = [LICENSES_NAV_ROUTE, SETTINGS_NAV_ROUTE];

export { ADMIN_NAV_ROUTES, USER_NAV_ROUTES };
