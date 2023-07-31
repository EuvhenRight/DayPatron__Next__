import { PERSONAL_INFORMATION_UPDATE, PERSONAL_INFORMATION_GET } from './actions';

export const initialState = { id: null, firstName: null, lastName: null, email: null, countryPhoneCode: null, phoneNumber: null, country: null, linkedInUrl: null };

const personalInformation = (state = initialState, action) => {

  switch (action.type) {
    case PERSONAL_INFORMATION_UPDATE: {
      const personalInformationData = action.payload;
      
      return {
        ...state,
        ...personalInformationData
      };
    }
    case PERSONAL_INFORMATION_GET: {
      const personalInformationData = action.payload;

      return {
        ...state,
        ...personalInformationData
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default personalInformation;
