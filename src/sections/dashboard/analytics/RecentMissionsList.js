
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(id, company, title, totalHours, status, totalAmount) {
  return { id, company, title, totalHours, status, totalAmount };
}

const rows = [
  createData(84564564, 'OopKop', 'Rebranding OopKop', 80, 'approved', 40570),
  createData(98764564, 'OopKop', 'Create launchcampaign rebranding', 80, 'approved', 180139),
  createData(98756325, 'HirePort', 'Lead generation', 355, 'approved', 90989),
  createData(98652366, 'InShared', 'Marketing Project Manager', 50, 'pending', 10239),
  createData(13286564, 'ParkBee', 'Fractional Marketeer', 100, 'pending', 83348),
  createData(86739658, 'Ultimate Gym Group', 'Marketing Manager', 99, 'deferred', 410780),
  createData(13256498, 'Nxt Museum', 'Fractional CFO', 125, 'canceled', 70999)
];

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
    case 'pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'approved':
      color = 'success';
      title = 'Approved';
      break;
    case 'rejected':
      color = 'error';
      title = 'Rejected';
      break;
    case 'deferred':
      color = 'secondary';
      title = 'Deferred';
      break;
    case 'canceled':
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

export default function RecentMissionsList() {
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
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.id}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.company}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="right">{row.totalHours}</TableCell>
                  <TableCell align="left">
                    <MissionStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumberFormat value={row.totalAmount} displayType="text" prefix="&euro;" />
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
