// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  SearchOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SearchOutlined
};

// ==============================|| MENU ITEMS - MISSION ||============================== //

const mission = {
  id: 'missions',
  title: <FormattedMessage id="missions" />,
  type: 'group',
  children: [
    {
      id: 'missions',
      title: <FormattedMessage id="missions" />,
      type: 'item',
      url: '/missions',
      icon: icons.SearchOutlined
    }
  ]
};

export default mission;
