
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Id'
  },
  {
    id: 'company',
    align: 'left',
    disablePadding: true,
    label: 'Company'
  },
  {
    id: 'title',
    align: 'left',
    disablePadding: true,
    label: 'Mission Title'
  },
  {
    id: 'hours',
    align: 'right',
    disablePadding: false,
    label: 'Total Hours'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'amount',
    align: 'right',
    disablePadding: false,
    label: 'Total Amount'
  }
];

function MissionTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

MissionTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string
};


const MissionStatus = ({ status }) => {
  let color;
  let title;

  switch (status) {
    case 'Pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'Approved':
      color = 'success';
      title = 'Approved';
      break;
    case 'Rejected':
      color = 'error';
      title = 'Rejected';
      break;
    case 'Deferred':
      color = 'secondary';
      title = 'Deferred';
      break;
    case 'Canceled':
      color = 'error';
      title = 'Canceled';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

MissionStatus.propTypes = {
  status: PropTypes.string
};

export default function RecentMissionsList({recentMissionsData}) {
  const [order] = useState('asc');
  const [orderBy] = useState('tracking_no');

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <MissionTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(recentMissionsData, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row?.identifier}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row?.identifier}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row?.company}</TableCell>
                  <TableCell align="left">{row?.missionTitle}</TableCell>
                  <TableCell align="right">{row?.totalHours}</TableCell>
                  <TableCell align="left">
                    <MissionStatus status={row?.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumberFormat value={row?.totalAmount} displayType="text" prefix="&euro;" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
