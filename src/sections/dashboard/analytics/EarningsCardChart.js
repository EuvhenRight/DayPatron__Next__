import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import useConfig from 'hooks/useConfig';

// third-party
import ReactApexChart from 'react-apexcharts';

const EarningsCardChart = ({ months }) => {
  const theme = useTheme();
  const { mode } = useConfig();

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

  const [series] = useState([
    {
      name: 'Earnings',
      data: [
        {
          x: 'J',
          y: parseInt(months?.january)
        },
        {
          x: 'F',
          y: parseInt(months?.february)
        },
        {
          x: 'M',
          y: parseInt(months?.march)
        },
        {
          x: 'A',
          y: parseInt(months?.april)
        },
        {
          x: 'M',
          y: parseInt(months?.may)
        },
        {
          x: 'J',
          y: parseInt(months?.june)
        },
        {
          x: 'J',
          y: parseInt(months?.july)
        },
        {
          x: 'A',
          y: parseInt(months?.august)
        },
        {
          x: 'S',
          y: parseInt(months?.september)
        },
        {
          x: 'O',
          y: parseInt(months?.october)
        },
        {
          x: 'N',
          y: parseInt(months?.november)
        },
        {
          x: 'D',
          y: parseInt(months?.december)
        }
      ]
    }
  ]);

  return <ReactApexChart options={options} series={series} type="bar" height={120} />;
};

export default EarningsCardChart;
