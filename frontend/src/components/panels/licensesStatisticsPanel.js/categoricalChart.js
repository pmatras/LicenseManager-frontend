import React from 'react';
import PropTypes from 'prop-types';
import { Chart, Settings, BarSeries, Axis } from '@elastic/charts';

const CategoricalChart = ({ theme, data, name, xAccessor, yAccessors }) => {
  return (
    <Chart size={{ height: 300 }}>
      <Settings theme={theme} rotation={90} showLegend={false} />
      <BarSeries
        id={`chart-${name}`}
        name={name}
        data={data}
        xAccessor={xAccessor}
        yAccessors={yAccessors}
      />
      <Axis id="bottomAxis" position="left" showGridLines />
      <Axis id="leftAxis" position="bottom" />
    </Chart>
  );
};

CategoricalChart.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  xAccessor: PropTypes.string.isRequired,
  yAccessors: PropTypes.array.isRequired,
};

export default CategoricalChart;
