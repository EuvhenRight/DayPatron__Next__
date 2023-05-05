// third-party
import { Chance } from 'chance';

const chance = new Chance();

export const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return arr;
};

function mockEmployerData(index) {
  return {
    id: `${chance.bb_pin()}${index}`,
    name: chance.name(),
    email: chance.email({ domain: 'gmail.com' }),
    industry: 'IT',
    linkedInUrl: chance.url({ protocol: 'https', domain: 'linkedin.com/in' }),
    logoImageUrl: chance.avatar({ protocol: 'https' })
  };
}

export default mockEmployerData;
