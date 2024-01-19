import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import {
  Button,
  Divider,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  ListItemIcon,
  Box,
  Chip
} from '@mui/material';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';
import SanitizedHTML from 'react-sanitized-html';
import { useKeycloak } from '@react-keycloak/web';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MissionPdfCard from 'sections/mission/MissionPdfCard';

// assets
import { MoreOutlined, EnvironmentOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import countries from 'data/countries';
import languages from 'data/languages';
import jobRoles from 'data/jobRoles';

// ==============================|| MISSION - CARD ||============================== //

const avatarImage = require.context('assets/images/missions', true);

const MissionCard = ({ mission, alertMissionToDelete }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(mission?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [mission?.mainImageUrl, keycloak?.idToken]);

  const getImageSrc = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return avatarImage(`./default.png`);
      }

      let response = await fetch(imageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDetails = () => {
    navigate('/missions/' + mission.id + '/overview');
  };

  const handleClickDelete = () => {
    alertMissionToDelete(mission);
    setAnchorEl(null);
  };

  const handleClickExportPdf = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar onClick={handleClickDetails} className="clickable" alt={mission.title} src={avatar} />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{mission.title}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {jobRoles.find(x => x.code === mission.role)?.label}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}>
                <>
                  {' '}
                  <PDFDownloadLink onClick={handleClickExportPdf} document={<MissionPdfCard mission={mission} />} fileName={`mission-${mission.title}.pdf`}>
                    Export PDF
                  </PDFDownloadLink>
                </>
              </MenuItem>
              <MenuItem onClick={handleClickDetails}>Details</MenuItem>
              <MenuItem onClick={handleClickDelete}>Archive</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <div className="card-description-container">
              <SanitizedHTML html={mission?.description} />
            </div>
          </Grid>

          <Grid item xs={6}>
            <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
              {mission.country &&
                <ListItem>
                  <ListItemIcon>
                    <EnvironmentOutlined />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">{countries.find(x => x.code === mission.country)?.label}</Typography>} />
                </ListItem>}
            </List>
          </Grid>

          <Grid item xs={6}>
            <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
              {mission.effortHours &&
                <ListItem>
                  <ListItemIcon>
                    <FieldTimeOutlined />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">{mission.effortHours} hour(s)</Typography>} />
                </ListItem>}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                {mission?.requiredLanguages?.map((language, index) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={languages.find(x => x.code === language)?.label} />
                  </ListItem>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  p: 0.5,
                  m: 0
                }}
                component="ul"
              >
                {mission?.closedOnUtc &&
                  <ListItem disablePadding sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="error" size="small" label="Closed" />
                  </ListItem>
                }
              </Box>
            </Box>
          </Grid>

        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Button variant="outlined" size="small" onClick={handleClickDetails} className="card-button-right">
            Details
          </Button>
        </Stack>
      </MainCard>
    </>
  );
};

MissionCard.propTypes = {
  mission: PropTypes.object
};

export default MissionCard;
