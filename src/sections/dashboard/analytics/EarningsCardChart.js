import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import useConfig from 'hooks/useConfig';

// third-party
import ReactApexChart from 'react-apexcharts';

const EarningsCardChart = () => {
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
      colors: [theme.palette.warning.main],
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
          y: 400
        },
        {
          x: 'F',
          y: 430
        },
        {
          x: 'M',
          y: 448
        },
        {
          x: 'A',
          y: 470
        },
        {
          x: 'M',
          y: 540
        },
        {
          x: 'J',
          y: 580
        },
        {
          x: 'J',
          y: 690
        },
        {
          x: 'A',
          y: 540
        },
        {
          x: 'S',
          y: 320
        },
        {
          x: 'O',
          y: 510
        },
        {
          x: 'N',
          y: 550
        },
        {
          x: 'D',
          y: 580
        }
      ]
    }
  ]);

  return <ReactApexChart options={options} series={series} type="bar" height={120} />;
};

export default EarningsCardChart;
