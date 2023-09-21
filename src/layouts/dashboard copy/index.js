import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

// import Grid from "@mui/material/Grid";
// import React, { Component } from "react";
// import { useState, useEffect } from "react";
// import io from "socket.io-client"
// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import Tab from "@mui/material/Tab";
// import Icon from "@mui/material/Icon";
// import Card from "@mui/material/Card";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// // Material Dashboard 2 React example components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import img from '../download.png'
// import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
// import BillingInformation from "layouts/dashboard/components/BillingInformation";
// import Transactions from "layouts/billing/components/Transactions";
// import momenttime from 'moment-timezone'
// // Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import moment from "moment";
// import "../../../src/style.css"
// import { Socket } from "../../socket/useSocket"
// // Dashboard components
// import DataTable from "examples/Tables/DataTable";
// import { endpoints } from "../../auth/url";
// import usercalls from "../../auth/endpoints";
// import { useNavigate } from "react-router";
// import Divider from "@mui/material/Divider";
// import Modal from '@mui/material/Modal';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import Box from '@mui/material/Box';
// import { element } from "prop-types";
// import axios from "axios";
// import * as yup from 'yup';
// import { useFormik } from 'formik';
// import TextField from '@mui/material/TextField';
// import { ToastContainer, toast } from 'react-toastify'
// import mqtt from 'precompiled-mqtt'

// function Dashboard() {
//   const soc = Socket();
//   const history = useNavigate();
//   const path = usercalls();
//   const { sales, tasks } = reportsLineChartData;
//   const [tabsOrientation, setTabsOrientation] = useState("horizontal");
//   const [tabValue, setTabValue] = useState('1');
//   const handleSetTabValue = (event, newValue) => setTabValue(newValue);
//   const [adminData, setAdmindata] = useState({})
//   const [transactionData, setTransactionData] = useState([])
//   const [collection, setCollection] = useState({})
//   const [socketData, setSocketData] = useState({})
//   const [mactcheInfo, setMactcheInfo] = useState([])
//   const [matchData, setMatchData] = useState('')
//   const [matchDatas, setMatchDatas] = useState()
//   const [footBallData, setFootBallData] = useState([])
//   const [footBallMatchData, setfootBallMatchData] = useState([])
//   const [fbpData, setFbpData] = useState(false)
//   const [GamesType, setGamesType] = useState("select");
//   const [isPercentage, SetisPercentage] = useState(false);
//   const [withdrawtype, setWithdrawtype] = useState("fixed");
//   const [footBallMatchId, setFootBallMatchId] = useState('')
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [footBallMatchName, setFootBallMatchName] = useState(false)
//   const [ftballSocket, setFtBallSocket] = useState([])
//   const [footBallScore, setFootBallScore] = useState([])
//   const [awayTeam, setAwayTeam] = useState(false)
//   const [homeTeam, setHomeTeam] = useState(false)
//   const [homeTeamLogo, setHomeTeamLogo] = useState(false)
//   const [awayTeamLogo, setAwayTeamLogo] = useState(false)
//   const [footBallMatchTime, setFootBallMatchTime] = useState(false)
//   const [userdataa, setUserdataa] = useState({
//     winning_price: '',
//     bet_limit: '',
//     bet_amount: '',
//     feetype: withdrawtype,
//     fee_percentage: '',
//     id:fbpData?.id,
//     match_name:'',
//     home_team_name:fbpData?.homeTeamName,
//     away_team_name:fbpData?.awayTeamName,
//     home_team_logo:fbpData?.homeTeamLogo,
//     away_team_logo :fbpData?.awayTeamLogo,
//     match_time:fbpData?.matchTime
//   });
//   useEffect(() => {
//     getadmin();
//     getmatch();
//     // getMatchData()
//     getTransaction();
//     getFootBallTournament()
//     mqttConnect ()
   

//   }, [])
//   const validationSchema = yup.object().shape({
//     bet_amount: yup.number().required("Required"),
//     winning_price: yup.number().required("Required"),
//     bet_limit: yup.number().required("Required"),
//     feetype: yup.string().required("Required"),
//     fee_percentage: yup.number().required("Required"),
//   });
  
//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400, borderRadius: '10px',
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     padding: '20px 0',
//   };
//   soc?.on('cricketLiveScoreData', (data) => {
//     if (data?.match_key) {
//       if (socketData?.match_key === data?.match_key) {
//         setSocketData(data)
//       }
//     }
//     else {
//     }
//   })
//   const [client, setClient] = useState(null);
//   const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
//   const mqttConnect = (host, mqttOption) => {
//     const connectUrl = `wss://mq.thesports.com:443/mqtt`
//     setClient(mqtt.connect(connectUrl, {
//     clientId:clientId,
//     clean: true,
//     username: 'alpharive',
//     password: '9ecc1d920c56bebadc08a6301108e67a',
//     rejectUnauthorized: false,
//     retain:false,
//     protocol: "wss",
//     connectTimeout: 4000,
//     reconnectPeriod: 1000
//     }));
    
