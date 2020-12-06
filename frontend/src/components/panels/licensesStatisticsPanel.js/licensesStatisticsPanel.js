import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from '../../../common/axios';
import { orderBy } from 'lodash';

import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiStat,
  EuiTitle,
} from '@elastic/eui';
import { Chart, Partition } from '@elastic/charts';
import {
  EUI_CHARTS_THEME_DARK,
  EUI_CHARTS_THEME_LIGHT,
} from '@elastic/eui/dist/eui_charts_theme';

import { createDangerToast } from '../../../common/toastsUtils';
import LoadingPage from '../../../views/loadingPage';
import CategoricalChart from './categoricalChart';

const LicensesStatisticsPanel = ({ selectedTheme }) => {
  const [licensesStats, setLicensesStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLicensesStats();
  }, []);

  const getLicensesStats = () => {
    setIsLoading(true);
    axios
      .get('/api/licenses/stats')
      .then(({ data }) => {
        setLicensesStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        createDangerToast('Error', error);
        setIsLoading(false);
      });
  };

  const getCountByCustomers = (stats) => {
    return Object.keys(stats.byCustomers).map((key) => ({
      customer: key,
      count: stats.byCustomers[key],
    }));
  };

  const getCountByTemplates = (stats) => {
    return Object.keys(stats.byTemplates).map((key) => ({
      template: key,
      count: stats.byTemplates[key],
    }));
  };

  const euiChartTheme = selectedTheme.includes('dark')
    ? EUI_CHARTS_THEME_DARK
    : EUI_CHARTS_THEME_LIGHT;
  const euiPartitionConfig = euiChartTheme.partition;

  return isLoading ? (
    <LoadingPage />
  ) : (
    <EuiFlexGroup direction="column" gutterSize="xl" justifyContent="center">
      <EuiFlexItem>
        <EuiStat
          textAlign="center"
          title={licensesStats.totalCount}
          description="Total licenses count"
          descriptionElement="h3"
          isLoading={isLoading}
        />
      </EuiFlexItem>
      <EuiSpacer size="xl" />
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiTitle className="eui-textCenter" size="xs">
            <h3>Active to Inactive licenses count</h3>
          </EuiTitle>
          <EuiSpacer />
          <Chart size={{ height: 200 }}>
            <Partition
              id="activeToInactive"
              data={[
                {
                  status: 'Active',
                  count: licensesStats.activeCount,
                },
                {
                  status: 'Inactive',
                  count: licensesStats.inactiveCount,
                },
              ]}
              valueAccessor={(data) => data.count}
              layers={[
                {
                  groupByRollup: (data) => data.status,
                  shape: {
                    fillColor: (data) =>
                      euiChartTheme.theme.colors.vizColors[data.sortIndex],
                  },
                },
              ]}
              config={{
                ...euiPartitionConfig,
                clockwiseSectors: false,
              }}
            />
          </Chart>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiTitle className="eui-textCenter" size="xs">
            <h3>Valid to Expired licenses count</h3>
          </EuiTitle>
          <EuiSpacer />
          <Chart size={{ height: 200 }}>
            <Partition
              id="validToExpired"
              data={[
                {
                  status: 'Valid',
                  count: licensesStats.validCount,
                },
                {
                  status: 'Expired',
                  count: licensesStats.expiredCount,
                },
              ]}
              valueAccessor={(data) => data.count}
              layers={[
                {
                  groupByRollup: (data) => data.status,
                  shape: {
                    fillColor: (data) =>
                      euiChartTheme.theme.colors.vizColors[data.sortIndex],
                  },
                },
              ]}
              config={{
                ...euiPartitionConfig,
                clockwiseSectors: false,
              }}
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGrid>
      <EuiSpacer size="xl" />
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiTitle className="eui-textCenter" size="xs">
            <h3>Count by Customers</h3>
          </EuiTitle>
          <EuiSpacer />
          <CategoricalChart
            theme={euiChartTheme.theme}
            name="Count by Customers"
            data={orderBy(
              getCountByCustomers(licensesStats),
              ['count'],
              ['desc']
            )}
            xAccessor="customer"
            yAccessors={['count']}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiTitle className="eui-textCenter" size="xs">
            <h3>Count by Templates</h3>
          </EuiTitle>
          <EuiSpacer />
          <CategoricalChart
            theme={euiChartTheme.theme}
            name="Count by Templates"
            data={orderBy(
              getCountByTemplates(licensesStats),
              ['count'],
              ['desc']
            )}
            xAccessor="template"
            yAccessors={['count']}
          />
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiFlexGroup>
  );
};

LicensesStatisticsPanel.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  selectedTheme: navigation.selectedTheme,
});

export default connect(mapStateToProps)(LicensesStatisticsPanel);
