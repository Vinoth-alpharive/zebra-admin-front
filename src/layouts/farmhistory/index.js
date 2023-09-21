
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import TextField from '@mui/material/TextField';

import { CTable } from '@coreui/react';
import { CTableHead } from '@coreui/react';
import { CTableHeaderCell } from '@coreui/react';
import { CTableRow } from '@coreui/react';
import { CTableBody } from '@coreui/react';
import { CTableDataCell } from '@coreui/react';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import MDButton from "components/MDButton";
import moment from "moment";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import axios from "axios";

const head = ["S.NO", "League Name", "Team", "Bet On", "Amount", "Status"]

const rows = [{ legename: "cricket", team: "india", beton: "cricket", amount: "100", status: "math" }]

// const auth = sessionStorage.getItem('accesstoken');
// axios
// .post("http://174.138.37.4/betback/v1/users/getBetHistory",{
//     id:2,
// }, {
//   headers:{
//       Authorization:auth,
//   }
// })
// .then((response) => {
//   console.log(response.data,"okokokok");
//   // toast.success(response.data.message, {
//   //   duration: 3000,
//   //   position: 'top-right',
//   //   autoClose: 5000,
//   //   hideProgressBar: false,
//   //   closeOnClick: true,
//   //   pauseOnHover: true,
//   //   draggable: true,
//   //   progress: undefined,
//   //   theme: 'colored',
//   // })
// }).catch((error) => { 
//   console.log(error,"errr")
//   // toast.error(error.response.data.message, {
//   //   position: 'top-right',
//   //   autoClose: 5000,
//   //   hideProgressBar: false,
//   //   closeOnClick: true,
//   //   pauseOnHover: true,
//   //   draggable: true,
//   //   progress: undefined,
//   //   theme: 'colored',
//   // })
// });



