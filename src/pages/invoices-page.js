import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';

// material-ui
import {
  Box,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import InfoWrapper from 'components/InfoWrapper';

import { dispatch, useSelector } from 'store';
import { useSelector as reduxUseSelector } from 'react-redux';
import { getInvoiceList } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { format } from 'date-fns';
import { openSnackbar } from 'store/reducers/snackbar';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ["id"],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    setPageSize,
    page,
    gotoPage,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef = useRef(null);

  // ================ Tab ================

  const groups = ['All', ...new Set(data.map((item) => item.status))];
  const countGroup = data.map((item) => item.status);
  const counts = countGroup.reduce(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('status', activeTab === 'All' ? '' : activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {groups.map((status, index) => (
            <Tab
              key={index}
              label={status}
              value={status}
              icon={
                <Chip
                  label={
                    status === 'All'
                      ? data.length
                      : status === 'Pending'
                        ? counts.Pending
                        : status === 'SentToAccountant'
                          ? counts.SentToAccountant
                          : counts.Paid
                  }
                  color={status === 'All' ? 'primary' : status === 'Paid' ? 'success' : status === 'SentToAccountant' ? 'warning' : 'error'}
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 0}>
          <TableRowSelection selected={Object.keys(selectedRowIds).length} />
          {headerGroups.map((group, index) => (
            <Stack key={index} direction={matchDownSM ? 'column' : 'row'} spacing={1} {...group.getHeaderGroupProps()}>
              {group.headers.map((column, i) => (
                <Box key={i} {...column.getHeaderProps([{ className: column.className }])}>
                  {column.canFilter ? column.render('Filter') : null}
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, x) => (
                  <TableCell key={x} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow>
                    {row.cells.map((cell, i) => (
                      <TableCell key={i} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| INVOICE - LIST ||============================== //

const TalentCell = ({ row }) => {
  const { values } = row;
  return (
    <Typography variant="subtitle1">{values.counterPartyName}</Typography>
  );
};

const InvoiceDateCell = ({ row }) => {
  const { values } = row;
  return (
    <Typography variant="subtitle1">{format(new Date(values.invoiceDate), "dd-MM-yyyy")}</Typography>
  );
}

const DueDateCell = ({ row }) => {
  const { values } = row;
  return (
    <Typography variant="subtitle1">{format(new Date(values.dueDate), "dd-MM-yyyy")}</Typography>
  );
}

TalentCell.propTypes = {
  row: PropTypes.object
};

// Status
const StatusCell = ({ value }) => {
  switch (value) {
    case 'SentToAccountant':
      return <Chip color="warning" label="Sent" size="small" variant="light" />;
    case 'Paid':
      return <Chip color="success" label="Paid" size="small" variant="light" />;
    case 'Pending':
    default:
      return <Chip color="error" label="Pending" size="small" variant="light" />;
  }
};

StatusCell.propTypes = {
  value: PropTypes.string
};

// Amount
const AmountCell = ({ value }) => {
  return <>&euro; {value.toFixed(2).replace('.', ',')}</>;
};

AmountCell.propTypes = {
  value: PropTypes.number
};

const DownloadInvoiceCell = ({ row }) => {

  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();

  const DownloadInvoice = async (invoiceId, invoiceNumber) => {

    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/invoices/' + encodeURIComponent(invoiceId) + '/download';

      let response = await fetch(requestUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to download invoice',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        return;
      }
      const fileName = `10xTeamBV_${invoiceNumber}.pdf`;

      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";

      let blob = await response.blob();
      var fileUrl = URL.createObjectURL(blob);

      a.href = fileUrl;
      a.download = fileName;
      a.click();
      if (fileUrl)
        setTimeout(function () {
          URL.revokeObjectURL(fileUrl);
        }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button onClick={() => DownloadInvoice(row.values.id, row.values.invoiceNumber)} color="primary" variant="outlined">Download</Button>
  )
};

DownloadInvoiceCell.propTypes = {
  value: PropTypes.string
};



const InvoicesPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = reduxUseSelector(state => state.personalInformation);
  const { lists } = useSelector((state) => state.invoice);
  useEffect(() => {
    dispatch(getInvoiceList(keycloak, personalInformation?.id));
  }, [keycloak?.idToken, personalInformation?.id]);

  const [list, setList] = useState([]);
  useEffect(() => {
    setList(lists);
  }, [lists]);

  const columns = useMemo(
    () => [
      {
        Header: 'Invoice Id',
        accessor: 'id',
        disableFilters: true
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_invoice_number"><Typography variant='body2' fontWeight='Bold'>Invoice Number</Typography></InfoWrapper>,
        accessor: 'invoiceNumber',
        disableFilters: true
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_company"><Typography variant='body2' fontWeight='Bold'>Talent</Typography></InfoWrapper>,
        accessor: 'counterPartyName',
        disableFilters: true,
        Cell: TalentCell
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_mission_name"><Typography variant='body2' fontWeight='Bold'>Mission Name</Typography></InfoWrapper>,
        accessor: 'itemName',
        disableFilters: true
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_invoice_date"><Typography variant='body2' fontWeight='Bold'>Invoice Date</Typography></InfoWrapper>,
        accessor: 'invoiceDate',
        disableFilters: true,
        Cell: InvoiceDateCell
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_due_date"><Typography variant='body2' fontWeight='Bold'>Due Date</Typography></InfoWrapper>,
        accessor: 'dueDate',
        disableFilters: true,
        Cell: DueDateCell
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_total_amount_incl_vat"><Typography variant='body2' fontWeight='Bold'>Total Amount Incl. VAT</Typography></InfoWrapper>,
        accessor: 'totalAmount',
        disableFilters: true,
        Cell: AmountCell
      },
      {
        Header: <InfoWrapper tooltipText="invoice_header_status"><Typography variant='body2' fontWeight='Bold'>Status</Typography></InfoWrapper>,
        accessor: 'status',
        disableFilters: true,
        filter: 'includes',
        Cell: StatusCell
      },
      {
        Header: 'Download',
        disableFilters: true,
        Cell: DownloadInvoiceCell
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {list ?
        (<MainCard content={false}>
          <ScrollX>
            <ReactTable columns={columns} data={list} />
          </ScrollX>
        </MainCard>)
        :
        (<MainCard>
          <Typography>No payouts.</Typography>
        </MainCard>)
      }

    </>
  );
};

function LinearWithLabel({ value, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="warning" variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number,
  others: PropTypes.any
};

export default InvoicesPage;
