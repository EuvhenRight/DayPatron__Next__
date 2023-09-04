// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  QuestionCircleOutlined
} from '@ant-design/icons';

// icons
const icons = {
  QuestionCircleOutlined
};

// ==============================|| MENU ITEMS - HELP ||============================== //

const Help = {
  id: 'help',
  title: <FormattedMessage id="help" />,
  type: 'group',
  children: [
    {
      id: 'support',
      title: <FormattedMessage id="support" />,
      type: 'item',
      url: '/support',
      icon: icons.QuestionCircleOutlined
    }
  ]
};

export default Help;