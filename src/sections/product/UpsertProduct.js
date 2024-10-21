import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import InfoWrapper from 'components/InfoWrapper';
import Rte from 'components/Rte';

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
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { openSnackbar } from 'store/reducers/snackbar';
import { CameraOutlined } from '@ant-design/icons';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';

import jobClusters from 'data/jobClusters';
const avatarImage = require.context('assets/images/products', true);

const getInitialValues = (product) => {
  const newProduct = {
    id: null,
    title: null,
    description: null,
    cluster: null,
    estimatedImplementationHours: null,
    contractorPrice: null,
    adminPrice: null,
    outcomeDescription: null,
    outcomeImportance: null,
    outcomeBenefits: null,
    deliverables: null,
    approachMethodology: null,
    approachBestPractices: null,
    approachSuccessStories: null
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
  const intl = useIntl();
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
  }, [product?.mainImageUrl, keycloak?.idToken]);

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
  }, [productId, keycloak?.idToken]);

  const ProductSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required').nullable(true),
    description: Yup.string().max(10000).required('Description is required').nullable(true),
    cluster: Yup.string().max(255).required('Cluster is required').nullable(true),
    estimatedImplementationHours: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true),
    contractorPrice: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true),
    adminPrice: Yup.number("Should be a positive integer").integer("Should be a positive integer").min(0, "Should be a positive integer").max(9999999, "Maximum 9999999").nullable(true),
    outcomeDescription: Yup.string().max(10000).nullable(true),
    outcomeImportance: Yup.string().max(10000).nullable(true),
    outcomeBenefits: Yup.string().max(10000).nullable(true),
    deliverables: Yup.string().max(10000).nullable(true),
    approachMethodology: Yup.string().max(10000).nullable(true),
    approachBestPractices: Yup.string().max(10000).nullable(true),
    approachSuccessStories: Yup.string().max(10000).nullable(true)
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

          navigate('/solutions/my', { state: { showProductUpsertedDialog: true} });

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
                message: (await response.text()) ?? 'Adding a solution failed.',
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

          navigate('/solutions/my', { state: { showProductUpsertedDialog: true}});

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
                          <InputLabel htmlFor="product-contractor-price">Price</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="product-contractor-price"
                          placeholder="Enter solution price"
                          value={normalizeInputValue(values.contractorPrice)}
                          name="contractorPrice"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {touched.contractorPrice && errors.contractorPrice && (
                          <FormHelperText error id="product-contractor-price-helper">
                            {errors.contractorPrice}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_description_tooltip">
                          <InputLabel htmlFor="product-description">Description</InputLabel>
                        </InfoWrapper>
                        <Rte
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

                    {keycloak.tokenParsed.roles.includes('admin') &&
                      <>
                        <Grid item xs={12}>
                          <Typography variant="h4">Admin Settings</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Stack spacing={1.25}>
                            <InputLabel htmlFor="product-admin-price">Admin Price</InputLabel>
                            <TextField
                              fullWidth
                              id="product-admin-price"
                              placeholder="Enter solution admin price"
                              value={normalizeInputValue(values.adminPrice)}
                              name="adminPrice"
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.adminPrice && errors.adminPrice && (
                              <FormHelperText error id="product-admin-price-helper">
                              {errors.adminPrice}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </>
                    }

                    <Grid item xs={12}>
                      <Typography variant="h4">Outcome Odyssey</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_outcome_description_tooltip">
                          <InputLabel htmlFor="product-outcome-description">Outcome Description</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-outcome-description"
                          value={normalizeInputValue(values.outcomeDescription)}
                          onChange={(e) => setFieldValue('outcomeDescription', e)}
                          placeholder={intl.formatMessage({ id: 'product_outcome_description_tooltip' })}
                        />
                        {touched.outcomeDescription && errors.outcomeDescription && (
                          <FormHelperText error id="product-outcome-description-helper">
                            {errors.outcomeDescription}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_outcome_importance_tooltip">
                          <InputLabel htmlFor="product-outcome-importance">Outcome Importance</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-outcome-importance"
                          value={normalizeInputValue(values.outcomeImportance)}
                          onChange={(e) => setFieldValue('outcomeImportance', e)}
                          placeholder={intl.formatMessage({ id: 'product_outcome_importance_tooltip' })}
                        />
                        {touched.outcomeImportance && errors.outcomeImportance && (
                          <FormHelperText error id="product-outcome-importance-helper">
                            {errors.outcomeImportance}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_outcome_benefits_tooltip">
                          <InputLabel htmlFor="product-outcome-benefits">Outcome Benefits</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-outcome-benefits"
                          value={normalizeInputValue(values.outcomeBenefits)}
                          onChange={(e) => setFieldValue('outcomeBenefits', e)}
                          placeholder={intl.formatMessage({ id: 'product_outcome_benefits_tooltip' })}
                        />
                        {touched.outcomeBenefits && errors.outcomeBenefits && (
                          <FormHelperText error id="product-outcome-benefits-helper">
                            {errors.outcomeBenefits}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h4">Deliverable Delights</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_deliverables_tooltip">
                          <InputLabel htmlFor="product-deliverables">Deliverables</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-deliverables"
                          value={normalizeInputValue(values.deliverables)}
                          onChange={(e) => setFieldValue('deliverables', e)}
                          placeholder={intl.formatMessage({ id: 'product_deliverables_tooltip' })}
                        />
                        {touched.deliverables && errors.deliverables && (
                          <FormHelperText error id="product-deliverables-helper">
                            {errors.deliverables}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h4">Approach Alchemy</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_approach_methodology_tooltip">
                          <InputLabel htmlFor="product-approach-methodology">Approach Methodology</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-approach-methodology"
                          value={normalizeInputValue(values.approachMethodology)}
                          onChange={(e) => setFieldValue('approachMethodology', e)}
                          placeholder={intl.formatMessage({ id: 'product_approach_methodology_tooltip' })}
                        />
                        {touched.approachMethodology && errors.approachMethodology && (
                          <FormHelperText error id="product-approach-methodology-helper">
                            {errors.approachMethodology}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_approach_best_practices_tooltip">
                          <InputLabel htmlFor="product-approach-best-practices">Approach Best Practices</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-approach-best-practices"
                          value={normalizeInputValue(values.approachBestPractices)}
                          onChange={(e) => setFieldValue('approachBestPractices', e)}
                          placeholder={intl.formatMessage({ id: 'product_approach_best_practices_tooltip' })}
                        />
                        {touched.approachBestPractices && errors.approachBestPractices && (
                          <FormHelperText error id="product-approach-best-practices-helper">
                            {errors.approachBestPractices}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="product_approach_success_stories_tooltip">
                          <InputLabel htmlFor="product-approach-success-stories">Approach Success Stories</InputLabel>
                        </InfoWrapper>
                        <Rte
                          id="product-approach-success-stories"
                          value={normalizeInputValue(values.approachSuccessStories)}
                          onChange={(e) => setFieldValue('approachSuccessStories', e)}
                          placeholder={intl.formatMessage({ id: 'product_approach_success_stories_tooltip' })}
                        />
                        {touched.approachSuccessStories && errors.approachSuccessStories && (
                          <FormHelperText error id="product-approach-success-stories-helper">
                            {errors.approachSuccessStories}
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
