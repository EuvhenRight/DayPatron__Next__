import mockEmployerData, { range } from 'utils/mock-data';

const newEmployer = (index) => {
  const tempData = mockEmployerData(index);
  
  return {
    id: tempData.id,
    name: tempData.name,
    email: tempData.email,
    industry: tempData.industry,
    linkedInUrl: tempData.linkedInUrl,
    logoImageUrl: tempData.logoImageUrl
  };
};

export default function makeEmployerData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d, index) => ({
      ...newEmployer(index + 1),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
    }));
  };
  var result = makeDataLevel();
  return result;
}
