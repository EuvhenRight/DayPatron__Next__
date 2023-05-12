import PropTypes from 'prop-types';
import { useState } from 'react';
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
  Typography
} from '@mui/material';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MissionPdfCard from 'sections//MissionPdfCard';

// assets
import { MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// ==============================|| MISSION - CARD ||============================== //

const MissionCard = ({ mission, alertMissionToDelete }) => {
  const navigate = useNavigate();

  const handleClickDetails = () => {
    navigate('/missions/' + mission.id, {
      replace: true
    });
  };

  const handleClickDelete = () => {
    alertMissionToDelete(mission);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
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
                  <Avatar alt={mission.title} src={mission.mainImageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{mission.title}</Typography>}
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
                  <PDFDownloadLink document={<MissionPdfCard mission={mission} />} fileName={`mission-${mission.title}.pdf`}>
                    Export PDF
                  </PDFDownloadLink>
                </>
              </MenuItem>
              <MenuItem onClick={handleClickDetails}>Details</MenuItem>
              <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography>{mission.description}</Typography>
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
          <Button variant="outlined" size="small" onClick={handleClickDetails}>
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
