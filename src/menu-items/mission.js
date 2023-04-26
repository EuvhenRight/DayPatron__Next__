// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  SearchOutlined,
  Loading3QuartersOutlined,
  HistoryOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SearchOutlined,
  Loading3QuartersOutlined,
  HistoryOutlined
};

// ==============================|| MENU ITEMS - MISSION ||============================== //

const mission = {
  id: 'mission',
  title: <FormattedMessage id="mission" />,
  type: 'group',
  children: [
    {
      id: 'mission-search',
      title: <FormattedMessage id="mission-search" />,
      type: 'item',
      url: '/mission/search',
      icon: icons.SearchOutlined
    },
    {
      id: 'mission-pending',
      title: <FormattedMessage id="mission-pending" />,
      type: 'item',
      url: '/mission/pending',
      icon: icons.Loading3QuartersOutlined
    },
    {
      id: 'mission-history',
      title: <FormattedMessage id="mission-history" />,
      type: 'item',
      url: '/mission/history',
      icon: icons.HistoryOutlined
    }
  ]
};

export default mission;
