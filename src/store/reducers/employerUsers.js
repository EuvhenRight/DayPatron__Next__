import { EMPLOYER_USERS_GET } from './actions';

export const initialState = [];

const employerUsers = (state = initialState, action) => {
  switch (action?.type) {
    case EMPLOYER_USERS_GET: {
     return action?.payload;
    }
    default: {
      return [...state];
    }
  }
};

export default employerUsers;
