// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  MenuUnfoldOutlined,
  BoxPlotOutlined,
  StopOutlined,
  BorderOutlined,
  SmileOutlined,
  GatewayOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined
};

// ==============================|| MENU ITEMS - EMPLOYER ||============================== //

const other = {
  id: 'employer',
  title: <FormattedMessage id="employer" />,
  type: 'group',
  children: [
    {
      id: 'employer-profile',
      title: <FormattedMessage id="employer-profile" />,
      type: 'item',
      url: '/employer/profile/personal',
      icon: icons.UserOutlined
    },
    {
      id: 'employer-rates',
      title: <FormattedMessage id="employer-rates" />,
      type: 'item',
      url: '/employer/rates',
      icon: icons.DollarOutlined
    },
    {
      id: 'employer-availability',
      title: <FormattedMessage id="employer-availability" />,
      type: 'item',
      url: '/employer/availability',
      icon: icons.CalendarOutlined
    }
  ]
};

export default other;