//   };

//   useEffect(() => {
//     if (client) {
//       let topic='thesports/football/match/v1'
//       client.on('connect', () => {
//         console.log('Connected');
//       });
//       client.on('error', (err) => {
//         console.error('Connection error: ', err);
//         client.end();
//       });
//       client.on('reconnect', () => {
//         console.log('Reconnecting');
//       });
//       client.subscribe([topic], () => {
//         console.log(`Subscribe to topic '${topic} '`);
//       });
//       client.on('message', (topic, message) => {
//         const payload = JSON.parse(message.toString())
//         payload.forEach((e)=>{
//           // console.log(e);
//         if(e?.score !==undefined){
//           setFtBallSocket(e?.score)
//         }
//         })
      
//       });
//     }
//   }, [client]);
  


//   useEffect(()=>{
//    if(ftballSocket[0]===fbpData?.id){
  
//    }
//   },[fbpData,ftballSocket])

//   // console.log(ftballSocket[0],fbpData?.id,ftballSocket[2][0] ?ftballSocket[2][0]:null,ftballSocket[3][0] ?ftballSocket[3][0]:null);
  
//   const getMatchId = async (element) => {
//     setMatchData(element)
//     await getMatchData(element)

//   }
//   const percentageCalculate = async (number) => {
//     if (number === 'percentage') {
//       SetisPercentage(true);
//     }
//     else {
//       SetisPercentage(false);
//     }
//   }
//   const getFootBallTournament = async()=>{
//     try {
//       const url = endpoints.listfootballtournament; 
//      const data = await path.getCall({ url });
//      const result = await data.json();
//      if (result.status === true) {
//         setFootBallData(result.data);
//      }
//     } catch (error) {
//      console.log(error.message);
//     }
//   }
//   const getFootBallScore =async(e)=>{
//     try {
//       const url = endpoints.footBallLiveScore
//       let payload ={
//         match_id:e.id
//       } 
      
//       const data = await path.postCall({ url ,payload});
     
//       const result = await data.json();

//       if (result.status === true) {
//          setFootBallScore(result.data);
//       }
//     } catch (error) {
      
