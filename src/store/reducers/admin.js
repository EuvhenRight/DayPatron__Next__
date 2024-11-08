import { ADMIN_UPDATE } from './actions';

const initialState = {};

const admin = (state = initialState, action) => {
   
  switch (action.type) {
    case ADMIN_UPDATE: {
      
      return {
        ...state,
        workAsAdmin: action.payload.workAsAdmin 
      };
    }
    default: {
      return { ...state };
    }
  }
};
export default admin;