// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  MessageOutlined
} from '@ant-design/icons';

// icons
const icons = {
  MessageOutlined
};

// ==============================|| MENU ITEMS - ORDER ||============================== //

const communication = {
  id: 'communication',
  title: <FormattedMessage id="communication" />,
  type: 'group',
  children: [
    {
      id: 'messaging',
      title: <FormattedMessage id="messaging" />,
      type: 'item',
      url: '/messaging',
      icon: icons.MessageOutlined
    }
  ]
};

export default communication;