//     }
//   }
//   // console.log(footBallScore[0].score[2][0],"scc");
//   const sendNotification=async(element)=>{
//     try {
//       const url = `${endpoints.sendNotification}?match_id=${element.match_key}`; 
//       const data = await path.postCall({ url });
//       const result = await data.json();
//       if (result.status === true) {
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   const setBetAmountFootball=async(element)=>{
//     try {
//       handleOpen()
//       setFootBallMatchId(element.id)
//       setAwayTeam(element?.awayTeamName)
//       setHomeTeam(element?.homeTeamName)
//       setAwayTeamLogo(element?.awayTeamLogo)
//       setHomeTeamLogo(element?.homeTeamLogo)
//       setFootBallMatchTime(element?.matchTime)
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   const [transactionHistory, setTransactionHistory] = useState([])
//   const getTransaction = async () => {
//     const url = endpoints.withdrawhistory;
//     try {
//       const data = await path.getCall({ url });
//       const result = await data.json();
//       if (result.status === true) {
//         if (result && result.data) {
//           setTransactionHistory(result.data)
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
//   const getmatch = async () => {
//     const url = endpoints.getmatch;
//     try {
//       const data = await path.getCall({ url });
//       const result = await data.json();
//       if (result.status === true) {
//         if (result && result.data) {
//           setMactcheInfo(Array.isArray(result.data) ? result?.data : new Array(result?.data));
//           setSocketData(result.data[0])
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
//   const getfootballmatch = async (matchId) => {
//     const url = `${endpoints.listfootballmatch}?match_key=${matchId}`;
//     try {
//       const data = await path.postCall({ url });
//       const result = await data.json();
     
//       if (result.status === true) {
//         if (result && result.data) {
//         setfootBallMatchData(result.data)
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: userdataa,
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
   
//       onFormsubmit(values)
//     },
//   });

//   const onFormsubmit = async (values) => {
  
//    let payload={ 
//     "match_id":footBallMatchId,
//     "match_name":footBallMatchName,
//     "game":"football",
//     "betting_price":values?.bet_amount,
//     "bet_limit":values.bet_limit,
//     "withdraw_type":values.feetype,
//      "fee_percentage":values.fee_percentage,
//      "winning_amount":values.winning_price,
//      "away_team_name":awayTeam,
//      "home_team_name":homeTeam,
//      "home_team_logo":homeTeamLogo,
//      "away_team_logo":awayTeamLogo,
//      "match_time" :footBallMatchTime
//    }
//    const url = endpoints.setBetAmount;
//    try {
//     const data = await path.postCall({ url, payload });
//     const result = await data.json();
   
//     if (result.status === true) {
//         toast.success("Bet Amount added successfully!", {
//             duration: 3000,
//             position: 'top-right',
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: 'colored',
//         })
//         handleClose();
//         setUserdataa({
//           winning_price: '',
//           bet_limit: '',
//           bet_amount: '',
//           feetype: withdrawtype,
//           fee_percentage: '',
//           id:fbpData?.id,
//           match_name:'',
//           home_team_name:fbpData?.homeTeamName,
//           away_team_name:fbpData?.awayTeamName,
//           match_time :fbpData?.matchTime
//         })
//     }
//     else {
//         toast.error(result.msg, {
//             position: 'top-right',
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: 'colored',
//         })
//         handleClose();
//       setUserdataa('');
//     }
// }
// catch (error) {
//     console.error(error);
// }
//   }
//   const getadmin = async () => {
//     const url = endpoints.dashboard;
//     try {
//       const data = await path.getCall({ url });
//       const result = await data.json();
//       if (result.status === true) {
//         if (result && result.data) {
//           setAdmindata(result.data);
//           buildData(result.data.Match_list);
//           setTransactionData(result.data.transaction)
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
//   const getMatchData = async (element) => {
//     const url = endpoints.live;
//     try {
//       let payload = {
//         match_id: element.match_key
//       }
//       const data = await path.postCall({ url, payload });
//       const result = await data.json();
//       if (result.status === true) {
//         if (result && result.data) {
//           setSocketData(result?.data)
//         } else {
//           setSocketData(element)
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
//   const buildData = (users, index) => {
//     // console.log(users, "users")
//     const tempArr1 = [];
//     users.slice(0, 6).forEach((element, index) => {
//       var temp = {}
//       temp.srno = (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {index + 1}
//         </MDTypography>
//       )
//       temp.game = (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {element.game}
//         </MDTypography>
//       )
//       temp.event = (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {element.tournament_info.name}
//         </MDTypography>
//       )
//       temp.date = (
//         <MDTypography variant="caption" color="text" fontWeight="medium">
//           {moment(element.tournament_info.start_date * 1000).local().format('lll')}
//           erf
//         </MDTypography>
//       )
//       temp.action = (
//         <Grid container spacing={1} mr={3} px={3} justifyContent="center">
//           <Grid item xs={12} md={6} >
//             <MDButton color="primary" size="small" onClick={() => { history("/games") }}>
//               View
//             </MDButton>
//           </Grid>
//         </Grid >
//       )
//       tempArr1.push(temp)

//     });
//     setCollection({
//       columns: [
//         { Header: "SR.No", accessor: "srno", align: "center" },
//         { Header: "Date and Time", accessor: "date", align: "center" },
//         { Header: "Sports", accessor: "game", align: "center" },
//         { Header: "Tournament", accessor: "event", align: "left" },
//         { Header: "Action", accessor: "action", width: "10%", align: "center" },
//       ],
//       rows: tempArr1
//     })
//   }
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1
//   };

//   return (
//     <DashboardLayout>
//         <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//             />
//       <DashboardNavbar />
//       <TabContext value={tabValue}>
//         <Grid container spacing={3} justifyContent="end">
//           <Grid item xs={12} md={12} lg={4} mb={2}>
//             <Box>
//               <TabList onChange={handleSetTabValue} aria-label="lab API tabs example">
//                 <Tab label="Cricket"
//                   icon={
//                     <Icon fontSize="small" sx={{ mt: -0.25 }}>
//                       sports_cricket_icon
//                     </Icon>
//                   } value="1" />
//                 <Tab label="Footbal"
//                   value="2"
//                   icon={
//                     <Icon fontSize="small" sx={{ mt: -0.25 }}>
//                       sports_football_icon
//                     </Icon>
//                   } />
//               </TabList>
//             </Box>
//           </Grid>
//         </Grid>
//         <TabPanel value="1" sx={{ padding: 0 }}>
//           <>
//             <MDBox py={3}>
//               {mactcheInfo.length ?
//                 <Grid container spacing={3} mb={3}>
//                   <Grid item xs={12} md={5} lg={5}>
//                     <Card sx={{ background: "#fff", padding: '20px', height: '100%' }}>
//                       <MDBox mb={3}>
//                         {socketData &&
//                           <>
//                             <div>
//                               <div style={{ borderBottom: 'solid 1px #e1e1e1', padding: '20px 0' }}>
//                                 <Grid container justifyContent="center" >
//                                   <Grid item xs={3} sm={3} md={3} lg={3} textAlign="left">
//                                     {socketData.status === "started" &&
//                                       <MDButton color="error" size="left" >
//                                         Live
//                                       </MDButton>
//                                     }
                                    
//                                     {socketData.status === "completed" &&
//                                       <MDButton color="success" size="left" sx={{ padding: '0 10px' }}>
//                                         completed
//                                       </MDButton>
//                                     }
//                                     {socketData.status === "not_started" &&
//                                       <MDButton color="warning" size="left" >
//                                         not started
//                                       </MDButton>
//                                     }

//                                   </Grid>
//                                   <Grid item xs={9} sm={8} md={9} lg={9} textAlign="center">
//                                     <h5>{socketData?.title}</h5>
                                
//                                   </Grid>
//                                 </Grid>
//                               </div>
//                               <Grid container spacing={3} sx={{ marginTop: 2 }}>
//                                 <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                                   <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={socketData?.teams?.a?.country_code ? `https://letswinsports.io/img/flag/${socketData?.teams?.a?.country_code.toLowerCase()}.png` : img} />
//                                   <h5 style={{ marginTop: "5", fontWeight: '500' }}>
//                                     {socketData?.teams?.a?.name}
//                                   </h5>
//                                   {socketData?.battingTeam == "a" ?
//                                     <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting</h5> :
//                                     <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling</h5>}
//                                   {socketData?.a?.run_rate ?
//                                     <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.a_1?.score_str}{""} run rate ({socketData?.a?.run_rate})
//                                     </h6> : null}
//                                     {socketData?.winner==="a" &&
//                                      <h5 style={{ marginTop: "5", fontWeight: '500' ,color:"green"}}>
//                                     winner
//                                   </h5>}
//                                 </Grid>
//                                 <Grid item xs={2} md={2} lg={2} alignSelf="center" textAlign="center">
//                                   <h1>VS</h1>
//                                   {socketData?.liveScore && <h3 style={{ fontSize: '15px' }}>{socketData?.liveScore?.runs}/{socketData?.liveScore?.wickets} ({socketData?.liveScore?.overs[0]}.{socketData?.liveScore?.overs[1]})</h3>}
//                                 </Grid>
//                                 <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                                   <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={socketData?.teams?.b?.country_code ? `https://letswinsports.io/img/flag/${socketData?.teams?.b?.country_code.toLowerCase()}.png` : img} />
//                                   <h5 style={{ marginTop: "5px", fontWeight: '500' }}>
//                                     {socketData?.teams?.b?.name}
//                                   </h5>
//                                   {socketData?.battingTeam == "a" ?
//                                     <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling </h5> :
//                                     <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting </h5>}
//                                   {socketData?.b?.run_rate ?
//                                     <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.b_1?.score_str} {""} run rate ({socketData?.b?.run_rate})</h6>
//                                     : null}
//                                      {socketData?.winner==="b" &&
//                                      <h5 style={{ marginTop: "5", fontWeight: '500' ,color:"green"}}>
//                                     winner
//                                   </h5>}
//                                 </Grid>
//                                 {/* {socketData?.winner === null ? null :
//                                   <>
//                                     <p>Winner :
//                                       {socketData?.winner === 'a' ?
//                                         <>{socketData?.teams?.a?.name}</> :
//                                         <> {socketData?.teams?.b?.name}</>
//                                       }
//                                     </p>
//                                   </>
//                                 } */}

//                               </Grid>
//                             </div>
//                           </>
//                           // :
//                           // <div>
//                           //   {/ {console.log(matchDatas, "matchDatas")} /}
//                           //   <div style={{ borderBottom: 'solid 1px #e1e1e1', padding: '20px 0' }}>
//                           //     <Grid container spacing={3} justifyContent="center" >
//                           //       <Grid item xs={3} md={3} lg={3} textAlign="left">
//                           //         <MDButton color="error" size="left" >
//                           //           Upcoming
//                           //         </MDButton>
//                           //       </Grid>
//                           //       <Grid item xs={9} md={9} lg={9} textAlign="center">
//                           //         <h5>{matchDatas?.title}</h5>
//                           //       </Grid>
//                           //     </Grid>
//                           //   </div>
//                           //   <Grid container spacing={3} sx={{ marginTop: 2 }}>
//                           //     <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                           //       <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={matchDatas?.teams?.a?.country_code ? `http://3.236.113.186/img/flag/${matchDatas?.teams?.a?.country_code.toLowerCase()}.png` : img} />
//                           //       <h4 style={{ padding: '3px 10px', borderRadius: "5px", color: '#000', fontWeight: '500' }}>{matchDatas?.teams?.a?.name}</h4>
//                           //     </Grid>
//                           //     <Grid item xs={2} md={2} lg={2} alignSelf="center" textAlign="center">
//                           //       <h1>VS</h1>
//                           //     </Grid>
//                           //     <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                           //       <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={matchDatas?.teams?.b?.country_code ? `http://3.236.113.186/img/flag/${matchDatas?.teams?.b?.country_code.toLowerCase()}.png` : img} />
//                           //       <h4 style={{ padding: '3px 10px', borderRadius: "5px", color: '#000', fontWeight: '500' }}>{matchDatas?.teams?.b?.name}</h4>
//                           //     </Grid>
//                           //   </Grid>
//                           // </div>
//                         }
//                       </MDBox>
//                     </Card>
//                   </Grid>
//                   <Grid item xs={12} md={6} lg={7}>
//                     <Card px={3} style={{ height: '400px' }}>
//                       <MDBox alignItems="center" >
//                         <div id="style-2" style={{ height: '400px', overflow: 'auto' }}>
//                           <MDBox >
//                             <MDTypography variant="h6" gutterBottom p={3}>
//                               Today Matches
//                             </MDTypography>
//                           </MDBox>
//                           <Grid container spacing={2} px={3}>
//                             {mactcheInfo.map((element, index) => (
//                               <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
//                                 <Card>
//                                   <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
//                                     <MDBox
//                                       variant="gradient"
//                                       bgColor="success"
//                                       color="white"
//                                       coloredShadow="success"
//                                       borderRadius="xl"
//                                       display="flex"
//                                       justifyContent="center"
//                                       alignItems="center"
//                                       width="4rem"
//                                       height="4rem"
//                                       mb={3}
//                                     >
//                                       <Icon fontSize="medium" color="inherit" >
//                                         sports_cricket_icon
//                                       </Icon>
//                                     </MDBox>
//                                     <MDBox textAlign="right" lineHeight={1.25} sx={{ width: '75%' }}>
//                                       <MDTypography variant="button" fontWeight="bold" color="dark">
//                                         {element.name}
//                                       </MDTypography>
//                                       <MDTypography variant="h4">{element.venue.city}</MDTypography>
//                                       <MDTypography variant="h6">{momenttime(element.start_at * 1000).tz('Asia/Kolkata').format('LT')}</MDTypography>
              
//                                     </MDBox>
//                                   </MDBox>
//                                   <Divider />
//                                   <MDBox pb={2} px={2}>
//                                     <Grid container spacing={1}>
//                                       <Grid item xs={8} md={8} lg={8} alignSelf="center">
//                                         <MDTypography component="h4" fontWeight="bold" variant="button" color="primary" >
//                                           {element.format.toUpperCase()}
//                                         </MDTypography>
//                                       </Grid>
//                                       <Grid spacing={1}>
//                                       <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
//                                       Send Notification
//                                      </MDButton>
//                                       </Grid>
//                                       <Grid item xs={4} md={4} lg={4} textAlign="right">
//                                         <MDButton color="dark" size="left" onClick={() => { getMatchId(element) }}>View</MDButton>
//                                       </Grid>
//                                     </Grid>
//                                   </MDBox>
//                                 </Card>
//                               </Grid>
//                             ))}
//                           </Grid>
//                         </div>
//                       </MDBox>
//                     </Card>
//                   </Grid>
//                 </Grid >
//                 : null}
//               <MDBox>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6} lg={9} >
//                     <Card>
//                       <MDBox alignItems="center" sx={{ height: '400px' }}>
//                         <MDBox >
//                           <MDTypography variant="h6" gutterBottom p={3}>
//                             Tournaments
//                           </MDTypography>
//                         </MDBox>
        
                      
//                          {collection && collection.rows && collection.rows.length > 0 ? (
//                           <DataTable
//                             table={collection}
//                             showTotalEntries={false}
//                             isSorted={false}
//                             noEndBorder
//                             entriesPerPage={false}

//                           />) :
//                           (
//                             <div style={{ textAlign: 'center', padding: '20px 0' }}>
//                               No Record Found
//                             </div>
//                           )
//                         } 
//                       </MDBox>
//                     </Card>
//                   </Grid>
//                   <Grid item xs={12} md={6} lg={3}>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <DefaultInfoCard
//                           color="primary"
//                           icon="currency_bitcoin_icon"
//                           description="Balance"
//                           value={`+$${adminData && adminData.admin_wallet && adminData.admin_wallet.balance}`}
//                           button="Update"
//                           functionname="settings"
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <DefaultInfoCard
//                           color="warning"
//                           icon="currency_bitcoin_icon"
//                           description="Withdraw"
//                           value={`+$${adminData && adminData.admin_wallet && adminData.admin_wallet.maximum_withdraw}`}
//                           button="Update"
//                           functionname="settings"
//                         />
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </MDBox>
//             </MDBox >
//             <MDBox mb={3}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} lg={7} md={12}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={12} lg={4}>
//                       <MDBox mb={1.5}>
//                         <DefaultInfoCard
//                           color="warning"
//                           icon="currency_bitcoin_icon"
//                           title=" Users"
//                           value={`${adminData.user}`}
//                           button="view"
//                           functionname="users"
//                         />
//                       </MDBox>
//                     </Grid>
//                     <Grid item xs={12} md={12} lg={4}>
//                       <MDBox mb={1.5}>
//                         <DefaultInfoCard
//                           color="warning"
//                           icon="currency_bitcoin_icon"
//                           title="Admins"
//                           value={`${adminData.admin}`}
//                           button="view"
//                           functionname="sub-admin"
//                         />
//                       </MDBox>
//                     </Grid>
//                     <Grid item xs={12} md={12} lg={4}>
//                       <MDBox mb={1.5}>
//                         <DefaultInfoCard
//                           color="warning"
//                           icon="currency_bitcoin_icon"
//                           title="Assets"
//                           value={`${adminData.asset}`}
//                           button="view"
//                           functionname="asset"
//                         />
//                       </MDBox>
//                     </Grid>
//                   </Grid>
//                   <BillingInformation
//                     transactionHistory={transactionHistory} />
//                 </Grid>
//                 <Grid item xs={12} md={5}>
//                   {transactionData && transactionData.length > 0 &&
//                     <Transactions
//                       transaction={transactionData}

//                     />
//                   }
//                 </Grid>
//               </Grid>
//             </MDBox>
//           </>
//         </TabPanel>
//         <TabPanel value="2" sx={{ padding: 0 }}> 
//         {/* Coming soon */}
//         <Select
//                     style={{ height: '45px' }}
//                     labelId="Games"
//                     id="games"
//                     name={GamesType}
//                     value={GamesType}
//                     label="Tournament"
//                     onChange={(e) => {
//                       setGamesType(e.target.value)
//                       setFootBallMatchId(e.target.value.id)
//                       getfootballmatch(e.target.value.id)
//                       setFootBallMatchName(e.target.value.name)
//                     }}
//                   >
//                     <MenuItem value="select">Select Tournament</MenuItem>
//                     {footBallData && footBallData.length > 0 && footBallData.map((name) => (
//                       <MenuItem value={name} key={name.id}style={{gap:"15px"}}>
//                          <img src={name?.logo} alt={name?.id} width="25px" height="25px"/>
                   
//                         {name.name}</MenuItem>
                       
//                     ))}

//                   </Select>
//           <>
//             <MDBox py={3}>
       
//                 <Grid container spacing={3} mb={3}>
//                 {fbpData &&
//                   <Grid item xs={12} md={5} lg={5}>
//                     <Card sx={{ background: "#fff", padding: '20px', height: '100%' }}>
//                       <MDBox mb={3}>
//                         {fbpData &&
//                           <>
//                             <div>
//                               <div style={{ borderBottom: 'solid 1px #e1e1e1', padding: '20px 0' }}>
//                                 <Grid container justifyContent="center" >
//                                   <Grid item xs={3} sm={3} md={3} lg={3} textAlign="left">
//                                     {fbpData.status &&
//                                       <MDButton color="warning" size="left" >
//                                        {fbpData.status}
//                                       </MDButton>
//                                     }
// {/*                                     
//                                     {socketData.status === "completed" &&
//                                       <MDButton color="success" size="left" sx={{ padding: '0 10px' }}>
//                                         completed
//                                       </MDButton>
//                                     }
//                                     {socketData.status === "not_started" &&
//                                       <MDButton color="warning" size="left" >
//                                         not started
//                                       </MDButton>
//                                     } */}

//                                   </Grid>
//                                   <Grid item xs={9} sm={8} md={9} lg={9} textAlign="center">
//                                     <h5>{GamesType.name}</h5>
//                                     {/* <h5>{fbpData?.venueData?.name },{fbpData?.venueData?.city},{fbpData?.venueData?.country }</h5> */}
//                                     <h5>{moment(fbpData?.matchTime * 1000).local().format('lll')}</h5>
              
//                                   </Grid>
//                                 </Grid>
//                               </div>
//                               <Grid container spacing={3} sx={{ marginTop: 2 }}>
//                                 <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                                   <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={fbpData?.awayTeamLogo ? `${fbpData?.awayTeamLogo}` : img} />
//                                   <h5 style={{ marginTop: "5", fontWeight: '500' }}>
//                                     {fbpData?.awayTeamName}
//                                   </h5>
//                                   {/* {socketData?.battingTeam == "a" ?
//                                     <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting</h5> :
//                                     <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling</h5>}
//                                   {socketData?.a?.run_rate ?
//                                     <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.a_1?.score_str}{""} run rate ({socketData?.a?.run_rate})
//                                     </h6> : null} */}
                                      
//                                 <Grid alignSelf="center" textAlign="center">
                                
//                                 {
//                                     ftballSocket[0] ===fbpData?.id ?
//                                     <h3 style={{ fontSize: '15px' }}>{ ftballSocket[2][0]}</h3>:footBallScore[0]?.score!==undefined &&footBallScore[0].score[2][0]
//                                   }
//                                 </Grid>
//                                 </Grid>
//                                 <Grid item xs={2} md={2} lg={2} alignSelf="center" textAlign="center">
//                                   <h1>VS</h1><br/>
//                                  <h1>:</h1>
//                                   {/* {socketData?.liveScore && <h3 style={{ fontSize: '15px' }}>{socketData?.liveScore?.runs}/{socketData?.liveScore?.wickets} ({socketData?.liveScore?.overs[0]}.{socketData?.liveScore?.overs[1]})</h3>} */}
//                                 </Grid>
//                                 <Grid item xs={5} md={5} lg={5} alignSelf="center" textAlign="center">
//                                   <img style={{ width: '65px', height: '65px', margin: '0 auto' }} src={fbpData?.homeTeamLogo ? `${fbpData?.homeTeamLogo}` : img} />
//                                   <h5 style={{ marginTop: "5px", fontWeight: '500' }}>
//                                   {fbpData?.homeTeamName}
//                                   </h5>
//                                   {/* {socketData?.battingTeam == "a" ?
//                                     <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling </h5> :
//                                     <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting </h5>}
//                                   {socketData?.b?.run_rate ?
//                                     <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.b_1?.score_str} {""} run rate ({socketData?.b?.run_rate})</h6>
//                                     : null} */}

                              
                                
//                                 <Grid alignSelf="center" textAlign="center">
                                
//                                 {
//                                     ftballSocket[0] ===fbpData?.id ?
//                                     <h1 style={{ fontSize: '15px' }}>{ ftballSocket[3][0]}</h1>:footBallScore[0]?.score!==undefined &&footBallScore[0].score[3][0]
//                                   }
//                                 </Grid>
//                                 </Grid>
//                                 {/* {socketData?.winner === null ? null :
//                                   <>
//                                     <p>Winner :
//                                       {socketData?.winner === 'a' ?
//                                         <>{socketData?.teams?.a?.name}</> :
//                                         <> {socketData?.teams?.b?.name}</>
//                                       }
//                                     </p>
//                                   </>
//                                 } */}

//                               </Grid>
//                             </div>
//                           </>
//                         }
//                       </MDBox>
//                     </Card>
//                   </Grid>}
//                   {footBallMatchData.length !==0&&
//                   <Grid item xs={12} md={6} lg={7}>
            
//                     <Card px={3} style={{ height: '400px' }}>
//                       <MDBox alignItems="center" >
                     
//                         <div id="style-2" style={{ height: '400px', overflow: 'auto' }}>
//                           <MDBox >
//                             <MDTypography variant="h6" gutterBottom p={3}>
//                               Today Matches
//                             </MDTypography>
//                           </MDBox>
//                           <Grid container spacing={2} px={3}>
//                             {footBallMatchData.map((element, index) => (
//                               <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
//                                 <Card>
//                                   <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
//                                     <MDBox
//                                       variant="gradient"
//                                       bgColor="success"
//                                       color="white"
//                                       coloredShadow="success"
//                                       borderRadius="xl"
//                                       display="flex"
//                                       justifyContent="center"
//                                       alignItems="center"
//                                       width="4rem"
//                                       height="4rem"
//                                       mb={3}
//                                     >
//                                       <Icon fontSize="medium" color="inherit" >
//                                       sports_football_icon
//                                       </Icon>
//                                     </MDBox>
//                                     <MDBox textAlign="center" lineHeight={1.25} sx={{ width: '100%' }}>
//                                       <MDTypography variant="button" fontWeight="bold" color="dark">
//                                         {element.awayTeamName} vs  {element?.homeTeamName}
//                                       </MDTypography>
//                                       <Grid item xs={8} md={8} lg={8} alignSelf="center">
//                                         <MDTypography component="h6" fontWeight="bold" variant="button" color="primary" >
//                                         {moment(element.matchTime*1000).local().format('lll')}
//                                         </MDTypography>
//                                         <MDTypography component="h6" fontWeight="bold" variant="button"  >
//                                         status - {element?.status}
//                                         </MDTypography>
//                                       </Grid>
                                    
//                                     </MDBox>
//                                   </MDBox>
//                                   <Divider />
//                                   <MDBox pb={2} px={2}>
//                                     <Grid container spacing={1}>
                                    
//                                       {/* <Grid spacing={1}>
//                                       <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
//                                       Send Notification
//                                      </MDButton>
//                                       </Grid> */}
//                                       <Grid spacing={1}>
//                                       <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={()=>{setBetAmountFootball(element)}}>
//                                       Set Betamount
//                                      </MDButton>
//                                       </Grid>
//                                       <Grid item xs={4} md={4} lg={4} textAlign="right">
//                                         <MDButton color="dark" size="left" onClick={() => { setFbpData(element);getFootBallScore(element) }}>View</MDButton>
//                                       </Grid>
//                                     </Grid>
//                                     <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <label style={{ padding: '0 20px 0px' }}>Bet Details</label>
//           <form onSubmit={formik.handleSubmit}>
//             <Grid container spacing={2} mr={3} px={3}>
//               <Grid item xs={12}>
//                 <MDBox mt={2}>
//                   <TextField
//                     fullWidth
//                     id="bet_amount"
//                     name="bet_amount"
//                     label="Bet Amount"
//                     variant="outlined"
//                     // defaultValue={price}
//                     value={userdataa?.bet_amount}
//                     onChange={(e) => {
//                       setUserdataa({
//                         ...userdataa,
//                         bet_amount: e.target.value
//                       })
//                       formik.handleChange(e)
//                     }}
//                     // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
//                     // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
//                   />
//                 </MDBox>
//               </Grid>
//             </Grid>
//             <Grid container spacing={2} mr={3} px={3}>
//                 <Grid item xs={12}>
//                   <MDBox mt={2}>
//                     <TextField
//                       fullWidth
//                       id="winning_price"
//                       name="winning_price"
//                       label="Winning Price"
//                       variant="outlined"
//                       value={userdataa?.winning_price}
//                       onChange={(e) => {
//                         setUserdataa({
//                           ...userdataa,
//                           winning_price: e.target.value
//                         })
//                         formik.handleChange(e)
//                       }}
//                     />
//                   </MDBox>
//                 </Grid>
//               </Grid>
//               <Grid container spacing={2} mr={3} px={3}>
//                 <Grid item xs={12}>
//                   <MDBox mt={2}>
//                     <TextField
//                       fullWidth
//                       id="bet_limit"
//                       name="bet_limit"
//                       label="Bet Limit"
//                       variant="outlined"
//                       value={userdataa.bet_limit}
//                       onChange={(e) => {
//                         setUserdataa({
//                           ...userdataa,
//                           bet_limit: e.target.value
//                         })
//                         formik.handleChange(e)
//                       }}
//                     />
//                   </MDBox>
//                 </Grid>
//               </Grid>
//               <Grid container spacing={2} mr={3} px={3}>
//               <Grid item xs={12}>
//               <MDBox mt={2}>
//                 <FormControl fullWidth>
//                   <InputLabel id="Matches">Fee Type</InputLabel>
//                   <Select
//                     style={{ height: '45px' }}
//                     labelId="feetype"
//                     id="feetype"
//                     label="Fee Type"
//                     value={userdataa.feetype}
//                     onChange={(e) => {
//                       setUserdataa({
//                         ...userdataa,
//                         feetype: e.target.value
//                       })
                      
//                       setWithdrawtype(e.target.value)
//                       percentageCalculate(e.target.value);
//                     }}
//                   >
//                     <MenuItem value="fixed">Fixed</MenuItem>
//                     <MenuItem value="percentage">Percentage</MenuItem>
//                   </Select>
//                 </FormControl>
//                 </MDBox>
//               </Grid>
//               </Grid>
//               {isPercentage ?
//                 <Grid container spacing={2} mr={3} px={3}>
//                 <Grid item xs={12}>
//                 <MDBox mt={2}>
//                   <TextField
//                     fullWidth
//                     id="fee_percentage"
//                     name="fee_percentage"
//                     variant="outlined"
//                     label="Fee Percentage"
//                     onChange={(e) => {
//                       setUserdataa({
//                         ...userdataa,
//                         fee_percentage: e.target.value,
//                         id:fbpData?.id,
//                         home_team_name:fbpData?.homeTeamName,
//                         away_team_name:fbpData?.awayTeamName,
                        
//                       })
//                       formik.handleChange(e)
//                     }}
//                     // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
//                     // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
//                   />
//                   </MDBox>
//                 </Grid>
//                 </Grid>
//                 :
//                 null}
//             <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
//               <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
//                 <MDButton variant="gradient" color="dark"  onClick={ e => {formik.resetForm();handleClose()}} fullWidth>
//                   Back
//                 </MDButton>
//               </Grid>
//               <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
//                 <MDButton variant="gradient" color="info" type="submit" fullWidth>
//                   Update
//                 </MDButton>
//               </Grid>
//             </Grid>
//           </form>
//         </Box>
//       </Modal>
//                                   </MDBox>
//                                 </Card>
//                               </Grid>
//                             ))}
//                           </Grid>
//                         </div>
//                       </MDBox>
//                     </Card>
//                   </Grid>
// }
//                 </Grid >

            
//             </MDBox >
//           </>
//           {   fbpData?.id ?
//           <>
//            <iframe src={`https://letswinsports.io/api/v1/users/football-widget?match_key=${fbpData.id}`} style={{width:"100%",height:"100vh",border:"none"}}></iframe>
//           </>:null
//           }
//         </TabPanel>
//       </TabContext>
//       {/* <Footer /> */}
//     </DashboardLayout >
//   );
// }

// export default Dashboard;
