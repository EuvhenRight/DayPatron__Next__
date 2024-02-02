import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useConfig from 'hooks/useConfig';
import ReactApexChart from 'react-apexcharts';

import { format } from 'date-fns'

const TotalMissionsAppliedCardChart = ({months}) => {
  const theme = useTheme();
  const { mode } = useConfig();

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      height: 120,
      type: 'bar',
      toolbar: {
        show: false
      },
    },
    grid: {
      show: false,
      padding: {
        top: -50,
        bottom: -10
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '80%'
      }
    },
    xaxis: {
      crosshairs: {
        width: 1
      },
      labels: {
        formatter: function (val) {
          return val
        }
      }
    },
    yaxis: {
      show: false
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        formatter: function(value) {
          return value;
        }
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      tooltip: {
        theme: mode === 'dark' ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const series = [
    {
      name: 'Missions',
      data: months?.map((month) => {
        return {
          x: format(new Date(month.month + '-01'), 'MMMMM'),
          y: month.count
        };
      })
    }
  ];
  return <ReactApexChart options={options} series={series} type="bar" height={120} />;
};

export default TotalMissionsAppliedCardChart;
