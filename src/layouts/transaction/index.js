
import * as React from 'react';
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import moment from "moment";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';

import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";

//drop down 

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


function Transactions() {

   const [age, setAge2] = React.useState('');

  const handleChange2 = (event) => {
    setAge2(event.target.value);
  };


  const path = usercalls();
  const [collection, setCollection] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getdata("user");
  }, [])

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
      temp.name = (
        <MDTypography variant="caption" color="text" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {element && element.user_id && element.user_id.name ? element.user_id.name : "---"}
        </MDTypography>
      )
      temp.stripe_id = (
        <>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {element && element.stripe_id && element.stripe_id}
          </MDTypography><br />
          {/* <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ textTransform: 'lowercase' }}>
            {element && element.actionid && element.actionid.roleType}
          </MDTypography> */}
        </>
      )
      // temp.credit = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element.credit}
      //   </MDTypography>
      // )
      temp.currency = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.currency}
        </MDTypography>
      )
      temp.balance = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.amount_total}
        </MDTypography>
      )
      temp.stauts = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.payment_status
          }
        </MDTypography>
      )
      // temp.type = (
      //   <>
      //     {element.type === 'SELL' || element.type === 'BUY' ?
      //       <>
      //         {element.type === 'SELL' ?
      //           < MDTypography sx={{ background: ' linear-gradient(149.99deg, rgb(255 21 21) -0.05%, rgb(227 13 13) -0.05%, rgb(191 17 17) 26.59%, rgb(235 28 28) 59.44%, rgb(201 0 0) 77.17%, rgb(239 16 16) 100.06%)', color: '#fff', padding: ' 5px 10px', borderRadius: ' 6px' }}
      //             variant="caption" color="error" fontWeight="medium" >
      //             {element.type}
      //           </MDTypography > :
      //           < MDTypography sx={{ background: 'linear-gradient(149.99deg, #4faf52 -0.05%, #007804 -0.05%, #06990b 26.59%, #4faf52 59.44%, #0fb515 77.17%, #4faf52 100.06%)', color: '#fff', padding: ' 5px 10px', borderRadius: ' 6px' }}
      //             variant="caption" color="success" fontWeight="medium" >
      //             {element.type}
      //           </MDTypography >}
      //       </>
      //       :
      //       <>
      //         {element.type === 'DEBIT' ?
      //           < MDTypography sx={{ background: 'linear-gradient(149.99deg, #760028 -0.05%, #6c0025 -0.05%, #e91e63 26.59%, #db195b 59.44%, #b5164c 77.17%, #78012a 100.06%)', color: '#fff', padding: ' 5px 10px', borderRadius: ' 6px' }}
      //             variant="caption" fontWeight="medium" >
      //             {element.type}
      //           </MDTypography > :
      //           < MDTypography sx={{ background: 'linear-gradient(149.99deg, #a96001 -0.05%, #c36e04 -0.05%, #df7d01 26.59%, #fb8c00 59.44%, #db7b02 77.17%, #ab6000 100.06%)', color: '#fff', padding: ' 5px 10px', borderRadius: ' 6px' }}
      //             variant="caption" fontWeight="medium" >
      //             {element.type}
      //           </MDTypography >}
      //       </>}

      //   </>
      // )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Date and Time", accessor: "date", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Stripre_id", accessor: "stripe_id", align: "center" },
        { Header: "Currency", accessor: "currency", align: "center" },
        { Header: "Balance", accessor: "balance", align: "center" },
        { Header: "Status", accessor: "stauts", align: "center" },
      ],
      rows: tempArr
    })
  }
  const buildDeposit = (users, index) => {
    const tempArr = [];
    users.forEach((element, index) => {
      console.log(element, "ele")
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
      temp.name = (
        <MDTypography variant="caption" color="text" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {element && element.user_id && element.user_id.name ? element.user_id.name : "---"}
        </MDTypography>
      )
      temp.coin = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element && element.amount_total ? element.amount_total : element.amount_total}
        </MDTypography>
      )
      temp.token = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.currency}
        </MDTypography>
      )
      // temp.price = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element && element.price ? element.price : element.live_price}
      //   </MDTypography>
      // )
      // temp.totalprice = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element.totalPrice}
      //   </MDTypography>
      // )
      // temp.status = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element.status_text ? element.status_text : "---"}
      //   </MDTypography>
      // )
      // temp.paymentaddress = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element && element.txId ? element.txId : element.send_address}
      //   </MDTypography>
      // )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Date and Time", accessor: "date", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Amount", accessor: "coin", align: "center" },
        { Header: "Currency", accessor: "token", align: "center" },
        // { Header: "Price", accessor: "price", align: "center" },
        // // { Header: "Total Price", accessor: "totalprice", align: "center" },
        // { Header: "Status", accessor: "status", align: "center" },
        // { Header: "Transaction Address", accessor: "paymentaddress", align: "center" },
      ],
      rows: tempArr
    })
  }

  const getdata = async (type) => {
    setLoading(true);
    if (type === 'user') {
      var url = `${endpoints.overalltransaction}`;
      const payload = {
        type: type
      }
      try {
        const data = await path.postCall({ url, payload });
        const result = await data.json();
        if (result.success === true) {
          if (result && result.result) {
            buildData(Array.isArray(result.result) ? result?.result : new Array(result?.result));
            setLoading(false);
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    // else if (type === 'withdraw') {
    //   setLoading(true);
    //   var url = `${endpoints.withdrawhistory}`;
    //   try {
    //     const data = await path.getCall({ url });
    //     const result = await data.json();
    //     if (result.status === true) {
    //       if (result && result.data) {
    //         buildDeposit(Array.isArray(result.data) ? result?.data : new Array(result?.data));
    //         setLoading(false);
    //       }
    //     }
    //   }
    //   catch (error) {
    //     console.error(error);
    //   }
    // } else {
    //   setLoading(true);
    //   var url = `${endpoints.deposithistory}`;
    //   try {
    //     const data = await path.getCall({ url });
    //     const result = await data.json();
    //     if (result.status === true) {
    //       if (result && result.data) {
    //         buildDeposit(Array.isArray(result.data) ? result?.data : new Array(result?.data));
    //         setLoading(false);
    //       }
    //     }
    //   }
    //   catch (error) {
    //     console.error(error);
    //   }
    // }
  }

  const getdata1 = async (type) => {
    setLoading(true);
    var url = `${endpoints.overalltransaction}`;
    const payload = {
      type: type
    }
    try {
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      if (result.success === true) {
        if (result && result.result) {

          buildDeposit(Array.isArray(result.result) ? result?.result : new Array(result?.result));
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "1") {
      getdata("user");
    } else if (newValue === "2") {
      getdata1("admin")
    } else if (newValue === "3") {
      getdata1("DEBIT")
    } else if (newValue === "4") {
      getdata("deposit");
    } else {
      getdata("withdraw");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TabContext value={value}>
        <Grid container px={3}>
          <Grid item xs={12} md={7} >
            <Box>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                {/* <Tab label="Overall" value="1" /> */}
                <Tab label="Deposit History" value="1" />
                <Tab label="User Credit History" value="2" />
                <Tab label="Withdraw History" value="3" />
                <Tab label="Betting History" value="4" />
              </TabList>
            </Box>
          </Grid>
        </Grid>
        <TabPanel value="1">
          <MDBox pt={6} pb={3}>
            <Grid container >
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Transaction History
            
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    {loading ?
                      <>
                        {collection && collection.rows &&
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading} />
                        }
                      </> : <>
                        {collection && collection.rows && collection.rows.length > 0 ? (
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />) :
                          (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              No Record Found
                            </div>
                          )
                        }
                      </>}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>
        <TabPanel value="2">
          <MDBox pt={6} pb={3}>
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Transaction History
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>

                    {loading ?
                      <>
                        {collection && collection.rows &&
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading} />
                        }
                      </> : <>
                        {collection && collection.rows && collection.rows.length ? (
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />) :
                          (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              No Record Found
                            </div>
                          )
                        }
                      </>
                    }
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>
        <TabPanel value="3">
          <MDBox pt={6} pb={3}>
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Transaction History
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>

                    {loading ?
                      <>
                        {collection && collection.rows &&
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading} />
                        }
                      </> : <>
                        {collection && collection.rows && collection.rows.length > 0 ? (
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />) :
                          (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              No Record Found
                            </div>
                          )
                        }
                      </>}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>
        <TabPanel value="4">
          <MDBox pt={6} pb={3}>
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Transaction History
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>

                    {loading ?
                      <>
                        {collection && collection.rows &&
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading} />
                        }
                      </> : <>
                        {collection && collection.rows && collection.rows.length > 0 ? (
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />) :
                          (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              No Record Found
                            </div>
                          )
                        }
                      </>}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>
        <TabPanel value="5">
          <MDBox pt={6} pb={3}>
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Transaction History
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    {loading ?
                      <>
                        {collection && collection.rows &&
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading} />
                        }
                      </> : <>
                        {collection && collection.rows && collection.rows.length > 0 ? (
                          <DataTable
                            table={collection}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />) :
                          (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                              No Record Found
                            </div>
                          )
                        }</>
                    }
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>
      </TabContext>
    </DashboardLayout >
  );
}

export default Transactions;
