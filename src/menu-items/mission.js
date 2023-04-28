// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  FormOutlined,
  Loading3QuartersOutlined,
  HistoryOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FormOutlined,
  Loading3QuartersOutlined,
  HistoryOutlined,
  FileDoneOutlined
};

// ==============================|| MENU ITEMS - MISSION ||============================== //

const mission = {
  id: 'mission',
  title: <FormattedMessage id="mission" />,
  type: 'group',
  children: [
    {
      id: 'mission-create',
      title: <FormattedMessage id="mission-create" />,
      type: 'item',
      url: '/mission/create',
      icon: icons.FormOutlined
    },
    {
      id: 'mission-pending',
      title: <FormattedMessage id="mission-pending" />,
      type: 'item',
      url: '/mission/pending',
      icon: icons.Loading3QuartersOutlined
    },
    {
      id: 'mission-filled',
      title: <FormattedMessage id="mission-filled" />,
      type: 'item',
      url: '/mission/filled',
      icon: icons.HistoryOutlined
    },
    {
      id: 'mission-closed',
      title: <FormattedMessage id="mission-closed" />,
      type: 'item',
      url: '/mission/closed',
      icon: icons.HistoryOutlined
    }
  ]
};

export default mission;
