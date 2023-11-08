import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useState } from 'react';
import { instance } from "../Api";
import { Typography } from '@mui/material';
import { useEffect } from 'react';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


function ViewCustomerDetails(props) {
  const [customer,setCustomer]=useState([]);
  const getCustomerDetails = async () => {
    const response = await instance.get(`http://localhost:8080/api/getCustomersDetails`);
    if (response.data) {
      setCustomer(response.data);
    }
  };
  useEffect(() => {
    getCustomerDetails ();
  }, []);
  const { classes } = props;
  return (
    <div>
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Name</CustomTableCell>
            <CustomTableCell align="right">E-mail</CustomTableCell>
            <CustomTableCell align="right">Mobile</CustomTableCell>
            <CustomTableCell align="right">Gender</CustomTableCell>
            <CustomTableCell align="right">DOB</CustomTableCell>
            <CustomTableCell align="right">Address</CustomTableCell>
            <CustomTableCell align="right">Amount</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
         {customer?.map((row, i) => ( 
            <TableRow key={i}>
              <CustomTableCell component="th" scope="row">
                {row.name}
              </CustomTableCell>
              <CustomTableCell align="right"> {row.email}</CustomTableCell>
              <CustomTableCell align="right"> {row.mobile}</CustomTableCell>
              <CustomTableCell align="right"> {row.gender}</CustomTableCell>
              <CustomTableCell align="right"> {row.dateOfBirth}</CustomTableCell>
              <CustomTableCell align="right"> {row.address}</CustomTableCell>
              <CustomTableCell align="right">{row.AMT}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
      
    </div>
  )
}
ViewCustomerDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ViewCustomerDetails);