function FarmHistory() {
  const path = usercalls();
  const [collection, setCollection] = useState({})
  const [loading, setLoading] = useState(true);
  const [matchid, setMatchid] = useState('1')
  useEffect(() => {
    getdata();
  }, [matchid])




  const getdata = async () => {
    setLoading(true);
    const url = endpoints.transactionhis;
    const payload = {
      trade_at: "farming"
    }
    try {
      const data = await path.postCall({ url ,payload });
      const result = await data.json();
      if (result.success === true) {
        if (result && result.result) {
          buildData(result.result);
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  // const getdata1 = async () => {
  //   setLoading(true);
  //   const url = endpoints.cricketBettingHistory;
  //   try {
  //     const data = await path.getCall({ url });
  //     const result = await data.json();
  //     if (result.status === true) {
  //       if (result && result.data) {
  //         buildData(result.data);
  //         setLoading(false);
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }
  const buildData = (users, index) => {
    const tempArr = [];
    users.forEach((element, index) => {
      var temp = {}
      temp.srno = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {index + 1}
        </MDTypography>
      )
      // temp.email = (
      //   <MDTypography variant="caption" color="text" fontWeight="bold" >
      //     {element.userDetail.email}
      //   </MDTypography>
      // )
      temp.username = (
        <MDTypography variant="caption" color="text" fontWeight="bold" >
          {element?.User_Address}
        </MDTypography>
      )
      // temp.tournamentname = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element.match_info.match_name ? element.match_info.match_name : "-"}
      //   </MDTypography>
      // )
      temp.matchname = (
        <MDTypography variant="caption" color="text" fontWeight="medium" style={{ display: 'flex', alignItems: 'center', width: '100%', margin: 'auto', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '5px', margin: 'auto' }}>
            <b style={{ color: 'black', textAlign: 'right' }}>{element?.Pair} </b>

            {/* <img src={element.match_info.home_team_logo ? element.match_info.home_team_logo : "dummyFlag.png"} alt="home_team_logo" style={{ width: "25px" }} /> */}
          </div>
          {/* <div>  VS </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '50%', justifyContent: 'start', gap: '5px', margin: 'auto' }}>
            <img src={element.match_info.away_team_logo ? element.match_info.away_team_logo : "dummyFlag.png"} alt="home_team_logo" style={{ width: "25px" }} />

            <b style={{ color: 'black', textAlign: 'left' }}> {element.match_info.away_team_name}</b>
          </div> */}


        </MDTypography>
      )
      // temp.time = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {moment(element.match_info.match_time * 1000).local().format('lll')}
      //   </MDTypography>
      // )
      temp.betamount = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.Trade_type}
        </MDTypography>
      )
      temp.betinfo = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.Coin_name}
        </MDTypography>
      )
      temp.winprice = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {parseFloat(element?.Amount).toFixed(4)}
        </MDTypography>
      )
      temp.betstatus = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {parseFloat(element?.Price).toFixed(4)}
        </MDTypography>
      )
      // temp.betinfo = (
      //   // value ==='1'?
      //   <div style={{ textAlign: 'left' }}>
      //     {element.winning_team === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" >
      //         Bet Type :Team
      //         <br />Team Name :{element.winning_team_name === "home" ? element.match_info.home_team_name : element.winning_team_name === "away" ? element.match_info.away_team_name : element.winning_team_name}
      //       </MDTypography>}
      //     {element.time_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" >
      //         Bet Type :Time Bet
      //         <br />Time :{element.time} <br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>}
      //     {element.double_chance === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium">
      //         Bet Type :Double chance<br />
      //         Double chance Type :{element.double_chance_reason.split('_')[2]}/draw<br />
      //         Team Name :{element.double_chance_reason.split('_')[0] === "home" ? element.match_info.home_team_name : element.match_info.away_team_name}
      //       </MDTypography>
      //     }
      //     {element.total_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :overAll<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>}{
      //       element.first_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :overAll / First Half<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.second_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :overAll / Second Half<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>}
      //     {element.away_team_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :OverAll<br />
      //         Team Name :{element.match_info.away_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.away_team_first_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :First Half<br />
      //         Team Name :{element.match_info.away_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.away_team_second_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :Second Half<br />
      //         Team Name :{element.match_info.away_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.home_team_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :OverAll<br />
      //         Team Name :{element.match_info.home_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.home_team_first_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :First Half<br />
      //         Team Name :{element.match_info.home_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.home_team_second_half_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Goal<br />
      //         Goal Type :Second Half<br />
      //         Team Name :{element.match_info.home_team_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {element.is_player_bet === true &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //         Bet Type :Player<br />
      //         Player Name :{element?.player_name}<br />
      //         Number of Goals :{element.no_of_goals}
      //       </MDTypography>
      //     }
      //     {/* </div>:
      //   <div style={{textAlign:'left'}}> */}
      //     {element.bet_type === "run" &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" >
      //         Bet Type :Run
      //         <br />

      //         No of Over :{element.no_of_over}<br />
      //         No of Ball :{element.no_of_ball}<br />
      //         No of run:{element.no_of_run}<br />
      //       </MDTypography>}
      //     {element.bet_type === "extra" &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" >
      //         Bet Type :Extra
      //         <br />
      //         Team Name :{element.betting_team === "home" ? element.match_info.home_team_name : element.betting_team === "away" ? element.match_info.away_team_name : element.betting_team}<br />
      //         No of Over :{element.no_of_over}<br />
      //         No of Ball :{element.no_of_ball}<br />
      //         No of run:{element.no_of_run}<br />
      //         Extra Reason :{element.extra_description === 'WD' ? "Wide" : element.extra_description === 'NB' ? 'No Ball' :
      //           element.extra_description === 'LB' ? "Leg Byes" : element.extra_description === 'B' ? 'Byes' :
      //             element.extra_description === 'P' ? "Penalty" : null}
      //         <br />
      //       </MDTypography>
      //     }
      //     {element.bet_type === "wicket" &&
      //       <MDTypography variant="caption" color="text" fontWeight="medium" >
      //         Bet Type :Wicket
      //         <br />
      //         Team Name :{element.betting_team === "home" ? element.match_info.home_team_name : element.betting_team === "away" ? element.match_info.away_team_name : element.betting_team}<br />
      //         No of Over :{element.no_of_over}<br />
      //         No of Ball :{element.no_of_ball}<br />
      //       </MDTypography>
      //     }
      //   </div>
      // )
      // temp.winprice = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium" style={{ textAlign: 'left' }}>
      //     {element.winning_price}
      //   </MDTypography>
      // )
      // temp.betstatus = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element?.status === "0" ?
      //       <> <DoDisturbIcon fontSize="small"
      //         color="secondary" fontWeight="bold" sx={{ position: "relative", top: '5px', left: '-4px' }} />Pending</> :
      //       <>
      //         {element?.status === "1" ?
      //           <> <DoDisturbIcon fontSize="small"
      //             color="error" fontWeight="bold" sx={{ position: "relative", top: '5px', left: '-4px' }} />Pending</> :
      //           <>
      //             {element.status === "2" ?
      //               <>
      //                 {element.result === "Win" ?
      //                   <>
      //                     <> <CheckCircleIcon fontSize="small"
      //                       color="success" fontWeight="bold" sx={{ position: "relative", top: '5px', left: '-4px' }} />Win</>

      //                   </> : <>
      //                     <> <CancelIcon fontSize="small"
      //                       color="error" fontWeight="bold" sx={{ position: "relative", top: '5px', left: '-4px' }} />Loss</>
      //                   </>}

      //               </> : <></>
      //             }
      //           </>}</>}
      //   </MDTypography>
      // )
      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        // { Header: "Email", accessor: "email", align: "center" },
        { Header: "User Name", accessor: "username", align: "center" },
        // { Header: "Tournament Name", accessor: "tournamentname", align: "center" },
        { Header: "Pair", accessor: "matchname", align: "center" },
        // { Header: "Match Time", accessor: "time", align: "center" },
        { Header: "Trade Type", accessor: "betamount", align: "center" },
        { Header: "Buy Coin", accessor: "betinfo", align: "center" },
        { Header: "Amount", accessor: "winprice", align: "center" },
        { Header: "Price", accessor: "betstatus", align: "center" }

      ],
      rows: tempArr
    })
  }

  const matchids = (e) => {
    if (e.target.value === 'FOOT BALL') {
      setMatchid("1")
    } else if (e.target.value === 'BASE BALL') {
      setMatchid("2")
    } else if (e.target.value === 'CRICKET') {
      setMatchid("3")
    }
  }

  const [value, setValue] = useState('1');

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  //   if (newValue === "1") {
  //     getdata("football");
  //   } else if (newValue === "2") {
  //     getdata1("cricket")
  //   }
  // };

  const match = [
    {
      value: 'FOOT BALL',
      label: 'Exchange',
    },
    {
      value: 'BASE BALL',
      label: 'Swap',
    },
    {
      value: 'CRICKET',
      label: 'Farming',
    },]

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TabContext value={value}>
        {/* <Grid container px={3}>
          <Grid item xs={12} md={7} >
            <Box>
              <TextField style={{ width: "25%" }}
                id="outlined-select-currency-native"
                select
                onChange={(e) => { matchids(e) }}
                //  label="Native select"
                defaultValue="FOOT BALL"
                SelectProps={{
                  native: true,
                }}
              >
                {match.map((option) => (
                  <option key={option.value} value={option.value}  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid> */}
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

                    {/* <CTable style={{ width: "100%" }}>
                      <CTableHead>
                        <CTableRow>
                          {head.map((value, index) => {
                            return <CTableHeaderCell scope="col" key={index}>{value}</CTableHeaderCell>
                          })}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {rows.map((value, index) => {
                          return <CTableRow key={index}>
                            <CTableDataCell scope="row" >{index + 1}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.legename}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.team}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.beton}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.amount}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.status}</CTableDataCell>
                          </CTableRow>
                        })}
                      </CTableBody>
                    </CTable> */}


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
                      Betting History
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
      </TabContext>

    </DashboardLayout >
  );
}

export default FarmHistory;
