import PropTypes from 'prop-types';

// third-party
import { useSnackbar } from 'notistack';

const InnerSnackbarUtilsConfigurator = ({ setUseSnackbarRef }) => {
  setUseSnackbarRef(useSnackbar());
  return null;
};

InnerSnackbarUtilsConfigurator.propTypes = {
  setUseSnackbarRef: PropTypes.func
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

setUseSnackbarRef.propTypes = {
  useSnackbarRefProp: PropTypes.any
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

export default function toast(msg, options) {
  useSnackbarRef.enqueueSnackbar(msg, options);
}
