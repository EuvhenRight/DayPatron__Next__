import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InfoWrapper from 'components/InfoWrapper';

// material-ui
import {
  Autocomplete,
  FormHelperText,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  CardMedia
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { CameraOutlined } from '@ant-design/icons';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

import jobClusters from 'data/jobClusters';
const avatarImage = require.context('assets/images/products', true);

// constant
const getInitialValues = (product) => {
  const newProduct = {
    id: null,
    title: null,
    description: null,
    cluster: null,
    estimatedImplementationHours: null,
    price: null
  };

  if (product) {
    var result = _.merge({}, newProduct, product);

    return result;
  }

  return newProduct;
};

// ==============================|| PRODUCT ADD / EDIT / DELETE ||============================== //

const UpsertProduct = ({ productId }) => {
  const { keycloak } = useKeycloak();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [newMainImage, setNewMainImage] = useState(undefined);
  const [avatar, setAvatar] = useState(product?.mainImageUrl ? product.mainImageUrl : avatarImage('./default.png'));
  const theme = useTheme();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);

  const handleMainImageUrlChange = async (newMainImageUrl) => {
    try {
      if (!newMainImageUrl) {
        setAvatar(avatarImage(`./default.png`));
        return;
      }

      let response = await fetch(newMainImageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();
      var avatarSrc = URL.createObjectURL(imageBlob);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMainImageUrlChange(product?.mainImageUrl);
  }, [product?.mainImageUrl]);

  const handleChangeMainImage = (event) => {
    var newImage = event.target.files?.[0];
    if (newImage) {
      setNewMainImage(newImage);
      var avatarSrc = URL.createObjectURL(newImage);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    }
  };

  const handleUploadClick = async () => {

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("mainImage", newMainImage);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + encodeURIComponent(product.id) + '/main-images',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          },
          body: formData
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Upload failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );

        return;
      }

      let json = await response.json();
      var newProduct = { ...product };
      newProduct.mainImageUrl = json.mainImageUrl;

      setProduct(newProduct);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Image uploaded.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Upload failed.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      console.log(err);
    }

    setUploading(false);
    setNewMainImage(null);
  };

  const bindProduct = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + productId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setProduct(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (productId) {
        await bindProduct();
      }
    })();
  }, [productId]);

  const ProductSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required').nullable(true),
    description: Yup.string().max(10000).required('Description is required').nullable(true),
    cluster: Yup.string().max(255).required('Cluster is required').nullable(true),
    estimatedImplementationHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true),
    price: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(product),
    validationSchema: ProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        if (product) {

          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + product.id,
            {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: prepareApiBody(body)
            }
          );

          if (!response.ok) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Update failed.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
            setSubmitting(false);
            return;
          }

          navigate('/solutions/my');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Saved.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        } else {
          body.contractorId = personalInformation.id;
          let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products',
            {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + keycloak.idToken,
                'Content-Type': 'application/json'
              },
              body: prepareApiBody(body)
            }
          );

          if (!response.ok) {
            dispatch(
              openSnackbar({
                open: true,
                message: 'Adding a product failed.',
                variant: 'alert',
                alert: {
                  color: 'error'
                },
                close: false
              })
            );
            setSubmitting(false);
            return;
          }

          navigate('/solutions/my');

          dispatch(
            openSnackbar({
              open: true,
              message: 'Solution created.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );

        }

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            {!product &&
              <>
                <DialogTitle>Create Solution</DialogTitle>
                <Divider />
              </>
            }

            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2.5} alignItems="center">
                    <FormLabel
                      htmlFor="change-avatar"
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <CardMedia
                        image={avatar}
                        component="img"
                        sx={{ borderRadius: '4px', border: '1px dashed' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avatar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={handleChangeMainImage}
                    />

                    {newMainImage &&
                      <Stack alignItems="center" spacing={2}>
                        <Button onClick={handleUploadClick} variant="contained" disabled={uploading}>
                          {!uploading && <>Upload</>}
                          {uploading && <>Uploading...</>}
                        </Button>
                      </Stack>
                    }
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_title_tooltip">
                          <InputLabel htmlFor="product-title">Solution Title</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="product-title"
                          placeholder="Enter solution title"
                          value={normalizeInputValue(values.title)}
                          name="title"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.title && errors.title && (
                          <FormHelperText error id="product-title-helper">
                            {errors.title}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_price_tooltip">
                          <InputLabel htmlFor="product-price">Price</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="product-price"
                          placeholder="Enter solution price"
                          value={normalizeInputValue(values.price)}
                          name="price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.price && errors.price && (
                          <FormHelperText error id="product-price-helper">
                            {errors.price}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}
                      sx={{
                        '& .quill': {
                          borderRadius: '4px',
                          '& .ql-toolbar': {
                            bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                            borderColor: theme.palette.divider,
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px'
                          },
                          '& .ql-container': {
                            borderColor: `${theme.palette.divider} !important`,
                            borderBottomLeftRadius: '4px',
                            borderBottomRightRadius: '4px',
                            '& .ql-editor': {
                              minHeight: 135
                            }
                          }
                        }
                      }}
                    >
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_description_tooltip">
                          <InputLabel htmlFor="product-description">Description</InputLabel>
                        </InfoWrapper>
                        <ReactQuill
                          id="product-description"
                          value={normalizeInputValue(values.description)}
                          onChange={(e) => setFieldValue('description', e)}
                        />
                        {touched.description && errors.description && (
                          <FormHelperText error id="product-description-helper">
                            {errors.description}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_cluster_tooltip">
                          <InputLabel htmlFor="product-cluster">Cluster</InputLabel>
                        </InfoWrapper>
                        <Autocomplete
                          id="product-cluster"
                          fullWidth
                          options={jobClusters}
                          value={values?.cluster ? jobClusters.find((item) => item.code === values?.cluster) : null}
                          onBlur={handleBlur}
                          getOptionLabel={(option) => option?.label}
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          onChange={(event, newValue) => {
                            setFieldValue('cluster', newValue === null ? '' : newValue.code);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select cluster"
                              name="cluster"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                        {touched.cluster && errors.cluster && (
                          <FormHelperText error id="product-cluster-helper">
                            {errors.cluster}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_estimated_implementation_hours_tooltip">
                          <InputLabel htmlFor="product-estimated-implementation-hours">Estimated Total Implementation Hours</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="product-estimated-implementation-hours"
                          type="number"
                          inputProps={{ min: 0, max: 1000000 }}
                          placeholder="Enter estimated total implementation hours"
                          value={normalizeInputValue(values.estimatedImplementationHours)}
                          name="estimatedImplementationHours"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.estimatedImplementationHours && errors.estimatedImplementationHours && (
                          <FormHelperText error id="product-estimated-implementation-hours-helper">
                            {errors.estimatedImplementationHours}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button color="error" onClick={() => { navigate('/solutions/my'); }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {product ? 'Update' : 'Create'}
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

UpsertProduct.propTypes = {
  productId: PropTypes.any
};

export default UpsertProduct;
