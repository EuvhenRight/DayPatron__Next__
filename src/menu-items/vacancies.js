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
  SearchOutlined,
  FormOutlined
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
  SearchOutlined,
  FormOutlined
};

// ==============================|| MENU ITEMS - VACANCIES ||============================== //

const other = {
  id: 'vacancies',
  title: <FormattedMessage id="vacancies" />,
  type: 'group',
  children: [
    {
      id: 'vacancy-search',
      title: <FormattedMessage id="vacancy-search" />,
      type: 'item',
      url: '/vacancies/search',
      icon: icons.SearchOutlined
    },
    {
      id: 'vacancy-applications',
      title: <FormattedMessage id="vacancy-applications" />,
      type: 'item',
      url: '/vacancies/applications',
      icon: icons.FormOutlined
    }
  ]
};

export default other;
