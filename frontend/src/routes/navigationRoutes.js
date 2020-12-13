import { licensesIcon, settingsIcon, securityIcon } from '../assets/icons';
import AlertsPanel from '../components/panels/alertsSettingsPanel/alertsPanel';
import AuditLogsPanel from '../components/panels/auditLogsPanel/auditLogsPanel';
import CustomersPanel from '../components/panels/customersManagementPanel/customersPanel';
import LicensesPanel from '../components/panels/licensesManagementPanel/licensesPanel';
import LicensesOverviewPanel from '../components/panels/licensesOverviewPanel/licensesOverviewPanel';
import LicensesStatisticsPanel from '../components/panels/licensesStatisticsPanel.js/licensesStatisticsPanel';
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
      component: LicensesOverviewPanel,
    },
    {
      title: 'Management',
      icon: 'gear',
      path: '/management',
      component: LicensesPanel,
    },
    {
      title: 'Customers',
      icon: 'users',
      path: '/customers',
      component: CustomersPanel,
    },
    {
      title: 'Statistics',
      icon: 'stats',
      path: '/statistics',
      component: LicensesStatisticsPanel,
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
      component: AuditLogsPanel,
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
      component: AlertsPanel,
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
