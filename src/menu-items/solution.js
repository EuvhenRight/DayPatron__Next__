// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  SolutionOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SolutionOutlined
};

// ==============================|| MENU ITEMS - SOLUTION ||============================== //

const solution = {
  id: 'solutions',
  title: <FormattedMessage id="solutions" />,
  type: 'group',
  children: [
    {
      id: 'my-products',
      title: <FormattedMessage id="my-products" />,
      type: 'item',
      url: '/solutions/my',
      icon: icons.SolutionOutlined
    }
  ]
};

export default solution;
