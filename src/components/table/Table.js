import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#FF8C00',
    color: theme.palette.common.white,
    fontSize: 20,
  },
  body: {
    fontSize: 20,
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

function CustomizedTable(props) {

  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
            <TableRow>
                {props.head.map((row, index)   => {
                    return <CustomTableCell key={index} numeric>{row}</CustomTableCell>
                })}
            </TableRow>
        </TableHead>
        <TableBody>
          {
            props.body && props.body.map((row, index) => {
              return (
                    <TableRow key={index} className={classes.row}>
                      <CustomTableCell numeric>{new Buffer(row[0], 'hex').toString()}</CustomTableCell>
                      <CustomTableCell numeric>{parseInt(row[1].toString(), 16)} ONT</CustomTableCell>
                      <CustomTableCell numeric>{parseInt(row[2].toString(), 16)} GB</CustomTableCell>
                  {
                    props.account !== new Buffer(row[0], 'hex').toString() ?
                        (row[3] === '00' ?
                          <CustomTableCell numeric><Button variant="contained" color="primary" className={classes.button} onClick={() => props.buy(props.account, new Buffer(row[0], 'hex').toString(), parseInt(row[1].toString(), 16))}>
                            Buy
                          </Button></CustomTableCell>
                          :
                          <CustomTableCell numeric><Button variant="contained" color="danger" className={classes.button}>
                            Bought
                          </Button></CustomTableCell>)
                          :
                          <CustomTableCell numeric><Button variant="contained" color="secondary" className={classes.button} onClick={() => props.buy(props.account, new Buffer(row[0], 'hex').toString(), parseInt(row[1].toString(), 16))}>
                            Your Order
                          </Button></CustomTableCell>
                      }
                    </TableRow>
              );
              })
          }
        </TableBody>
      </Table>
    </Paper>
  );
}


export default withStyles(styles)(CustomizedTable);
