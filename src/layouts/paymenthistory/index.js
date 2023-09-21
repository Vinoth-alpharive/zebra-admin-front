// @mui material components
import { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles'
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import MDButton from "components/MDButton";
import { Card, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';


import moment from "moment";

import PaymentList from "./components/paymentList";

const useStyles = makeStyles({
  grid: {
    paddingTop: '0!important',
  },
  grid1: {
    ['@media (max-width:767px)']: {
      paddingTop: '0!important',
    },
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    padding: '20px',
  },
});

function Tables() {
  const classes = useStyles();
  const path = usercalls();
  const [user, setUser] = useState([])
  const [transactionDetail, setTransactionDetail] = useState({})
  const [collection, setCollection] = useState({})
  const [transactionType, settransactionType] = useState('ALL')

  const getdata = async () => {
    const url = endpoints.paymenthistory;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          buildData(result.data);
          setUser(result.data)
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getdata();
  }, [])

  const editTansaction = async (element) => {
    const url = `${endpoints.paymenthistory}?_id=${element._id}`;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          setTransactionDetail(result.data);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const buildData = (users, index) => {
    const tempArr = [];
    users.forEach((element, index) => {
      var temp = {}
      temp.srno = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {index + 1}
        </MDTypography>
      )
      temp.date = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {moment(new Date(parseInt((element._id).substring(0, 8), 16) * 1000)).format('lll')}
        </MDTypography>
      )
      temp.asset = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.asset}
        </MDTypography>
      )
      temp.balance = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.balance}
        </MDTypography>
      )
      temp.type = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.transaction_type}
        </MDTypography>
      )
      temp.token = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.no_of_token}
        </MDTypography>
      )
      temp.price = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.price}
        </MDTypography>
      )
      // temp.action = (
      //   <MDButton color="info" size="small"
      //     onClick={() => editTansaction(element)}
      //   >
      //     View
      //   </MDButton>
      // )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Date and Time", accessor: "date", align: "center" },
        { Header: "Asset", accessor: "asset", align: "center" },
        { Header: "Balance", accessor: "balance", align: "center" },
        { Header: "No of Token", accessor: "token", align: "center" },
        { Header: "Type", accessor: "type", align: "center" },
        { Header: "Price", accessor: "price", align: "center" },
        // { Header: "Action", accessor: "action", width: "10%", align: "center" },
      ],
      rows: tempArr
    })
  }

  const setTransType = (e) => {
    settransactionType(e)
    getType(e);
  }
  const getType = async (type) => {
    if (type != 'ALL') {
      const url = `${endpoints.paymenthistorytype}?transaction_type=${type}`;
      try {
        const data = await path.getCall({ url });
        const result = await data.json();
        if (result.status === true) {
          if (result && result.data) {
            buildData(result.data);
            setUser(result.data)
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      getdata();
    }
  }
  return (

    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={1} mr={3} justifyContent="end">
        <Grid item xs={12} md={2} textAlign="left">
          <FormControl fullWidth>
            <InputLabel id="Transaction_type">Transaction Type</InputLabel>
            <Select
              style={{ height: '45px' }}
              labelId="Transaction_type"
              id="Transaction_type"
              value={transactionType}
              label="Transaction_type"
              onChange={(e) => {
                setTransType(e.target.value)
              }}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="BUY">Buy</MenuItem>
              <MenuItem value="SELL">Sell</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <PaymentList
        Collection={collection}
      />
    </DashboardLayout >
  );
}

export default Tables;
