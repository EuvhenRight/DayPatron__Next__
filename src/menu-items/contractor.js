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

// ==============================|| MENU ITEMS - CONTRACTOR ||============================== //

const other = {
  id: 'contractor',
  title: <FormattedMessage id="contractor" />,
  type: 'group',
  children: [
    {
      id: 'contractor-profile',
      title: <FormattedMessage id="contractor-profile" />,
      type: 'item',
      url: '/contractor/profile/personal',
      icon: icons.UserOutlined
    },
    {
      id: 'contractor-rates',
      title: <FormattedMessage id="contractor-rates" />,
      type: 'item',
      url: '/contractor/rates',
      icon: icons.DollarOutlined
    },
    {
      id: 'contractor-availability',
      title: <FormattedMessage id="contractor-availability" />,
      type: 'item',
      url: '/contractor/availability',
      icon: icons.CalendarOutlined
    }
  ]
};

export default other;
