import Grid from '@mui/material/Grid'
import React, { Component } from 'react'
import { useState, useEffect } from 'react'
import io from 'socket.io-client'
// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import Tab from '@mui/material/Tab'
import Icon from '@mui/material/Icon'
import Card from '@mui/material/Card'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import img from '../download.png'
import DefaultInfoCard from 'examples/Cards/InfoCards/DefaultInfoCard'
import BillingInformation from 'layouts/dashboard/components/BillingInformation'
import Transactions from 'layouts/billing/components/Transactions'
import momenttime from 'moment-timezone'
// Data
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import reportsBarChartData from 'layouts/dashboard/data/reportsBarChartData'
import reportsLineChartData from 'layouts/dashboard/data/reportsLineChartData'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'
import moment from 'moment'
import '../../../src/style.css'
import { Socket } from '../../socket/useSocket'
// Dashboard components
import DataTable from 'examples/Tables/DataTable'
import { endpoints } from '../../auth/url'
import usercalls from '../../auth/endpoints'
import { useNavigate } from 'react-router'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { element } from 'prop-types'
import axios from 'axios'
import * as yup from 'yup'
import { useFormik } from 'formik'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import mqtt from 'precompiled-mqtt'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'

import 'react-vertical-timeline-component/style.min.css'

function Dashboard() {
  const soc = Socket()
  const history = useNavigate()
  const path = usercalls()
  const { sales, tasks } = reportsLineChartData
  const [tabsOrientation, setTabsOrientation] = useState('horizontal')
  const [tabValue, setTabValue] = useState('1')
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue)
  }
  const [liveTabValue, setLiveTabValue] = useState('1')
  const handleSetLiveTabValue = (event, newValue) => {
    setLiveTabValue(newValue)
  }

  const [adminData, setAdmindata] = useState({})
  const [transactionData, setTransactionData] = useState([])
  const [collection, setCollection] = useState({})
  const [socketData, setSocketData] = useState({})
  const [mactcheInfo, setMactcheInfo] = useState([])
  const [matchData, setMatchData] = useState('')
  const [matchDatas, setMatchDatas] = useState()
  const [footBallData, setFootBallData] = useState([])
  const [cricketData, setCricketData] = useState([])
  const [footBallMatchData, setfootBallMatchData] = useState([])
  const [todayFootBallMatchData, settodayFootBallMatchData] = useState([])
  const [todayCricketMatchData, settodayCricketMatchData] = useState([])
  const [cricketMatchData, setcricketMatchData] = useState([])
  const [fbpData, setFbpData] = useState(false)
  const [cpData, setcpData] = useState(false)
  const [GamesType, setGamesType] = useState('select')
  const [cricketGamesType, setCricketGamesType] = useState('select')
  const [isPercentage, SetisPercentage] = useState(false)
  const [withdrawtype, setWithdrawtype] = useState('fixed')
  const [footBallMatchId, setFootBallMatchId] = useState('2')
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [footBallMatchName, setFootBallMatchName] = useState(false)
  const [ftballSocket, setFtBallSocket] = useState([])
  const [footBallScore, setFootBallScore] = useState([])
  const [footballIncident, setFootballIncident] = useState([])
  const [awayTeam, setAwayTeam] = useState(false)
  const [homeTeam, setHomeTeam] = useState(false)
  const [homeTeamLogo, setHomeTeamLogo] = useState(false)
  const [awayTeamLogo, setAwayTeamLogo] = useState(false)
  const [footBallMatchTime, setFootBallMatchTime] = useState(false)
  const [timelineElements, setTimelineElements] = useState([])
  const [footBall2dayMatch, setFootBall2dayMatch] = useState([])
  const [footballPlayers, setFootballPlayers] = useState()
  const [cricketPlayers, setCricketPlayers] = useState()
  const [footballPlayersListFirst, setFootballPlayersListFirst] = useState(true)
  const [footballPlayerTabValue, setFootballPlayerTabValue] = useState('1')
  const [footballIncidentLive, setFootballIncidentLive] = useState([])
  const [homeTeamScore, setHomeTeamScore] = useState()
  const [awayTeamScore, setAwayTeamScore] = useState()
  const [cricketLiveTabValue, setCricktLiveTabValue] = useState('1')
  const [cricketPlayerTabValue, setCricketPlayerTabValue] = useState('1')
  const [isCricketSocket, setIsCricketSocket] = useState(false)
  const [cricketId, setCricketId] = useState()
  const handleSetCricketLiveTabValue = (event, newValue) => {
    setCricktLiveTabValue(newValue)
  }

  const [userdataa, setUserdataa] = useState({
    winning_price: '',
    bet_limit: '',
    bet_amount: '',
    feetype: withdrawtype,
    fee_percentage: '',
    id: fbpData?.id,
    match_name: '',
    home_team_name: fbpData?.homeTeamName,
    away_team_name: fbpData?.awayTeamName,
    home_team_logo: fbpData?.homeTeamLogo,
    away_team_logo: fbpData?.awayTeamLogo,
    match_time: fbpData?.matchTime,
  })
  useEffect(() => {
    getadmin()
    getmatch()
    // getMatchData()
    getTransaction()
    getFootBallTournament()
    getCricketTournament()
    mqttConnect()
    if (GamesType === 'select') {
      getLiveFbMatches()
    }
  }, [])
  const validationSchema = yup.object().shape({
    bet_amount: yup.number().required('Required'),
    winning_price: yup.number().required('Required'),
    bet_limit: yup.number().required('Required'),
    feetype: yup.string().required('Required'),
    fee_percentage: yup.number().required('Required'),
  })

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: '10px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px 0',
  }
  soc?.on('cricketLiveScoreData', (data) => {
    if (data?.match_key) {
      if (socketData?.match_key === data?.match_key) {
        setSocketData(data)
      }
    } else {
    }
  })
  const [client, setClient] = useState(null)
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
  const mqttConnect = (host, mqttOption) => {
    const connectUrl = `wss://mq.thesports.com:443/mqtt`
    setClient(
      mqtt.connect(connectUrl, {
        clientId: clientId,
        clean: true,
        username: 'letswin',
        password: '16cc25272dc062bc8452b3d94a00bbb7',
        rejectUnauthorized: false,
        retain: false,
        protocol: 'wss',
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      }),
    )
  }
  const [cricketSocket, setCricketSocket] = useState([])
  const [cricketApiSocket, setCricketApiSocket] = useState([])
  const [liveData, setLiveData] = useState(null)
  useEffect(() => {
    if (client) {
      let topic = 'thesports/football/match/v1'
      let cricket = 'thesports/cricket/match/v1'
      client.on('connect', () => {
        console.log('Connected')
      })
      client.on('error', (err) => {
        console.error('Connection error: ', err)
        client.end()
      })
      client.on('reconnect', () => {
        console.log('Reconnecting')
      })
      client.subscribe(topic, { qos: 0 })
      client.subscribe(cricket, { qos: 0 })
      client.on('message', (topic, message) => {
        if (topic === 'thesports/football/match/v1') {
          const payload = JSON.parse(message.toString())
          payload.forEach((e) => {
            if (e?.score !== undefined) {
              setFtBallSocket(e?.score)
            }
            if (e?.incidents !== undefined) {
              setTimelineElements(e)
              setFootballIncidentLive(e[0]?.results?.incidents)
            }
          })
        }
        if (topic === 'thesports/cricket/match/v1') {
          const payload = JSON.parse(message.toString())
          payload.forEach((e) => {
            if (e?.score !== undefined) {
              // console.log(e);
             
              // console.log(e.id, cricketId);

              if(e.id === cricketId){

                console.log(e.score[2]);


         

                setHomeTeamScore("")
              setAwayTeamScore("")

                if(
          e?.score[4].innings?.length===1 &&
         e?.score[2]===1
         ){
          setHomeTeamScore(
            e?.score[4].innings[0]
              ? e?.score[4].innings[0]
              : undefined
          )
         }

         if(
          e?.score[4].innings?.length===1 &&
          e?.score[2]===2
         ){
          setAwayTeamScore(
            e?.score[4].innings[0]
              ? e?.score[4].innings[0]
              : undefined
          )
         }
       
     if(
      e?.score[4].innings?.length===2
      &&
      e?.score[2]===1
     ){
      setHomeTeamScore(
        e?.score[4].innings[1]
          ? e?.score[4].innings[1]
          : undefined
      )
     }

     if(
      e?.score[4].innings?.length===2
      &&
      e?.score[2]===2
     ){
      setAwayTeamScore(
        e?.score[4].innings[1]
          ? e?.score[4].innings[1]
          : undefined
      )
     }




                console.log(e.id);
                setCricketSocket([])
                setCricketSocket(e?.score)
                setLiveData(e)
                setIsCricketSocket(true)
              }

             
            }
            // if(e?.incidents !==undefined){
            //   setTimelineElements(e)
            //}
          })
        }
      })
    }
  }, [client,cricketId])


  useEffect(() => {
    const getfootballmatch = async () => {
      const url = `${endpoints.footBallTodayMatch}`

      try {
        const data = await path.getCall({ url })

        const result = await data.json()

        if (result.status === true) {
          if (result && result.data) {
            settodayFootBallMatchData(result.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    getfootballmatch()
  }, [])

  useEffect(() => {
    const getfootballmatch = async () => {
      const url = `${endpoints.cricketTodayMatch}`

      try {
        const data = await path.getCall({ url })

        const result = await data.json()

        if (result.status === true) {
          if (result && result.data) {
            settodayCricketMatchData(result.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    getfootballmatch()
  }, [])

  useEffect(() => {
    if (ftballSocket[0] === fbpData?.id) {
    }
  }, [fbpData, ftballSocket])

  const getMatchId = async (element) => {
    setMatchData(element)
    await getMatchData(element)
  }
  const percentageCalculate = async (number) => {
    if (number === 'percentage') {
      SetisPercentage(true)
    } else {
      SetisPercentage(false)
    }
  }
  const getFootBallTournament = async () => {
    try {
      const url = endpoints.listfootballtournament
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        setFootBallData(result.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const getLiveFbMatches = async () => {
    try {
      const url = endpoints.footBallTodayMatch
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        setFootBall2dayMatch(result.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const getCricketTournament = async () => {
    try {
      const url = endpoints.listCricketTournament
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        setCricketData(result.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const getFootBallScore = async (e) => {
    try {
      getPlayersList(e.id)
      const url = endpoints.footBallLiveScore
      let payload = {
        match_id: e.id,
      }

      const data = await path.postCall({ url, payload })

      const result = await data.json()

      if (result.status === true) {
        setFootBallScore(result.data)
        setFootballIncident(result.data[0].incidents.reverse())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const getPlayersList = async (matchID) => {
    try {
      const url = endpoints.footballPlayersList
      let payload = {
        match_key: matchID,
      }

      const data = await path.postCall({ url, payload })

      const result = await data.json()

      if (result.status === true) {
        // console.log(result?.data?.results?.lineup);
        setFootballPlayers(result?.data?.results?.lineup)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const getCricketPlayersList = async (matchID) => {
    try {
      const url = endpoints.cricketPlayersList
      let payload = {
        match_key: matchID,
      }

      const data = await path.postCall({ url, payload })

      const result = await data.json()

if(result?.status===false){
  setCricketPlayers([])
}
      if (result.status === true) {
        // console.log(result?.data?.results?.lineup);
      console.log(result?.data)
        setCricketPlayers(result?.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // console.log(cricketPlayers, 'asd')
  // console.log(footBallScore[0].score[2][0],"scc");
  const sendNotification = async (element,type) => {
    try {
      const url = `${endpoints.sendNotification}?match_id=${element?.id}`
      let payload ={
        home_team_name :element?.homeTeamName,
        match_time:element?.matchTime,
        away_team_name:element?.awayTeamName,
        match_name :footBallMatchName
      }
      const data = await path.postCall({ url ,payload})
      const result = await data.json()
      if (result.status === true) {
      }
    } catch (error) {
      console.error(error)
    }
  }
  const setBetAmountFootball = async (element) => {
    try {
      handleOpen()
      setFootBallMatchId(element.id)
      setAwayTeam(element?.awayTeamName)
      setHomeTeam(element?.homeTeamName)
      setAwayTeamLogo(element?.awayTeamLogo)
      setHomeTeamLogo(element?.homeTeamLogo)
      setFootBallMatchTime(element?.matchTime)
    } catch (error) {
      console.error(error)
    }
  }
  const setBetAmountCricket = async (element) => {
    try {
      handleOpen()
      setFootBallMatchId(element.id)
      setAwayTeam(element?.awayTeamName)
      setHomeTeam(element?.homeTeamName)
      setAwayTeamLogo(element?.awayTeamLogo)
      setHomeTeamLogo(element?.homeTeamLogo)
      setFootBallMatchTime(element?.matchTime)
    } catch (error) {
      console.error(error)
    }
  }
  const [transactionHistory, setTransactionHistory] = useState([])
  const getTransaction = async () => {
    const url = endpoints.withdrawhistory
    try {
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        if (result && result.data) {
          setTransactionHistory(result.data)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getmatch = async () => {
    const url = endpoints.getmatch
    try {
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        if (result && result.data) {
          setMactcheInfo(
            Array.isArray(result.data) ? result?.data : new Array(result?.data),
          )
          setSocketData(result.data[0])
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getfootballmatch = async (matchId) => {
    const url = `${endpoints.listfootballmatch}?match_key=${matchId}`
    try {
      const data = await path.postCall({ url })
      const result = await data.json()

      if (result.status === true) {
        if (result && result.data) {
          setfootBallMatchData(result.data)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getcricketmatch = async (matchId) => {
    const url = `${endpoints.listcricketmatch}?match_key=${matchId}`
    try {
      const data = await path.postCall({ url })
      const result = await data.json()

      if (result.status === true) {
        if (result && result.data) {
          setcricketMatchData(result.data)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [idCheck, setIdCheck] = useState(null)
  const callCricketAPI = async (element) => {
    try {
      setIdCheck(element.id)
      getCricketPlayersList(element.id)
      const url = endpoints.cricketLiveScore
      let payload = {
        match_id: element.id,
      }
      setCricketId(element.id)
      const data = await path.postCall({ url, payload })
      
      const result = await data.json()
      // console.log( result?.data[0]?.score ,'sad')
      // setcpData(element.id)
      if(result?.status===false){
        setCricketApiSocket([])
      }

      if (result.status === true) {
        setIsCricketSocket(false)
        setCricketSocket([])
        setCricketApiSocket([])
        setCricketApiSocket(result?.data[0]?.score!==undefined ? result?.data[0]?.score: [] )
        setLiveData(result?.data[0])
//  console.log(result?.data[0].id,'asd');
        // if(
        //   result?.data[0]?.score[4].innings?.length===1 &&
        //   result?.data[0]?.score[2]===1
        //  ){
        //   console.log(result?.data[0]?.score[4].innings[0]);
        //   setHomeTeamScore(
        //     result?.data[0]?.score[4].innings[0]
        //       ? result?.data[0]?.score[4].innings[0]
        //       : undefined
        //   )
        //  }

        //  if(
        //   result?.data[0]?.score[4].innings?.length===1 &&
        //   result?.data[0]?.score[2]===2
        //  ){
        //   console.log(result?.data[0]?.score[4].innings[0]);
        //   setAwayTeamScore(
        //     result?.data[0]?.score[4].innings[0]
        //       ? result?.data[0]?.score[4].innings[0]
        //       : undefined
        //   )
        //  }
       
    //  if(
    //   result?.data[0]?.score[4].innings?.length===2
    //   &&
    //   result?.data[0]?.score[2]===1
    //  ){
    //   console.log(result?.data[0]?.score[4].innings[1]);
    //   setHomeTeamScore(
    //     result?.data[0]?.score[4].innings[1]
    //       ? result?.data[0]?.score[4].innings[1]
    //       : undefined
    //   )
    //  }

    //  if(
    //   result?.data[0]?.score[4].innings?.length===2
    //   &&
    //   result?.data[0]?.score[2]===2
    //  ){
    //   console.log(result?.data[0]?.score[4].innings[1]);
    //   setAwayTeamScore(
    //     result?.data[0]?.score[4].innings[1]
    //       ? result?.data[0]?.score[4].innings[1]
    //       : undefined
    //   )
    //  }
        
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // console.log(isCricketSocket,'checking');
  // console.log(   cricketSocketAPI.length!==0 &&   cricketSocketAPI[4]?.innings[0][1]+"/"+cricketSocketAPI[4]?.innings[0][3]+'('+cricketSocketAPI[4]?.innings[0][2]+')'+' vs '+cricketSocketAPI[4]?.innings[1][1]+"/"+cricketSocketAPI[4]?.innings[1][3]+'('+cricketSocketAPI[4]?.innings[1][2]+')'
  // );
  // console.log(homeTeamScore, awayTeamScore)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdataa,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values)
    },
  })

  const onFormsubmit = async (values) => {
    let payload = {
      match_id: footBallMatchId,
      match_name: footBallMatchName,
      game: tabValue === '1' ? 'cricket' : 'football',
      betting_price: values?.bet_amount,
      bet_limit: values.bet_limit,
      withdraw_type: values.feetype,
      fee_percentage: values.fee_percentage,
      winning_amount: values.winning_price,
      away_team_name: awayTeam,
      home_team_name: homeTeam,
      home_team_logo: homeTeamLogo,
      away_team_logo: awayTeamLogo,
      match_time: footBallMatchTime,
    }

    const url =
      tabValue === '1' ? endpoints.setCricketBetAmount : endpoints.setBetAmount
    // console.log(url)
    try {
      const data = await path.postCall({ url, payload })
      const result = await data.json()

      if (result.status === true) {
        toast.success('Bet Amount added successfully!', {
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
        handleClose()
        setUserdataa({
          winning_price: '',
          bet_limit: '',
          bet_amount: '',
          feetype: withdrawtype,
          fee_percentage: '',
          id: fbpData?.id,
          match_name: '',
          home_team_name: fbpData?.homeTeamName,
          away_team_name: fbpData?.awayTeamName,
          match_time: fbpData?.matchTime,
        })
      } else {
        toast.error(result.msg, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        handleClose()
        setUserdataa('')
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getadmin = async () => {
    const url = endpoints.dashboard
    try {
      const data = await path.getCall({ url })
      const result = await data.json()
      if (result.status === true) {
        if (result && result.data) {
          setAdmindata(result.data)
          buildData(result.data.Match_list)
          setTransactionData(result.data.transaction)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getMatchData = async (element) => {
    const url = endpoints.live
    try {
      let payload = {
        match_id: element.match_key,
      }
      const data = await path.postCall({ url, payload })
      const result = await data.json()
      if (result.status === true) {
        if (result && result.data) {
          setSocketData(result?.data)
        } else {
          setSocketData(element)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const buildData = (users, index) => {
    // console.log(users, "users")
    const tempArr1 = []
    users.slice(0, 6).forEach((element, index) => {
      var temp = {}
      temp.srno = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {index + 1}
        </MDTypography>
      )
      temp.game = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.game}
        </MDTypography>
      )
      temp.event = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.tournament_info.name}
        </MDTypography>
      )
      temp.date = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {moment(element.tournament_info.start_date * 1000)
            .local()
            .format('lll')}
          erf
        </MDTypography>
      )
      temp.action = (
        <Grid container spacing={1} mr={3} px={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <MDButton
              color="primary"
              size="small"
              onClick={() => {
                history('/games')
              }}
            >
              View
            </MDButton>
          </Grid>
        </Grid>
      )
      tempArr1.push(temp)
    })
    setCollection({
      columns: [
        { Header: 'SR.No', accessor: 'srno', align: 'center' },
        { Header: 'Date and Time', accessor: 'date', align: 'center' },
        { Header: 'Sports', accessor: 'game', align: 'center' },
        { Header: 'Tournament', accessor: 'event', align: 'left' },
        { Header: 'Action', accessor: 'action', width: '10%', align: 'center' },
      ],
      rows: tempArr1,
    })
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  // console.log(todayCricketMatchData);

  const handleSetFootballPlayer = async (e, value) => {
    setFootballPlayerTabValue(value)
  }

  const handleSetCricketPlayer = async (e, value) => {
    setCricketPlayerTabValue(value)
  }

  // console.log(cricketPlayerTabValue);

  // console.log(cricketSocket[0], cpData.id)

  return (
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
      <TabContext value={tabValue}>
        <Grid container spacing={3} justifyContent="end">
          <Grid item xs={12} md={12} lg={4} mb={2}>
            <Box>
              <TabList
                onChange={handleSetTabValue}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Cricket"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      sports_cricket_icon
                    </Icon>
                  }
                  value="1"
                />
                <Tab
                  label="Football"
                  value="2"
                  icon={
                    // <Icon fontSize="small" sx={{ mt: -0.25 }}>
                    //   sports_football_icon
                    // </Icon>
                    <img
                      src="/football.png"
                      alt="football"
                      width="15px"
                      style={{ marginRight: '5px', marginTop: '5px' }}
                    />
                  }
                />
              </TabList>
            </Box>
          </Grid>
        </Grid>
        <TabPanel value="1" sx={{ padding: 0 }}>
          <Select
            style={{ height: '45px' }}
            labelId="CricketGames"
            id="cricketgames"
            name={cricketGamesType}
            value={cricketGamesType}
            label="Tournament"
            onChange={(e) => {
              setCricketGamesType(e.target.value)
              setFootBallMatchId(e.target.value.id)
              getcricketmatch(e.target.value.id)
              setFootBallMatchName(e.target.value.name)
            }}
          >
            <MenuItem value="select">
              {' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexDirection: 'row',
                }}
              >
                Select Tournament
                <ArrowDropDownIcon
                  style={{ fontSize: '55px' }}
                ></ArrowDropDownIcon>
              </div>
            </MenuItem>
            {cricketData &&
              cricketData.length > 0 &&
              cricketData.map((name) => (
                <MenuItem value={name} key={name.id} style={{ gap: '15px' }}>
                  {name?.logo ? (
                    <img
                      src={name?.logo}
                      alt={name?.id}
                      width="25px"
                      height="25px"
                    />
                  ) : (
                    <h3>🏏</h3>
                  )}
                  {name.name}
                </MenuItem>
              ))}
          </Select>
          <>
            <MDBox py={3}>
              <Grid container spacing={3} mb={3}>
                {cpData && (
                  <Grid item xs={12} md={5} lg={5}>
                    <Card
                      sx={{
                        background: '#fff',
                        padding: '20px',
                        height: '100%',
                      }}
                    >
                      <MDBox mb={3}>
                        {cpData && (
                          <>
                            <div>
                              <div
                                style={{
                                  borderBottom: 'solid 1px #e1e1e1',
                                  padding: '20px 0',
                                }}
                              >
                                <Grid container justifyContent="center">
                                  <Grid
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    textAlign="left"
                                  >
                                    {cpData.status && (
                                      <MDButton color="warning" size="left">
                                        {cpData.status}
                                      </MDButton>
                                    )}
                                    {/*                                     
                                    {socketData.status === "completed" &&
                                      <MDButton color="success" size="left" sx={{ padding: '0 10px' }}>
                                        completed
                                      </MDButton>
                                    }
                                    {socketData.status === "not_started" &&
                                      <MDButton color="warning" size="left" >
                                        not started
                                      </MDButton>
                                    } */}
                                  </Grid>
                                  <Grid
                                    item
                                    xs={9}
                                    sm={8}
                                    md={9}
                                    lg={9}
                                    textAlign="center"
                                  >
                                    <h5>{cricketGamesType.name}</h5>
                                    {/* <h5>{fbpData?.venueData?.name },{fbpData?.venueData?.city},{fbpData?.venueData?.country }</h5> */}
                                    <h5>
                                      {moment(cpData?.matchTime * 1000)
                                        .local()
                                        .format('lll')}
                                    </h5>
                                  </Grid>
                                </Grid>
                              </div>
                              <Grid container spacing={3} sx={{ marginTop: 2 }}>
                                <Grid
                                  item
                                  xs={5}
                                  md={5}
                                  lg={5}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <img
                                    style={{
                                      width: '65px',
                                      height: '65px',
                                      margin: '0 auto',
                                    }}
                                    src={
                                      cpData?.homeTeamLogo
                                        ? `${cpData?.homeTeamLogo}`
                                        : img
                                    }
                                    alt={cpData?.homeTeamName}
                                  />
                                  <h5
                                    style={{
                                      marginTop: '5',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {cpData?.homeTeamName}
                                  </h5>
                                  {/* {socketData?.battingTeam == "a" ?
                                    <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting</h5> :
                                    <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling</h5>}
                                  {socketData?.a?.run_rate ?
                                    <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.a_1?.score_str}{""} run rate ({socketData?.a?.run_rate})
                                    </h6> : null} */}

                                  <Grid alignSelf="center" textAlign="center">
                                    {/* {
                                    ftballSocket[0] ===fbpData?.id ?
                                    <h3 style={{ fontSize: '15px' }}>{ ftballSocket[2][0]}</h3>:footBallScore[0]?.score!==undefined &&footBallScore[0].score[2][0]
                                  } */}
                                  </Grid>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  md={2}
                                  lg={2}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <h1>VS</h1>
                                  <br />
                                  {/* <h1>:</h1> */}
                                  {/* {socketData?.liveScore && <h3 style={{ fontSize: '15px' }}>{socketData?.liveScore?.runs}/{socketData?.liveScore?.wickets} ({socketData?.liveScore?.overs[0]}.{socketData?.liveScore?.overs[1]})</h3>} */}
                                </Grid>
                                <Grid
                                  item
                                  xs={5}
                                  md={5}
                                  lg={5}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <img
                                    style={{
                                      width: '65px',
                                      height: '65px',
                                      margin: '0 auto',
                                    }}
                                    src={
                                      cpData?.awayTeamLogo
                                        ? `${cpData?.awayTeamLogo}`
                                        : img
                                    }
                                    alt= {cpData?.awayTeamName}
                                  />
                                  <h5
                                    style={{
                                      marginTop: '5px',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {cpData?.awayTeamName}
                                  </h5>
                                  {/* {socketData?.battingTeam == "a" ?
                                    <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling </h5> :
                                    <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting </h5>}
                                  {socketData?.b?.run_rate ?
                                    <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.b_1?.score_str} {""} run rate ({socketData?.b?.run_rate})</h6>
                                    : null} */}

                                  <Grid alignSelf="center" textAlign="center">
                                    {/*                                 
                                {
                                    ftballSocket[0] ===fbpData?.id ?
                                    <h1 style={{ fontSize: '15px' }}>{ ftballSocket[3][0]}</h1>:footBallScore[0]?.score!==undefined &&footBallScore[0].score[3][0]
                                  } */}
                                  </Grid>
                                </Grid>

                                <Grid
                                  style={{ width: '100%', padding: '20px 0px',textAlign:'center',fontWeight:'800' }}
                                >
{cricketSocket.length !== 0 && idCheck === liveData?.id ?
               cricketSocket !== undefined && cricketSocket[4].innings.length ===2 &&
               cricketSocket[4]?.innings[1][0]===1 ?
               cricketSocket[4]?.innings[1][1]+"/"+cricketSocket[4]?.innings[1][3]+"("+cricketSocket[4]?.innings[1][2]+")":
               cricketSocket[4]?.innings[0][0]===1 ?
               cricketSocket[4]?.innings[0][1]+"/"+cricketSocket[4]?.innings[0][3]+"("+cricketSocket[4]?.innings[0][2]+")"
               :"0/0(0)":
               cricketApiSocket.length !== 0 && idCheck === liveData?.id && 
               cricketApiSocket !== undefined && cricketApiSocket[4].innings.length ===2 &&
               cricketApiSocket[4]?.innings[1][0]===1 ?
               cricketApiSocket[4]?.innings[1][1]+"/"+cricketApiSocket[4]?.innings[1][3]+"("+cricketApiSocket[4]?.innings[1][2]+")":
               cricketApiSocket[4]?.innings[0][0]===1 ?
               cricketApiSocket[4]?.innings[0][1]+"/"+cricketApiSocket[4]?.innings[0][3]+"("+cricketApiSocket[4]?.innings[0][2]+")"
               :"0/0(0)"}
&nbsp;
               vs&nbsp;

               {cricketSocket.length !== 0 && idCheck === liveData?.id ?
               cricketSocket !== undefined && cricketSocket[4].innings.length ===2 &&
               cricketSocket[4]?.innings[1][0]===2 ?
               cricketSocket[4]?.innings[1][1]+"/"+cricketSocket[4]?.innings[1][3]+"("+cricketSocket[4]?.innings[1][2]+")":
               cricketSocket[4]?.innings[0][0]===2 ?
               cricketSocket[4]?.innings[0][1]+"/"+cricketSocket[4]?.innings[0][3]+"("+cricketSocket[4]?.innings[0][2]+")"
               :"0/0(0)":
               cricketApiSocket.length !== 0 && idCheck === liveData?.id && 
               cricketApiSocket !== undefined && cricketApiSocket[4].innings.length ===2 &&
               cricketApiSocket[4]?.innings[1][0]===2 ?
               cricketApiSocket[4]?.innings[1][1]+"/"+cricketApiSocket[4]?.innings[1][3]+"("+cricketApiSocket[4]?.innings[1][2]+")":
               cricketApiSocket[4]?.innings[0][0]===2 ?
               cricketApiSocket[4]?.innings[0][1]+"/"+cricketApiSocket[4]?.innings[0][3]+"("+cricketApiSocket[4]?.innings[0][2]+")"
               :"0/0(0)"}


                                  {/* {cricketSocket.length !== 0 &&
                                  isCricketSocket? (
                                  
                                    <h1
                                      style={{
                                        fontSize: '25px',
                                        textAlign: 'center',
                                        display:'flex',
                                        alignItems:'center',
                                        gap:'10px',
                                        justifyContent:'center'
                                      }}
                                    >
                                    
                                      <p>
                                        {homeTeamScore
                                          ? homeTeamScore[1] +
                                            '/' +
                                            homeTeamScore[3] +
                                            '(' +
                                            homeTeamScore[2] +
                                            ')'
                                          : '0/0(0)'}
                                      </p>
                                      vs
                                      <p>
                                        {awayTeamScore
                                          ? awayTeamScore[1] +
                                            '/' +
                                            awayTeamScore[3] +
                                            '(' +
                                            awayTeamScore[2] +
                                            ')'
                                          : '0/0(0)'}
                                      </p>
                                    </h1>
                                  ) : (
                                    <h1
                                      style={{
                                        fontSize: '25px',
                                        textAlign: 'center',
                                        display:'flex',
                                        alignItems:'center',
                                        gap:'10px',
                                        justifyContent:'center'
                                      }}
                                    >
                                      <p>
                                        {homeTeamScore
                                          ? homeTeamScore[1] +
                                            '/' +
                                            homeTeamScore[3] +
                                            '(' +
                                            homeTeamScore[2] +
                                            ')'
                                          : '0/0(0)'}
                                      </p>
                                      vs
                                      <p>
                                        {awayTeamScore
                                          ? awayTeamScore[1] +
                                            '/' +
                                            awayTeamScore[3] +
                                            '(' +
                                            awayTeamScore[2] +
                                            ')'
                                          : '0/0(0)'}
                                      </p>
                                    </h1>
                                  )
                                  
                                  } */}

                                  {/* <TabContext value={cricketLiveTabValue} style={{gap:"20px",margin:'auto'}}>
                            <TabList onChange={handleSetCricketLiveTabValue} aria-label="lab API tabs example">
<Tab label="Players"
                  value="1"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      man
                    </Icon>
                  } />
              </TabList>
              </TabContext> */}
                                </Grid>
                                {/* {socketData?.winner === null ? null :
                                  <>
                                    <p>Winner :
                                      {socketData?.winner === 'a' ?
                                        <>{socketData?.teams?.a?.name}</> :
                                        <> {socketData?.teams?.b?.name}</>
                                      }
                                    </p>
                                  </>
                                } */}
                              </Grid>
                            </div>
                          </>
                        )}
                      </MDBox>
                    </Card>
                  </Grid>
                )}
                {cricketMatchData.length !== 0 ? (
                  <Grid item xs={12} md={6} lg={7}>
                    <Card px={3} style={{ height: '400px' }}>
                      <MDBox alignItems="center">
                        <div
                          id="style-2"
                          style={{ height: '400px', overflow: 'auto' }}
                        >
                          <MDBox>
                            <MDTypography variant="h6" gutterBottom p={3}>
                              Today Matches
                            </MDTypography>
                          </MDBox>
                          <Grid container spacing={2} px={3}>
                            {cricketMatchData.map((element, index) => (
                              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <Card style={{ boxShadow: '0px 0px 2px grey' }}>
                                  <MDBox
                                    display="flex"
                                    justifyContent="space-between"
                                    pt={1}
                                    px={2}
                                  >
                                    <MDBox
                                      variant="gradient"
                                      bgColor="success"
                                      color="white"
                                      coloredShadow="success"
                                      borderRadius="xl"
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      width="4rem"
                                      height="4rem"
                                      mb={3}
                                    >
                                      <img
                                        src="/cricket.png"
                                        alt="football"
                                        width="40px"
                                      />
                                      {/* <Icon fontSize="medium" color="inherit" >
                                      sports_football_icon
                                      </Icon> */}
                                    </MDBox>
                                    <MDBox
                                      textAlign="center"
                                      lineHeight={1.25}
                                      sx={{ width: '100%' }}
                                    >
                                      <MDTypography
                                        variant="button"
                                        fontWeight="bold"
                                        color="dark"
                                      >
                                        {element.awayTeamName} vs{' '}
                                        {element?.homeTeamName}
                                      </MDTypography>
                                      <Grid
                                        item
                                        xs={8}
                                        md={8}
                                        lg={8}
                                        alignSelf="center"
                                      >
                                        <MDTypography
                                          component="h6"
                                          fontWeight="bold"
                                          variant="button"
                                          color="primary"
                                        >
                                          {moment(element.matchTime * 1000)
                                            .local()
                                            .format('lll')}
                                        </MDTypography>
                                        <MDTypography
                                          component="h6"
                                          fontWeight="bold"
                                          variant="button"
                                        >
                                          status - {element?.status}
                                        </MDTypography>
                                      </Grid>
                                    </MDBox>
                                  </MDBox>
                                  <Divider />
                                  <MDBox pb={2} px={2}>
                                    <Grid container spacing={1}>
                                      <Grid spacing={1}>
                                      <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
                                      Send Notification
                                     </MDButton>
                                      </Grid>
                                      <Grid spacing={1}>
                                        <MDButton
                                          color="success"
                                          size="left"
                                          sx={{ margin: '10px 0px' }}
                                          onClick={() => {
                                            setBetAmountCricket(element)
                                          }}
                                        >
                                          Set Betamount
                                        </MDButton>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={4}
                                        md={4}
                                        lg={4}
                                        textAlign="right"
                                      >
                                        <MDButton
                                          color="dark"
                                          size="left"
                                          onClick={() => {
                                            setcpData(element)
                                            callCricketAPI(element)
                                          }}
                                        >
                                          View
                                        </MDButton>
                                      </Grid>
                                    </Grid>
                                    <Modal
                                      open={open}
                                      onClose={handleClose}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <Box sx={style}>
                                        <label
                                          style={{ padding: '0 20px 0px' }}
                                        >
                                          Bet Details
                                        </label>
                                        <form onSubmit={formik.handleSubmit}>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="bet_amount"
                                                  name="bet_amount"
                                                  label="Bet Amount"
                                                  variant="outlined"
                                                  // defaultValue={price}
                                                  value={userdataa?.bet_amount}
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      bet_amount:
                                                        e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                  // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
                                                  // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="winning_price"
                                                  name="winning_price"
                                                  label="Winning Price"
                                                  variant="outlined"
                                                  value={
                                                    userdataa?.winning_price
                                                  }
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      winning_price:
                                                        e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="bet_limit"
                                                  name="bet_limit"
                                                  label="Bet Limit"
                                                  variant="outlined"
                                                  value={userdataa.bet_limit}
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      bet_limit: e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <FormControl fullWidth>
                                                  <InputLabel id="Matches">
                                                    Fee Type
                                                  </InputLabel>
                                                  <Select
                                                    style={{ height: '45px' }}
                                                    labelId="feetype"
                                                    id="feetype"
                                                    label="Fee Type"
                                                    value={userdataa.feetype}
                                                    onChange={(e) => {
                                                      setUserdataa({
                                                        ...userdataa,
                                                        feetype: e.target.value,
                                                      })

                                                      setWithdrawtype(
                                                        e.target.value,
                                                      )
                                                      percentageCalculate(
                                                        e.target.value,
                                                      )
                                                    }}
                                                  >
                                                    <MenuItem value="fixed">
                                                      Fixed
                                                    </MenuItem>
                                                    <MenuItem value="percentage">
                                                      Percentage
                                                    </MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          {isPercentage ? (
                                            <Grid
                                              container
                                              spacing={2}
                                              mr={3}
                                              px={3}
                                            >
                                              <Grid item xs={12}>
                                                <MDBox mt={2}>
                                                  <TextField
                                                    fullWidth
                                                    id="fee_percentage"
                                                    name="fee_percentage"
                                                    variant="outlined"
                                                    label="Fee Percentage"
                                                    onChange={(e) => {
                                                      setUserdataa({
                                                        ...userdataa,
                                                        fee_percentage:
                                                          e.target.value,
                                                        id: fbpData?.id,
                                                        home_team_name:
                                                          fbpData?.homeTeamName,
                                                        away_team_name:
                                                          fbpData?.awayTeamName,
                                                      })
                                                      formik.handleChange(e)
                                                    }}
                                                    // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                                                    // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                                                  />
                                                </MDBox>
                                              </Grid>
                                            </Grid>
                                          ) : null}
                                          <Grid
                                            container
                                            spacing={6}
                                            mr={3}
                                            px={3}
                                            sx={{ marginTop: '10px' }}
                                          >
                                            <Grid
                                              item
                                              xs={12}
                                              md={6}
                                              sx={{
                                                paddingTop: '10px!important',
                                              }}
                                            >
                                              <MDButton
                                                variant="gradient"
                                                color="dark"
                                                onClick={(e) => {
                                                  formik.resetForm()
                                                  handleClose()
                                                }}
                                                fullWidth
                                              >
                                                Back
                                              </MDButton>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={12}
                                              md={6}
                                              sx={{
                                                paddingTop: '10px!important',
                                              }}
                                            >
                                              <MDButton
                                                variant="gradient"
                                                color="info"
                                                type="submit"
                                                fullWidth
                                              >
                                                Update
                                              </MDButton>
                                            </Grid>
                                          </Grid>
                                        </form>
                                      </Box>
                                    </Modal>
                                  </MDBox>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                      </MDBox>
                    </Card>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} lg={7}>
                    <Card px={3} style={{ height: '400px' }}>
                      <MDBox alignItems="center">
                        <div
                          id="style-2"
                          style={{ height: '400px', overflow: 'auto' }}
                        >
                          <MDBox>
                            <MDTypography variant="h6" gutterBottom p={3}>
                              Current Matches
                            </MDTypography>
                          </MDBox>
                          <Grid container spacing={2} px={3}>
                            {todayCricketMatchData.length !== 0 ? (
                              todayCricketMatchData.map((element, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                  style={{
                                    boxShadow: '0px 0px 2px grey',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    margin: '20px',
                                  }}
                                >
                                  <MDTypography
                                    variant="button"
                                    fontWeight="bold"
                                    color="dark"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0px 0px 0px grey',
                                      borderRadius: '10px',
                                    }}
                                  >
                                    <img
                                      src={`${
                                        element.tournament_logo
                                          ? element.tournament_logo
                                          : '/dummyFlag.png'
                                      }`}
                                      alt={element.tournament_name}
                                      style={{ width: '50px', height: '50px' }}
                                    />{' '}
                                    &nbsp;&nbsp;&nbsp; {element.tournament_name}
                                  </MDTypography>
                                  <Grid
                                    container
                                    spacing={2}
                                    px={3}
                                    style={{ marginTop: '20px' }}
                                  >
                                    {element.data.map((element, index) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Card
                                          style={{
                                            boxShadow: '0px 0px 2px grey',
                                          }}
                                        >
                                          <MDBox
                                            display="flex"
                                            justifyContent="space-between"
                                            pt={1}
                                            px={2}
                                          >
                                            <MDBox
                                              variant="gradient"
                                              bgColor="success"
                                              color="white"
                                              coloredShadow="success"
                                              borderRadius="xl"
                                              display="flex"
                                              justifyContent="center"
                                              alignItems="center"
                                              width="4rem"
                                              height="4rem"
                                              mb={3}
                                            >
                                              {/* <Icon fontSize="medium" color="inherit" >
                                                        sports_football_icon
                                                        </Icon> */}
                                              <img
                                                src="/cricket.png"
                                                alt="football"
                                                width="40px"
                                              />
                                            </MDBox>
                                            <MDBox
                                              textAlign="center"
                                              lineHeight={1.25}
                                              sx={{
                                                width: '100%',
                                                textAlign: 'left',
                                                marginLeft: '20px',
                                              }}
                                            >
                                              <MDTypography
                                                variant="button"
                                                fontWeight="bold"
                                                color="dark"
                                              >
                                                {element.homeTeamName} vs{' '}
                                                {element?.awayTeamName}
                                              </MDTypography>
                                              <Grid
                                                item
                                                xs={8}
                                                md={8}
                                                lg={8}
                                                alignSelf="center"
                                              >
                                                <MDTypography
                                                  component="h6"
                                                  fontWeight="bold"
                                                  variant="button"
                                                  color="primary"
                                                >
                                                  {moment(
                                                    element.matchTime * 1000,
                                                  )
                                                    .local()
                                                    .format('lll')}
                                                </MDTypography>
                                                <MDTypography
                                                  component="h6"
                                                  fontWeight="bold"
                                                  variant="button"
                                                >
                                                  status - {element?.status}
                                                </MDTypography>
                                              </Grid>
                                            </MDBox>
                                          </MDBox>
                                          {/* <Divider /> */}
                                          <MDBox pb={2} px={2}>
                                            <Grid container spacing={1}>
                                              <Grid spacing={1}>
                                                        <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
                                                        Send Notification
                                                       </MDButton>
                                                        </Grid>
                                              {/* <Grid spacing={1}>
                                                        <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={()=>{setBetAmountFootball(element)}}>
                                                        Set Betamount
                                                       </MDButton>
                                                        </Grid> */}
                                              <Grid textAlign="right">
                                                <MDButton
                                                  color="dark"
                                                  size="left"
                                                  onClick={() => {
                                                    setcpData(element)
                                                    callCricketAPI(element)
                                                  }}
                                                >
                                                  View
                                                </MDButton>
                                              </Grid>
                                            </Grid>
                                            <Modal
                                              open={open}
                                              onClose={handleClose}
                                              aria-labelledby="modal-modal-title"
                                              aria-describedby="modal-modal-description"
                                            >
                                              <Box sx={style}>
                                                <label
                                                  style={{
                                                    padding: '0 20px 0px',
                                                  }}
                                                >
                                                  Bet Details
                                                </label>
                                                <form
                                                  onSubmit={formik.handleSubmit}
                                                >
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="bet_amount"
                                                          name="bet_amount"
                                                          label="Bet Amount"
                                                          variant="outlined"
                                                          // defaultValue={price}
                                                          value={
                                                            userdataa?.bet_amount
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              bet_amount:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                          // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
                                                          // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="winning_price"
                                                          name="winning_price"
                                                          label="Winning Price"
                                                          variant="outlined"
                                                          value={
                                                            userdataa?.winning_price
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              winning_price:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="bet_limit"
                                                          name="bet_limit"
                                                          label="Bet Limit"
                                                          variant="outlined"
                                                          value={
                                                            userdataa.bet_limit
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              bet_limit:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <FormControl fullWidth>
                                                          <InputLabel id="Matches">
                                                            Fee Type
                                                          </InputLabel>
                                                          <Select
                                                            style={{
                                                              height: '45px',
                                                            }}
                                                            labelId="feetype"
                                                            id="feetype"
                                                            label="Fee Type"
                                                            value={
                                                              userdataa.feetype
                                                            }
                                                            onChange={(e) => {
                                                              setUserdataa({
                                                                ...userdataa,
                                                                feetype:
                                                                  e.target
                                                                    .value,
                                                              })

                                                              setWithdrawtype(
                                                                e.target.value,
                                                              )
                                                              percentageCalculate(
                                                                e.target.value,
                                                              )
                                                            }}
                                                          >
                                                            <MenuItem value="fixed">
                                                              Fixed
                                                            </MenuItem>
                                                            <MenuItem value="percentage">
                                                              Percentage
                                                            </MenuItem>
                                                          </Select>
                                                        </FormControl>
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  {isPercentage ? (
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      mr={3}
                                                      px={3}
                                                    >
                                                      <Grid item xs={12}>
                                                        <MDBox mt={2}>
                                                          <TextField
                                                            fullWidth
                                                            id="fee_percentage"
                                                            name="fee_percentage"
                                                            variant="outlined"
                                                            label="Fee Percentage"
                                                            onChange={(e) => {
                                                              setUserdataa({
                                                                ...userdataa,
                                                                fee_percentage:
                                                                  e.target
                                                                    .value,
                                                                id: fbpData?.id,
                                                                home_team_name:
                                                                  fbpData?.homeTeamName,
                                                                away_team_name:
                                                                  fbpData?.awayTeamName,
                                                              })
                                                              formik.handleChange(
                                                                e,
                                                              )
                                                            }}
                                                            // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                                                            // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                                                          />
                                                        </MDBox>
                                                      </Grid>
                                                    </Grid>
                                                  ) : null}
                                                  <Grid
                                                    container
                                                    spacing={6}
                                                    mr={3}
                                                    px={3}
                                                    sx={{ marginTop: '10px' }}
                                                  >
                                                    <Grid
                                                      item
                                                      xs={12}
                                                      md={6}
                                                      sx={{
                                                        paddingTop:
                                                          '10px!important',
                                                      }}
                                                    >
                                                      <MDButton
                                                        variant="gradient"
                                                        color="dark"
                                                        onClick={(e) => {
                                                          formik.resetForm()
                                                          handleClose()
                                                        }}
                                                        fullWidth
                                                      >
                                                        Back
                                                      </MDButton>
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      xs={12}
                                                      md={6}
                                                      sx={{
                                                        paddingTop:
                                                          '10px!important',
                                                      }}
                                                    >
                                                      <MDButton
                                                        variant="gradient"
                                                        color="info"
                                                        type="submit"
                                                        fullWidth
                                                      >
                                                        Update
                                                      </MDButton>
                                                    </Grid>
                                                  </Grid>
                                                </form>
                                              </Box>
                                            </Modal>
                                          </MDBox>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Grid>
                              ))
                            ) : (
                              <h3
                                style={{
                                  position: 'absolute',
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%,-50%)',
                                }}
                              >
                                No Live Matches...
                              </h3>
                            )}
                          </Grid>
                        </div>
                      </MDBox>
                    </Card>
                  </Grid>
                )}

                <Grid item xs={12} md={12} lg={12} xl={12}>
                  {cricketPlayers !== undefined && (
                    <Card
                      px={3}
                      style={{ height: 'max-content', padding: '30px' }}
                    >
                      <MDBox alignItems="center">
                        <TabContext value={cricketPlayerTabValue}>
                          <TabList
                            onChange={handleSetCricketPlayer}
                            aria-label="lab API tabs example"
                          >
                            <Tab label="Home" value="1" />
                            <Tab label="Away" value="2" />
                          </TabList>
                        </TabContext>

                        {
                          cricketPlayerTabValue === '1' &&
                            cricketPlayers !== undefined &&
                            cricketPlayers[0]?.home && (
                              <div>
                                <table style={{ width: '100%' }}>
                                  <thead>
                                    <tr>
                                      <td
                                        style={{
                                          textAlign: 'center',
                                          color: 'black',
                                          fontWeight: '600',
                                        }}
                                      >
                                        SI.No.
                                      </td>
                                      <td
                                        style={{
                                          padding: '0px 50px',
                                          color: 'black',
                                          fontWeight: '600',
                                        }}
                                      >
                                        Name
                                      </td>
                                      <td
                                        style={{
                                          textAlign: 'center',
                                          color: 'black',
                                          fontWeight: '600',
                                        }}
                                      >
                                        Shirt Number
                                      </td>
                                      <td
                                        style={{
                                          textAlign: 'center',
                                          color: 'black',
                                          fontWeight: '600',
                                        }}
                                      >
                                        Position
                                      </td>
                                      <td
                                        style={{
                                          textAlign: 'center',
                                          color: 'black',
                                          fontWeight: '600',
                                        }}
                                      >
                                        Rating
                                      </td>
                                    </tr>
                                  </thead>
                                  {cricketPlayers !== undefined &&
                                    cricketPlayers[0]?.home?.map((item, i) => {
                                      return (
                                        <tr>
                                          <td style={{ textAlign: 'center' }}>
                                            {i + 1}
                                          </td>
                                          <td
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '10px',
                                              padding: '10px 50px',
                                              textAlign: 'center',
                                            }}
                                          >
                                            <img
                                              src={
                                                item?.logo
                                                  ? item?.logo
                                                  : '/dummyFlag.png'
                                              }
                                              alt={item.name}
                                              style={{
                                                width: '40px',
                                                background: 'red',
                                                borderRadius: '50%',
                                                padding: '5px',
                                              }}
                                            />

                                            {item.name}
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            {item.short_name}
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            {moment(
                                              item?.birthday * 1000,
                                            ).format('YYYY/MM/DD')}
                                          </td>
                                          {/* <td  style={{textAlign:'center'}}>
{item.position}
</td>
<td  style={{textAlign:'center'}}>
{item.rating}
</td> */}
                                        </tr>
                                      )
                                    })}
                                </table>
                              </div>
                            )
                          // :
                          // <h4 style={{textAlign:'center',padding:'100px 0px'}}>
                          //  No Data Found!...
                          // </h4>
                        }

                        {cricketPlayerTabValue === '2' &&
                          cricketPlayers !== undefined &&
                          cricketPlayers[1]?.away && (
                            <div>
                              <table style={{ width: '100%' }}>
                                <thead>
                                  <tr>
                                    <td
                                      style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '600',
                                      }}
                                    >
                                      SI.No.
                                    </td>
                                    <td
                                      style={{
                                        padding: '0px 50px',
                                        color: 'black',
                                        fontWeight: '600',
                                      }}
                                    >
                                      Name
                                    </td>
                                    <td
                                      style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '600',
                                      }}
                                    >
                                      Shirt Number
                                    </td>
                                    <td
                                      style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '600',
                                      }}
                                    >
                                      Position
                                    </td>
                                    <td
                                      style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '600',
                                      }}
                                    >
                                      Rating
                                    </td>
                                  </tr>
                                </thead>
                                {cricketPlayers !== undefined &&
                                  cricketPlayers[1]?.away?.map((item, i) => {
                                    return (
                                      <tr>
                                        <td style={{ textAlign: 'center' }}>
                                          {i + 1}
                                        </td>
                                        <td
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 50px',
                                            textAlign: 'center',
                                          }}
                                        >
                                          <img
                                            src={
                                              item?.logo
                                                ? item?.logo
                                                : '/dummyFlag.png'
                                            }
                                            alt={item.name}
                                            style={{
                                              width: '40px',
                                              background: 'yellow',
                                              borderRadius: '50%',
                                              padding: '5px',
                                            }}
                                          />

                                          {item.name}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          {item.short_name}
                                        </td>

                                        <td style={{ textAlign: 'center' }}>
                                          {moment(item?.birthday * 1000).format(
                                            'YYYY/MM/DD',
                                          )}
                                        </td>
                                        {/* <td  style={{textAlign:'center'}}>
{item.rating}
</td> */}
                                      </tr>
                                    )
                                  })}
                              </table>
                            </div>
                          )}
                      </MDBox>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </MDBox>
          </>
        </TabPanel>
        <TabPanel value="2" sx={{ padding: 0 }}>
          {/* Coming soon */}
          <Select
            style={{ height: '45px' }}
            labelId="Games"
            id="games"
            name={GamesType}
            value={GamesType}
            label="Tournament"
            onChange={(e) => {
              setGamesType(e.target.value)
              setFootBallMatchId(e.target.value.id)
              getfootballmatch(e.target.value.id)
              setFootBallMatchName(e.target.value.name)
            }}
          >
            <MenuItem value="select">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexDirection: 'row',
                }}
              >
                Select Tournament
                <ArrowDropDownIcon
                  style={{ fontSize: '55px' }}
                ></ArrowDropDownIcon>
              </div>
            </MenuItem>
            {footBallData &&
              footBallData.length > 0 &&
              footBallData.map((name) => (
                <MenuItem value={name} key={name.id} style={{ gap: '15px' }}>
                  {name?.logo ? (
                    <img
                      src={name?.logo ? name?.logo : null}
                      alt={name?.id}
                      width="25px"
                      height="25px"
                    />
                  ) : (
                    <h3>⚽</h3>
                  )}
                  {name.name}
                </MenuItem>
              ))}
          </Select>
          <>
            <MDBox py={3}>
              <Grid container spacing={3} mb={3}>
                {fbpData && (
                  <Grid item xs={12} md={5} lg={5}>
                    <Card
                      sx={{
                        background: '#fff',
                        padding: '20px',
                        height: '100%',
                      }}
                    >
                      <MDBox mb={3}>
                        {fbpData && (
                          <>
                            <div>
                              <div
                                style={{
                                  borderBottom: 'solid 1px #e1e1e1',
                                  padding: '20px 0',
                                }}
                              >
                                <Grid container justifyContent="center">
                                  <Grid
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    textAlign="left"
                                  >
                                    {fbpData.status && (
                                      <MDButton color="warning" size="left">
                                        {fbpData.status}
                                      </MDButton>
                                    )}
                                    {/*                                     
                                    {socketData.status === "completed" &&
                                      <MDButton color="success" size="left" sx={{ padding: '0 10px' }}>
                                        completed
                                      </MDButton>
                                    }
                                    {socketData.status === "not_started" &&
                                      <MDButton color="warning" size="left" >
                                        not started
                                      </MDButton>
                                    } */}
                                  </Grid>
                                  <Grid
                                    item
                                    xs={9}
                                    sm={8}
                                    md={9}
                                    lg={9}
                                    textAlign="center"
                                  >
                                    <h5>{GamesType.name}</h5>
                                    {/* <h5>{fbpData?.venueData?.name },{fbpData?.venueData?.city},{fbpData?.venueData?.country }</h5> */}
                                    <h5>
                                      {moment(fbpData?.matchTime * 1000)
                                        .local()
                                        .format('lll')}
                                    </h5>
                                  </Grid>
                                </Grid>
                              </div>
                              <Grid container spacing={3} sx={{ marginTop: 2 }}>
                                <Grid
                                  item
                                  xs={5}
                                  md={5}
                                  lg={5}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <img
                                    style={{
                                      width: '65px',
                                      height: '65px',
                                      margin: '0 auto',
                                    }}
                                    src={
                                      fbpData?.homeTeamLogo
                                        ? `${fbpData?.homeTeamLogo}`
                                        : img
                                    }
                                    alt="football"
                                  />
                                  <h5
                                    style={{
                                      marginTop: '5',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {fbpData?.homeTeamName}
                                  </h5>
                                  {/* {socketData?.battingTeam == "a" ?
                                    <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting</h5> :
                                    <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling</h5>}
                                  {socketData?.a?.run_rate ?
                                    <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.a_1?.score_str}{""} run rate ({socketData?.a?.run_rate})
                                    </h6> : null} */}

                                  <Grid alignSelf="center" textAlign="center">
                                    {ftballSocket[0] === fbpData?.id ? (
                                      <h3 style={{ fontSize: '15px' }}>
                                        {ftballSocket[2][0]}
                                      </h3>
                                    ) : (
                                      footBallScore[0]?.score !== undefined &&
                                      footBallScore[0].score[2][0]
                                    )}
                                  </Grid>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  md={2}
                                  lg={2}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <h1>VS</h1>
                                  <br />
                                  <h1>:</h1>
                                  {/* {socketData?.liveScore && <h3 style={{ fontSize: '15px' }}>{socketData?.liveScore?.runs}/{socketData?.liveScore?.wickets} ({socketData?.liveScore?.overs[0]}.{socketData?.liveScore?.overs[1]})</h3>} */}
                                </Grid>
                                <Grid
                                  item
                                  xs={5}
                                  md={5}
                                  lg={5}
                                  alignSelf="center"
                                  textAlign="center"
                                >
                                  <img
                                    style={{
                                      width: '65px',
                                      height: '65px',
                                      margin: '0 auto',
                                    }}
                                    src={
                                      fbpData?.awayTeamLogo
                                        ? `${fbpData?.awayTeamLogo}`
                                        : img
                                    }
                                    alt="football"
                                  />
                                  <h5
                                    style={{
                                      marginTop: '5px',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {fbpData?.awayTeamName}
                                  </h5>
                                  {/* {socketData?.battingTeam == "a" ?
                                    <h5 style={{ background: "rgb(223 40 105)", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Bowling </h5> :
                                    <h5 style={{ background: "#fc930a", display: 'inline', padding: '3px 10px', borderRadius: "5px", color: '#fff', fontWeight: '500' }}>Batting </h5>}
                                  {socketData?.b?.run_rate ?
                                    <h6 style={{ marginTop: '5px' }}>{socketData?.innings?.b_1?.score_str} {""} run rate ({socketData?.b?.run_rate})</h6>
                                    : null} */}

                                  <Grid alignSelf="center" textAlign="center">
                                    {ftballSocket[0] === fbpData?.id ? (
                                      <h1 style={{ fontSize: '15px' }}>
                                        {ftballSocket[3][0]}
                                      </h1>
                                    ) : (
                                      footBallScore[0]?.score !== undefined &&
                                      footBallScore[0].score[3][0]
                                    )}
                                  </Grid>
                                </Grid>
                                {/* {socketData?.winner === null ? null :
                                  <>
                                    <p>Winner :
                                      {socketData?.winner === 'a' ?
                                        <>{socketData?.teams?.a?.name}</> :
                                        <> {socketData?.teams?.b?.name}</>
                                      }
                                    </p>
                                  </>
                                } */}
                              </Grid>
                            </div>
                            <TabContext
                              value={liveTabValue}
                              style={{ gap: '20px' }}
                            >
                              <TabList
                                onChange={handleSetLiveTabValue}
                                aria-label="lab API tabs example"
                              >
                                <Tab
                                  label="Overview"
                                  icon={
                                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                      schema_icon
                                    </Icon>
                                  }
                                  value="1"
                                />
                                <Tab
                                  label="Live Tracker"
                                  value="2"
                                  icon={
                                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                      live_tv_icon
                                    </Icon>
                                  }
                                />
                                <Tab
                                  label="Players"
                                  value="3"
                                  icon={
                                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                      man
                                    </Icon>
                                  }
                                />
                              </TabList>
                            </TabContext>
                          </>
                        )}
                      </MDBox>
                    </Card>
                  </Grid>
                )}
                {footBallMatchData.length !== 0 ? (
                  <Grid item xs={12} md={6} lg={7}>
                    <Card px={3} style={{ height: '400px' }}>
                      <MDBox alignItems="center">
                        <div
                          id="style-2"
                          style={{ height: '400px', overflow: 'auto' }}
                        >
                          <MDBox>
                            <MDTypography variant="h6" gutterBottom p={3}>
                              Today Matches
                            </MDTypography>
                          </MDBox>
                          <Grid container spacing={2} px={3}>
                            {footBallMatchData.map((element, index) => (
                              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <Card style={{ boxShadow: '0px 0px 2px grey' }}>
                                  <MDBox
                                    display="flex"
                                    justifyContent="space-between"
                                    pt={1}
                                    px={2}
                                  >
                                    <MDBox
                                      variant="gradient"
                                      bgColor="success"
                                      color="white"
                                      coloredShadow="success"
                                      borderRadius="xl"
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      width="4rem"
                                      height="4rem"
                                      mb={3}
                                    >
                                      <img
                                        src="/football.png"
                                        alt="football"
                                        width="40px"
                                      />
                                      {/* <Icon fontSize="medium" color="inherit" >
                                      sports_football_icon
                                      </Icon> */}
                                    </MDBox>
                                    <MDBox
                                      textAlign="center"
                                      lineHeight={1.25}
                                      sx={{
                                        width: '100%',
                                        textAlign: 'left',
                                        marginLeft: '20px',
                                      }}
                                    >
                                      <MDTypography
                                        variant="button"
                                        fontWeight="bold"
                                        color="dark"
                                      >
                                        {element.homeTeamName} vs{' '}
                                        {element?.awayTeamName}
                                      </MDTypography>
                                      <Grid
                                        item
                                        xs={8}
                                        md={8}
                                        lg={8}
                                        alignSelf="center"
                                      >
                                        <MDTypography
                                          component="h6"
                                          fontWeight="bold"
                                          variant="button"
                                          color="primary"
                                        >
                                          {moment(element.matchTime * 1000)
                                            .local()
                                            .format('lll')}
                                        </MDTypography>
                                        <MDTypography
                                          component="h6"
                                          fontWeight="bold"
                                          variant="button"
                                        >
                                          status - {element?.status}
                                        </MDTypography>
                                      </Grid>
                                    </MDBox>
                                  </MDBox>
                                  <Divider />
                                  <MDBox pb={2} px={2}>
                                    <Grid container spacing={1}>
                                      <Grid spacing={1}>
                                      <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
                                      Send Notification
                                     </MDButton>
                                      </Grid>
                                      <Grid spacing={1}>
                                        <MDButton
                                          color="success"
                                          size="left"
                                          sx={{ margin: '10px 0px' }}
                                          onClick={() => {
                                            setBetAmountFootball(element)
                                          }}
                                        >
                                          Set Betamount
                                        </MDButton>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={4}
                                        md={4}
                                        lg={4}
                                        textAlign="right"
                                      >
                                        <MDButton
                                          color="dark"
                                          size="left"
                                          onClick={() => {
                                            setFbpData(element)
                                            getFootBallScore(element)
                                          }}
                                        >
                                          View
                                        </MDButton>
                                      </Grid>
                                    </Grid>
                                    <Modal
                                      open={open}
                                      onClose={handleClose}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                    >
                                      <Box sx={style}>
                                        <label
                                          style={{ padding: '0 20px 0px' }}
                                        >
                                          Bet Details
                                        </label>
                                        <form onSubmit={formik.handleSubmit}>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="bet_amount"
                                                  name="bet_amount"
                                                  label="Bet Amount"
                                                  variant="outlined"
                                                  // defaultValue={price}
                                                  value={userdataa?.bet_amount}
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      bet_amount:
                                                        e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                  // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
                                                  // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="winning_price"
                                                  name="winning_price"
                                                  label="Winning Price"
                                                  variant="outlined"
                                                  value={
                                                    userdataa?.winning_price
                                                  }
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      winning_price:
                                                        e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <TextField
                                                  fullWidth
                                                  id="bet_limit"
                                                  name="bet_limit"
                                                  label="Bet Limit"
                                                  variant="outlined"
                                                  value={userdataa.bet_limit}
                                                  onChange={(e) => {
                                                    setUserdataa({
                                                      ...userdataa,
                                                      bet_limit: e.target.value,
                                                    })
                                                    formik.handleChange(e)
                                                  }}
                                                />
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={2}
                                            mr={3}
                                            px={3}
                                          >
                                            <Grid item xs={12}>
                                              <MDBox mt={2}>
                                                <FormControl fullWidth>
                                                  <InputLabel id="Matches">
                                                    Fee Type
                                                  </InputLabel>
                                                  <Select
                                                    style={{ height: '45px' }}
                                                    labelId="feetype"
                                                    id="feetype"
                                                    label="Fee Type"
                                                    value={userdataa.feetype}
                                                    onChange={(e) => {
                                                      setUserdataa({
                                                        ...userdataa,
                                                        feetype: e.target.value,
                                                      })

                                                      setWithdrawtype(
                                                        e.target.value,
                                                      )
                                                      percentageCalculate(
                                                        e.target.value,
                                                      )
                                                    }}
                                                  >
                                                    <MenuItem value="fixed">
                                                      Fixed
                                                    </MenuItem>
                                                    <MenuItem value="percentage">
                                                      Percentage
                                                    </MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </MDBox>
                                            </Grid>
                                          </Grid>
                                          {isPercentage ? (
                                            <Grid
                                              container
                                              spacing={2}
                                              mr={3}
                                              px={3}
                                            >
                                              <Grid item xs={12}>
                                                <MDBox mt={2}>
                                                  <TextField
                                                    fullWidth
                                                    id="fee_percentage"
                                                    name="fee_percentage"
                                                    variant="outlined"
                                                    label="Fee Percentage"
                                                    onChange={(e) => {
                                                      setUserdataa({
                                                        ...userdataa,
                                                        fee_percentage:
                                                          e.target.value,
                                                        id: fbpData?.id,
                                                        home_team_name:
                                                          fbpData?.homeTeamName,
                                                        away_team_name:
                                                          fbpData?.awayTeamName,
                                                      })
                                                      formik.handleChange(e)
                                                    }}
                                                    // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                                                    // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                                                  />
                                                </MDBox>
                                              </Grid>
                                            </Grid>
                                          ) : null}
                                          <Grid
                                            container
                                            spacing={6}
                                            mr={3}
                                            px={3}
                                            sx={{ marginTop: '10px' }}
                                          >
                                            <Grid
                                              item
                                              xs={12}
                                              md={6}
                                              sx={{
                                                paddingTop: '10px!important',
                                              }}
                                            >
                                              <MDButton
                                                variant="gradient"
                                                color="dark"
                                                onClick={(e) => {
                                                  formik.resetForm()
                                                  handleClose()
                                                }}
                                                fullWidth
                                              >
                                                Back
                                              </MDButton>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={12}
                                              md={6}
                                              sx={{
                                                paddingTop: '10px!important',
                                              }}
                                            >
                                              <MDButton
                                                variant="gradient"
                                                color="info"
                                                type="submit"
                                                fullWidth
                                              >
                                                Update
                                              </MDButton>
                                            </Grid>
                                          </Grid>
                                        </form>
                                      </Box>
                                    </Modal>
                                  </MDBox>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </div>
                      </MDBox>
                    </Card>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6} lg={7}>
                    <Card px={3} style={{ height: '400px' }}>
                      <MDBox alignItems="center">
                        <div
                          id="style-2"
                          style={{ height: '400px', overflow: 'auto' }}
                        >
                          <MDBox>
                            <MDTypography variant="h6" gutterBottom p={3}>
                              Current Matches
                            </MDTypography>
                          </MDBox>
                          <Grid container spacing={2} px={3}>
                            {todayFootBallMatchData.length !== 0 ? (
                              todayFootBallMatchData.map((element, index) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                  style={{
                                    boxShadow: '0px 0px 2px grey',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    margin: '20px',
                                  }}
                                >
                                  <MDTypography
                                    variant="button"
                                    fontWeight="bold"
                                    color="dark"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0px 0px 0px grey',
                                      borderRadius: '10px',
                                    }}
                                  >
                                    <img
                                      src={`${element.tournament_logo}`}
                                      alt={element.tournament_name}
                                      style={{ width: '50px', height: '50px' }}
                                    />{' '}
                                    &nbsp;&nbsp;&nbsp; {element.tournament_name}
                                  </MDTypography>
                                  <Grid
                                    container
                                    spacing={2}
                                    px={3}
                                    style={{ marginTop: '20px' }}
                                  >
                                    {element.data.map((element, index) => (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Card
                                          style={{
                                            boxShadow: '0px 0px 2px grey',
                                          }}
                                        >
                                          <MDBox
                                            display="flex"
                                            justifyContent="space-between"
                                            pt={1}
                                            px={2}
                                          >
                                            <MDBox
                                              variant="gradient"
                                              bgColor="success"
                                              color="white"
                                              coloredShadow="success"
                                              borderRadius="xl"
                                              display="flex"
                                              justifyContent="center"
                                              alignItems="center"
                                              width="4rem"
                                              height="4rem"
                                              mb={3}
                                            >
                                              {/* <Icon fontSize="medium" color="inherit" >
                                      sports_football_icon
                                      </Icon> */}
                                              <img
                                                src="/football.png"
                                                alt="football"
                                                width="40px"
                                              />
                                            </MDBox>
                                            <MDBox
                                              textAlign="center"
                                              lineHeight={1.25}
                                              sx={{
                                                width: '100%',
                                                textAlign: 'left',
                                                marginLeft: '20px',
                                              }}
                                            >
                                              <MDTypography
                                                variant="button"
                                                fontWeight="bold"
                                                color="dark"
                                              >
                                                {element.homeTeamName} vs{' '}
                                                {element?.awayTeamName}
                                              </MDTypography>
                                              <Grid
                                                item
                                                xs={8}
                                                md={8}
                                                lg={8}
                                                alignSelf="center"
                                              >
                                                <MDTypography
                                                  component="h6"
                                                  fontWeight="bold"
                                                  variant="button"
                                                  color="primary"
                                                >
                                                  {moment(
                                                    element.matchTime * 1000,
                                                  )
                                                    .local()
                                                    .format('lll')}
                                                </MDTypography>
                                                <MDTypography
                                                  component="h6"
                                                  fontWeight="bold"
                                                  variant="button"
                                                >
                                                  status - {element?.status}
                                                </MDTypography>
                                              </Grid>
                                            </MDBox>
                                          </MDBox>
                                          <Divider />
                                          <MDBox pb={2} px={2}>
                                            <Grid container spacing={1}>
                                              <Grid spacing={1}>
                                      <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={() => { sendNotification(element) }}>
                                      Send Notification
                                     </MDButton>
                                      </Grid>
                                              {/* <Grid spacing={1}>
                                      <MDButton color="success" size="left" sx={{ margin: '10px 0px' }} onClick={()=>{setBetAmountFootball(element)}}>
                                      Set Betamount
                                     </MDButton>
                                      </Grid> */}
                                              <Grid textAlign="right">
                                                <MDButton
                                                  color="dark"
                                                  size="left"
                                                  onClick={() => {
                                                    setFbpData(element)
                                                    getFootBallScore(element)
                                                  }}
                                                >
                                                  View
                                                </MDButton>
                                              </Grid>
                                            </Grid>
                                            <Modal
                                              open={open}
                                              onClose={handleClose}
                                              aria-labelledby="modal-modal-title"
                                              aria-describedby="modal-modal-description"
                                            >
                                              <Box sx={style}>
                                                <label
                                                  style={{
                                                    padding: '0 20px 0px',
                                                  }}
                                                >
                                                  Bet Details
                                                </label>
                                                <form
                                                  onSubmit={formik.handleSubmit}
                                                >
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="bet_amount"
                                                          name="bet_amount"
                                                          label="Bet Amount"
                                                          variant="outlined"
                                                          // defaultValue={price}
                                                          value={
                                                            userdataa?.bet_amount
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              bet_amount:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                          // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
                                                          // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="winning_price"
                                                          name="winning_price"
                                                          label="Winning Price"
                                                          variant="outlined"
                                                          value={
                                                            userdataa?.winning_price
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              winning_price:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <TextField
                                                          fullWidth
                                                          id="bet_limit"
                                                          name="bet_limit"
                                                          label="Bet Limit"
                                                          variant="outlined"
                                                          value={
                                                            userdataa.bet_limit
                                                          }
                                                          onChange={(e) => {
                                                            setUserdataa({
                                                              ...userdataa,
                                                              bet_limit:
                                                                e.target.value,
                                                            })
                                                            formik.handleChange(
                                                              e,
                                                            )
                                                          }}
                                                        />
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  <Grid
                                                    container
                                                    spacing={2}
                                                    mr={3}
                                                    px={3}
                                                  >
                                                    <Grid item xs={12}>
                                                      <MDBox mt={2}>
                                                        <FormControl fullWidth>
                                                          <InputLabel id="Matches">
                                                            Fee Type
                                                          </InputLabel>
                                                          <Select
                                                            style={{
                                                              height: '45px',
                                                            }}
                                                            labelId="feetype"
                                                            id="feetype"
                                                            label="Fee Type"
                                                            value={
                                                              userdataa.feetype
                                                            }
                                                            onChange={(e) => {
                                                              setUserdataa({
                                                                ...userdataa,
                                                                feetype:
                                                                  e.target
                                                                    .value,
                                                              })

                                                              setWithdrawtype(
                                                                e.target.value,
                                                              )
                                                              percentageCalculate(
                                                                e.target.value,
                                                              )
                                                            }}
                                                          >
                                                            <MenuItem value="fixed">
                                                              Fixed
                                                            </MenuItem>
                                                            <MenuItem value="percentage">
                                                              Percentage
                                                            </MenuItem>
                                                          </Select>
                                                        </FormControl>
                                                      </MDBox>
                                                    </Grid>
                                                  </Grid>
                                                  {isPercentage ? (
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      mr={3}
                                                      px={3}
                                                    >
                                                      <Grid item xs={12}>
                                                        <MDBox mt={2}>
                                                          <TextField
                                                            fullWidth
                                                            id="fee_percentage"
                                                            name="fee_percentage"
                                                            variant="outlined"
                                                            label="Fee Percentage"
                                                            onChange={(e) => {
                                                              setUserdataa({
                                                                ...userdataa,
                                                                fee_percentage:
                                                                  e.target
                                                                    .value,
                                                                id: fbpData?.id,
                                                                home_team_name:
                                                                  fbpData?.homeTeamName,
                                                                away_team_name:
                                                                  fbpData?.awayTeamName,
                                                              })
                                                              formik.handleChange(
                                                                e,
                                                              )
                                                            }}
                                                            // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                                                            // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                                                          />
                                                        </MDBox>
                                                      </Grid>
                                                    </Grid>
                                                  ) : null}
                                                  <Grid
                                                    container
                                                    spacing={6}
                                                    mr={3}
                                                    px={3}
                                                    sx={{ marginTop: '10px' }}
                                                  >
                                                    <Grid
                                                      item
                                                      xs={12}
                                                      md={6}
                                                      sx={{
                                                        paddingTop:
                                                          '10px!important',
                                                      }}
                                                    >
                                                      <MDButton
                                                        variant="gradient"
                                                        color="dark"
                                                        onClick={(e) => {
                                                          formik.resetForm()
                                                          handleClose()
                                                        }}
                                                        fullWidth
                                                      >
                                                        Back
                                                      </MDButton>
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      xs={12}
                                                      md={6}
                                                      sx={{
                                                        paddingTop:
                                                          '10px!important',
                                                      }}
                                                    >
                                                      <MDButton
                                                        variant="gradient"
                                                        color="info"
                                                        type="submit"
                                                        fullWidth
                                                      >
                                                        Update
                                                      </MDButton>
                                                    </Grid>
                                                  </Grid>
                                                </form>
                                              </Box>
                                            </Modal>
                                          </MDBox>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Grid>
                              ))
                            ) : (
                              <h3
                                style={{
                                  position: 'absolute',
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%,-50%)',
                                }}
                              >
                                No Live Matches...
                              </h3>
                            )}
                          </Grid>
                        </div>
                      </MDBox>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </MDBox>
          </>

          {fbpData?.id && liveTabValue === '2' ? (
            <>
              <iframe
                src={`https://letswinsports.io/service/api/v1/users/football-widget?match_key=${fbpData.id}`}
                style={{ width: '100%', height: '100vh', border: 'none' }}
              ></iframe>
            </>
          ) : null}

          {fbpData?.id && liveTabValue === '3' ? (
            <>
              <Grid item xs={12} md={12} lg={12} xl={12}>
                <Card px={3} style={{ height: 'max-content', padding: '30px' }}>
                  <MDBox alignItems="center">
                    <TabContext value={footballPlayerTabValue}>
                      <TabList
                        onChange={handleSetFootballPlayer}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Home" value="1" />
                        <Tab label="Away" value="2" />
                      </TabList>
                    </TabContext>

                    {
                      footballPlayerTabValue === '1' && footballPlayers?.home && (
                        <div>
                          <table style={{ width: '100%' }}>
                            <thead>
                              <tr>
                                <td
                                  style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontWeight: '600',
                                  }}
                                >
                                  SI.No.
                                </td>
                                <td
                                  style={{
                                    padding: '0px 50px',
                                    color: 'black',
                                    fontWeight: '600',
                                  }}
                                >
                                  Name
                                </td>
                                <td
                                  style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontWeight: '600',
                                  }}
                                >
                                  Shirt Number
                                </td>
                                <td
                                  style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontWeight: '600',
                                  }}
                                >
                                  Position
                                </td>
                                <td
                                  style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontWeight: '600',
                                  }}
                                >
                                  Rating
                                </td>
                              </tr>
                            </thead>
                            {footballPlayers?.home?.map((item, i) => {
                              return (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>
                                    {i + 1}
                                  </td>
                                  <td
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '10px 50px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <img
                                      src={
                                        item?.logo
                                          ? item?.logo
                                          : '/dummyFlag.png'
                                      }
                                      alt={item.name}
                                      style={{
                                        width: '40px',
                                        background: 'red',
                                        borderRadius: '50%',
                                        padding: '5px',
                                      }}
                                    />

                                    {item.name}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.shirt_number}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.position}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {item.rating}
                                  </td>
                                </tr>
                              )
                            })}
                          </table>
                        </div>
                      )
                      // :
                      // <h4 style={{textAlign:'center',padding:'100px 0px'}}>
                      //  No Data Found!...
                      // </h4>
                    }

                    {footballPlayerTabValue === '2' && footballPlayers?.away && (
                      <div>
                        <table style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <td
                                style={{
                                  textAlign: 'center',
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                SI.No.
                              </td>
                              <td
                                style={{
                                  padding: '0px 50px',
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                Name
                              </td>
                              <td
                                style={{
                                  textAlign: 'center',
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                Shirt Number
                              </td>
                              <td
                                style={{
                                  textAlign: 'center',
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                Position
                              </td>
                              <td
                                style={{
                                  textAlign: 'center',
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                Rating
                              </td>
                            </tr>
                          </thead>
                          {footballPlayers?.away?.map((item, i) => {
                            return (
                              <tr>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                <td
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 50px',
                                    textAlign: 'center',
                                  }}
                                >
                                  <img
                                    src={
                                      item?.logo ? item?.logo : '/dummyFlag.png'
                                    }
                                    alt={item.name}
                                    style={{
                                      width: '40px',
                                      background: 'yellow',
                                      borderRadius: '50%',
                                      padding: '5px',
                                    }}
                                  />

                                  {item.name}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {item.shirt_number}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {item.position}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {item.rating}
                                </td>
                              </tr>
                            )
                          })}
                        </table>
                      </div>
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </>
          ) : null}

          {timelineElements.id === fbpData?.id ? (
            liveTabValue === '1' ? (
              <>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={`26.svg`}
                    width="25px"
                    height="25px"
                    alt={'26.svg'}
                  />
                </div>
                <VerticalTimeline>
                  {timelineElements?.incidents &&
                    footballIncidentLive?.map((element) => {
                      // console.log(element, 'element')
                      return (
                        <>
                          {Object.keys(element).length > 3 && (
                            <VerticalTimelineElement
                              key={element?.time}
                              // date={element?.type}
                              className="vertical-timeline-element--work"
                              contentStyle={{
                                background: 'rgb(252,252,252)',
                                height: '150px',
                              }}
                              contentArrowStyle={{
                                borderRight: '7px solid  rgb(252,252,252)',
                              }}
                              iconStyle={{
                                background: 'rgb(33, 150, 243)',
                                color: '#fff',
                              }}
                              icon={
                                <h3
                                  style={{
                                    textAlign: 'center',
                                    padding: '10px',
                                  }}
                                >
                                  {element?.time}
                                </h3>
                              }
                              // dateClassName="date"
                              position={
                                element?.position === 1 ? 'left' : 'right'
                              }
                            >
                              {element?.player_name ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <img
                                    src={`${element?.type}.svg`}
                                    width="25px"
                                    height="25px"
                                    alt={element?.type}
                                    style={{ transform: 'translateY(10px)' }}
                                  />
                                  <p>{element?.player_name}</p>
                                </div>
                              ) : null}
                              {element?.out_player_name ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <img
                                    src={`Group 2 (1).svg`}
                                    width="25px"
                                    height="25px"
                                    alt="lkl"
                                    style={{ transform: 'translateY(10px)' }}
                                  />
                                  <p className="vertical-timeline-element-title">
                                    {element?.out_player_name}
                                  </p>
                                </div>
                              ) : null}
                              {element?.in_player_name ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <img
                                    src={`Group 3 (1).svg`}
                                    width="25px"
                                    height="25px"
                                    alt={'lp'}
                                    style={{ transform: 'translateY(10px)' }}
                                  />
                                  <p className="vertical-timeline-element-title">
                                    {element?.in_player_name}
                                  </p>
                                </div>
                              ) : null}
                              {element?.assist1_name ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <img
                                    src={`31.png`}
                                    width="25px"
                                    height="25px"
                                    alt={element?.type}
                                    style={{ transform: 'translateY(10px)' }}
                                  />
                                  <p className="vertical-timeline-element-title">
                                    {element?.assist1_name}
                                  </p>
                                </div>
                              ) : null}
                              {element?.assist2_name ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <img
                                    src={`31.png`}
                                    width="25px"
                                    height="25px"
                                    alt={element?.type}
                                    style={{ transform: 'translateY(10px)' }}
                                  />
                                  <p className="vertical-timeline-element-title">
                                    {element?.assist2_name}
                                  </p>
                                </div>
                              ) : null}
                            </VerticalTimelineElement>
                          )}
                        </>
                      )
                    })}
                </VerticalTimeline>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <img
                    src={`10.svg`}
                    width="25px"
                    height="25px"
                    alt={'10.svg'}
                    style={{ transform: 'translateY(10px)' }}
                  />
                </div>
              </>
            ) : null
          ) : liveTabValue === '1' ? (
            <>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <img src={`26.svg`} width="25px" height="25px" alt={'26.svg'} />
              </div>
              <VerticalTimeline>
                {footBallScore[0]?.incidents &&
                  footballIncident?.map((element) => {
                    return (
                      <>
                        {Object.keys(element).length > 3 && (
                          <VerticalTimelineElement
                            key={element?.time}
                            // date={element?.type}
                            className="vertical-timeline-element--work"
                            contentStyle={{
                              background: 'rgb(252,252,252)',
                              height: '150px',
                            }}
                            contentArrowStyle={{
                              borderRight: '7px solid  rgb(252,252,252)',
                            }}
                            iconStyle={{
                              background: 'rgb(33, 150, 243)',
                              color: '#fff',
                            }}
                            icon={
                              <h3
                                style={{ textAlign: 'center', padding: '10px' }}
                              >
                                {element?.time}
                              </h3>
                            }
                            // dateClassName="date"
                            position={
                              element?.position === 1 ? 'left' : 'right'
                            }
                          >
                            {element?.player_name ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <img
                                  src={`${element?.type}.svg`}
                                  width="25px"
                                  height="25px"
                                  alt={element?.type}
                                  style={{ transform: 'translateY(10px)' }}
                                />
                                <p>{element?.player_name}</p>
                              </div>
                            ) : null}
                            {element?.out_player_name ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <img
                                  src={`Group 2 (1).svg`}
                                  width="25px"
                                  height="25px"
                                  alt="lkl"
                                  style={{ transform: 'translateY(10px)' }}
                                />
                                <p className="vertical-timeline-element-title">
                                  {element?.out_player_name}
                                </p>
                              </div>
                            ) : null}
                            {element?.in_player_name ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <img
                                  src={`Group 3 (1).svg`}
                                  width="25px"
                                  height="25px"
                                  alt={'lp'}
                                  style={{ transform: 'translateY(10px)' }}
                                />
                                <p className="vertical-timeline-element-title">
                                  {element?.in_player_name}
                                </p>
                              </div>
                            ) : null}
                            {element?.assist1_name ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <img
                                  src={`31.png`}
                                  width="25px"
                                  height="25px"
                                  alt={element?.type}
                                  style={{ transform: 'translateY(10px)' }}
                                />
                                <p className="vertical-timeline-element-title">
                                  {element?.assist1_name}
                                </p>
                              </div>
                            ) : null}
                            {element?.assist2_name ? (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <img
                                  src={`31.png`}
                                  width="25px"
                                  height="25px"
                                  alt={element?.type}
                                  style={{ transform: 'translateY(10px)' }}
                                />
                                <p className="vertical-timeline-element-title">
                                  {element?.assist2_name}
                                </p>
                              </div>
                            ) : null}

                            {/* <p id="description">{element.description}</p> */}
                          </VerticalTimelineElement>
                        )}
                      </>
                    )
                  })}
              </VerticalTimeline>
              <div></div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={`10.svg`} width="25px" height="25px" alt={'10.svg'} />
              </div>
              <h3>Figure Legends:</h3>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0px 0px 2px grey',
                  flexWrap: 'wrap',
                  gap: '25px',
                  padding: '20px',
                  borderRadius: '20px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/1.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Goal</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/2.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Corner</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/3.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Yellow card</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/4.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Red card</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/5.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Foul ball</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/6.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Free kick</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/7.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Goal kick</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/8.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Penalty</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/9.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Substitution</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/10.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Start</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/11.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Midfield</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/12.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>End</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/13.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Halftime score</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/15.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Card upgrade confirmed</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/16.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Penalty missed</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/17.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Own goal</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/19.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Injury time</p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/21.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Shots on target</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/22.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Shots off target</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/23.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Attacks</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/24.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Dangerous Attack</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/25.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Ball posession</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/26.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Overtime is over</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/27.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Penalty kick ended</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/28.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>
                    VAR(Video assistant referee)
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/29.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Penalty(Penalty Shoot-out)</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/30.svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>
                    Penalty missed(Penalty Shoot-out)
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/Group 2 (1).svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Player out</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/Group 3 (1).svg" alt="one" width="20px" />
                  <p style={{ fontSize: '15px' }}>Player in</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0px 0px 1px grey',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                >
                  <img src="/31.png" alt="one" width="0px" />
                  <p style={{ fontSize: '15px' }}>Assist Person</p>
                </div>
              </div>
            </>
          ) : null}
        </TabPanel>
      </TabContext>
      {/* <Footer /> */}
    </DashboardLayout>
  )
}

export default Dashboard
