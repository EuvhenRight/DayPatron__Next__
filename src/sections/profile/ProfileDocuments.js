import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useKeycloak } from '@react-keycloak/web';
import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';

import { Grid, TextField, Button, Stack, Typography, Link } from '@mui/material';
import MainCard from 'components/MainCard';
import { UploadOutlined } from '@ant-design/icons';

const ProfileDocuments = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const personalInformation = useSelector(state => state.personalInformation);
  const [newLiabilityInsurance, setNewLiabilityInsurance] = useState(null);
  const [uploadingLiabilityInsurance, setUploadingLiabilityInsurance] = useState(false);

  const handleChangeLiabilityInsurance = (event) => {
    var newFile = event.target.files?.[0];
    if (newFile)
      setNewLiabilityInsurance(newFile);
  };

  const onDownloadLiabilityInsuranceClick = async () => {
    try {
      let fileUrl = null;
      let fileName = null;

      if (newLiabilityInsurance) {
        fileUrl = URL.createObjectURL(newLiabilityInsurance);
        fileName = newLiabilityInsurance.name;
      }
      else if (personalInformation.liabilityInsuranceDocumentUrl) {
        let response = await fetch(personalInformation.liabilityInsuranceDocumentUrl,
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken
            }
          }
        );
        let fileBlob = await response.blob();
        fileUrl = URL.createObjectURL(fileBlob);
        fileName = personalInformation.liabilityInsuranceDocumentName;
      }

      if (fileUrl) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = fileUrl;
        a.download = fileName;
        a.click();
        a.remove();

        if (fileUrl)
          setTimeout(function () {
            URL.revokeObjectURL(fileUrl);
          }, 5000);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadLiabilityInsurance = async () => {
    setUploadingLiabilityInsurance(true);

    try {
      const formData = new FormData();
      formData.append("requestFile", newLiabilityInsurance);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/documents/liability-insurance',
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
      var newPersonalInformation = { ...personalInformation };
      newPersonalInformation.liabilityInsuranceDocumentUrl = json.fileUrl;
      newPersonalInformation.liabilityInsuranceDocumentName = json.fileName;

      dispatch({ type: PERSONAL_INFORMATION_UPDATE, payload: newPersonalInformation });

      dispatch(
        openSnackbar({
          open: true,
          message: 'File uploaded.',
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

    setUploadingLiabilityInsurance(false);
    setNewLiabilityInsurance(null);
  };

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h5">Liability Insurance</Typography>
            {(newLiabilityInsurance?.name || personalInformation?.liabilityInsuranceDocumentName) &&
              <Link className="clickable" onClick={onDownloadLiabilityInsuranceClick}>
                {newLiabilityInsurance?.name ? newLiabilityInsurance?.name : personalInformation?.liabilityInsuranceDocumentName}
              </Link>
            }

            {newLiabilityInsurance ?
              <Button component="label" variant="contained" onClick={handleUploadLiabilityInsurance} disabled={uploadingLiabilityInsurance}>
                {uploadingLiabilityInsurance ? <>Uploading...</> : <>Upload</>}
              </Button>
              :
              <Button component="label" variant="outlined" startIcon={<UploadOutlined />}>
                Upload file
                <TextField
                  type="file"
                  id="change-liability-insurance"
                  placeholder="Outlined"
                  variant="outlined"
                  sx={{ display: 'none' }}
                  onChange={handleChangeLiabilityInsurance}
                />
              </Button>
            }
            
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfileDocuments;
