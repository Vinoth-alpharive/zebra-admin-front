
import { useState, useEffect  } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Link } from 'react-router-dom'
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
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { ToastContainer, toast } from 'react-toastify';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '700px',
  bgcolor: '#fff',
  color: '#000',
  // border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '15px',
  p: '30px 5px 30px 30px',
};



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const head = ["S.NO", "Project Name","Paid BY" , "Network" ,  "Transfer Amount", "Transaction Hash",  ]
const head2 = ["S.NO", "Project Name","Token Name" , "Token Symbol" ,"Network" , "Paid BY",  "Transfer Amount", "Recieving token" , "Transaction Hash", "spender adress" ]
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


const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));


function LaunchpadHistory() {

  const [ transhist, setTranshist ] = useState([])
  const [network, setNetwork] = React.useState([]);


  const [age, setAge] = React.useState('admin');

  const handleChange = async (event) => {
    setAge(event.target.value);
  };

  const [creates, setCreates] = useState(null)

  const handleClick = () => {
    setCreates(true); // Start loading
    setTimeout(() => {
      setCreates(false);
      navigate('/creates'); // Navigate to the other page after 3 seconds
    }, 3000);
  };

  const path = usercalls();
  const [collection, setCollection] = useState({})
  const [loading, setLoading] = useState(true);
  const [matchid, setMatchid] = useState('1')
  useEffect(() => {
    getdata();
  }, [matchid])

  useEffect(() => {
    getnetwork();
  }, [])

  const getnetwork = async () => {
    const url = endpoints.admin_Network;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      setNetwork(result.result)
    } catch (error) {

    }
  }


  const getdata = async () => {
    setLoading(true);
    const url = endpoints.transactionhis;
    const payload = {
      trade_at: "swap"
    }
    try {
      const data = await path.postCall({ url, payload });
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



  const [open, setOpen] = React.useState(false);
  const handleOpen = (item) => {
    setSelected(item);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);


  const [disable, setDisable] = useState(false)
  const [launchPad, setLaunchPad] = useState([]);
  const [selected, setSelected] = useState([]);
  const [logo, setLogo] = useState('');
  const [status, setStatus] = useState();


  const handleDisable = async (ids, e) => {
    // setDisable(!disable)
    setStatus(!disable)

    const url = endpoints.launchPadUpdate;
    try {
      alert(e.target.checked);
      const payload = {
        id: ids,
        Status: e.target.checked
      }
      const data = await path.postCall({ url, payload });
      const res = await data.json();

      if (res?.success) {

        toast.success(res?.message, {
          duration: 3000,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      } else {
        toast.error(res?.message, {
          duration: 3000,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
      getAllLaunchPads();
      handleClose();
    } catch (error) {
      console.log(error, 'error');
    }

  }

  const handleLogoUpdate = async (e) => {
    setSelected({ ...selected, Logo: e.target.value });
    setLogo(e.target.value)
  }

  const getAllLaunchPads = async () => {
    const url = endpoints.launchPad;
    try {
      const payload = {
        type: age
      }
      const data = await path.postCall({ url, payload });
      const res = await data.json();

      if (res?.success) {
        setLaunchPad(res?.result);
      } else {
        setLaunchPad([]);
      }

    } catch (error) {
      console.log(error, 'error');
    }

  }

  useEffect(() => {
    getAllLaunchPads();
  }, [age])

  const handleApprove = async (action) => {

    const url = endpoints.launchPadUpdate;
    try {
      const payload = {
        id: selected?._id,
        logo: logo,
        Status: action
      }
      const data = await path.postCall({ url, payload });
      const res = await data.json();

      if (res?.success) {

        toast.success(res?.message, {
          duration: 3000,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      } else {
        toast.error(res?.message, {
          duration: 3000,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
      getAllLaunchPads();
      handleClose();
    } catch (error) {
      console.log(error, 'error');
    }

  }

  const [values, setValues] = React.useState(0);

  const handleChangeValues = (event, newValue) => {
    setValues(newValue);
  } 

  const gettransaction = async() => {
    const url = endpoints.LaunchpadHistory;
    const data = await path.postCall({ url });
    const res = await data.json();
    setTranshist(res?.result)
  }

  useEffect(()=>{
    gettransaction()
  },[])


  return (
    <div className="whole-history">
    <DashboardLayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <MDTypography variant="h6" color="white">
                        Launchpad History
                      </MDTypography>
                      <Box sx={{ minWidth: 120, }} style={{ paddingRight: "2vh", paddingTop: "4px" }}>
                        {/* <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label" style={{ color: "white", fontSize: '16px', paddingBottom: '1vh' }}>Chain</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Chain"
                            style={{ padding: "10px" }}
                            onChange={handleChange}
                          >

                            <MenuItem value={'user'}>Enabled</MenuItem>
                            <MenuItem value={'disabled'}>Disabled</MenuItem>
                            <MenuItem value={30}>Pending</MenuItem>
                            <MenuItem value={'admin'}>All</MenuItem>
                          </Select>
                        </FormControl> */}
                      </Box>
                    </div>

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
                    <Grid spacing={0} >
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className="transaction-tab">
                          <Box sx={{ width: '100%' }}>
                            <Box>
                              <Tabs value={values} onChange={handleChangeValues} aria-label="basic tabs example">
                                <Tab label=" Admin transaction" {...a11yProps(0)} />
                                <Tab label="Launchpad transaction" {...a11yProps(1)} />
                              </Tabs>
                            </Box>
                            <CustomTabPanel value={values} index={0}  >

                              <div className="launchpad-table">
                                <CTable style={{ width: "100%" }}>
                                  <CTableHead>
                                    <CTableRow>
                                      {head.map((value, index) => {
                                        return <CTableHeaderCell scope="col" key={index}>{value}</CTableHeaderCell>
                                      })}
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {transhist?.map((value, index) => {
                                      return <CTableRow key={index}>
                                        <CTableDataCell scope="row" >{index + 1}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Project_Name}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.pay_by}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Network}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.admin_Usdt}</CTableDataCell>
                                        { value?.Network === "Wanchain" ? 
                                        
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://www.wanscan.org/tx/${value?.Admin_Transactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell> :
                                         <> 
                                         {
                                            value?.Network === "Ethereum" ? 
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://etherscan.io/tx/${value?.Admin_Transactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell>
                                          :
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://explorer.xinfin.network/tx/${value?.Admin_Transactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell>
                                          }
                                          </>
                                         
                                        }
                                        
                                      </CTableRow>
                                    })}
                                  </CTableBody>
                                </CTable>

                              </div>

                            </CustomTabPanel>
                            <CustomTabPanel value={values} index={1}>
                              <div className="launchpad-table">
                                <CTable style={{ width: "100%" }}>
                                  <CTableHead>
                                    <CTableRow>
                                      {head2.map((value, index) => {
                                        return <CTableHeaderCell scope="col" key={index}>{value}</CTableHeaderCell>
                                      })}
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {transhist.map((value, index) => {
                                      return <CTableRow key={index}>
                                        <CTableDataCell scope="row" >{index + 1}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Project_Name}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Token_Name}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Token_symbol}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Network}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.pay_by}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Usdt}</CTableDataCell>
                                        <CTableDataCell scope="row" >{value?.Tokens}</CTableDataCell>
                                        { value?.Network === "Wanchain" ? 
                                        
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://www.wanscan.org/tx/${value?.Transactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell> :
                                         <> 
                                         {
                                            value?.Network === "Ethereum" ? 
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://etherscan.io/tx/${value?.ransactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell>
                                          :
                                          <CTableDataCell scope="row" ><span onClick={()=> window.open(`https://explorer.xinfin.network/tx/${value?.Transactionhas}` , "_blank")}>{value?.Admin_Transactionhas.slice(0,5)}....{value?.Admin_Transactionhas.slice(59,66)}</span></CTableDataCell>
                                          }
                                          </>
                                         
                                        }
                                        <CTableDataCell scope="row" >{value?.User_address.slice(0,5)}...{value?.User_address.slice(37,42)}</CTableDataCell>
                                      </CTableRow>
                                    })}
                                  </CTableBody>
                                </CTable>

                              </div>
                            </CustomTabPanel>
                          </Box>
                        </div>
                      </Grid>


                    </Grid>

                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </TabPanel>

      </TabContext>

    </DashboardLayout >
    </div>
  );
}

export default LaunchpadHistory;
