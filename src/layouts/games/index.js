import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";
import img from "../download.png"

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Images
import moment from "moment";
import MDTypography from "components/MDTypography";
import SearchIcon from '@mui/icons-material/Search';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import GameList from "./components/GameList";
import GameInfo from "./components/GameInfo";
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MDBox from "components/MDBox";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500, borderRadius: '10px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '20px 0',
};

const useStyles = makeStyles({
  inputfields: {
    height: "40px",
    color: "#000",
    padding: " 5px 10px",
    borderRadius: "6px",
    border: "solid 1px #cbcbcb",
    width: '100%',
    '&:focus-visible': {
      outline: 'none',
    },
  },
});

const validationSchema = yup.object().shape({
  min_bid: yup.number().required("Required"),
  bet_limit: yup.number().required("Required"),
  matchtype: yup.string().required("Required"),
  withdrawtype: yup.string().required("Required"),
  description: yup.string().required("Required"),
});

function Users() {
  const navigate = useNavigate();
  var formdata = new FormData();
  var formdata1 = new FormData();
  const classes = useStyles();
  const path = usercalls();
  const [collection, setCollection] = useState({})
  const [collection1, setCollection1] = useState({})
  const [user, setUser] = useState([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [loading, setLoading] = useState(true);
  const [matchType, setMatchType] = useState([])
  const [withdrawtype, setWithdrawtype] = useState("fixed");
  const [GamesType, setGamesType] = useState("select");
  const [userdataa, setUserdataa] = useState({
    min_bid: '',
    bet_limit: '',
    matchtype: '',
    withdrawtype: withdrawtype,
    description: '',
  });
  const [tounamentType, setTounamentType] = useState([])
  const [userdataedit, setUserdataedit] = useState({})
  const [tournamentvalue, setTournamentValue] = useState({})
  const [tournamentKey, setTournamentKey] = useState({})
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPercentage, SetisPercentage] = useState(false);
  const [tropyFile, setTropyFile] = useState(null);
  const [matches1, setMatches1] = useState(true);
  const [playerInfo, setPlayerInfo] = useState(false);
  const [matchInfo, setMatchInfo] = useState([]);
  const [matchPlayerA, setMatchPlayerA] = useState([]);
  const [matchPlayerB, setMatchPlayerB] = useState([]);
  const [openDisable, setOpenDisable] = React.useState(false);
  const handleOpenDisable = () => setOpenDisable(true);
  const handleCloseDisable = () => setOpenDisable(false);
  const onSearchChange = async (event) => {
    setSearch(event.target.value)
  }
  useEffect(() => {
    getdata();
    gettournaments();
    getGame("cricket");
  }, [])
  const getBack = () => {
    getdata();
    setMatches1(true);
  }
  const gameChange = async (type) => {
    if (type === 'Cricket') {
      getGame('cricket');
    }
    else {
      getGame('footbal');

    }
  }
  useEffect(() => {
    if (search == '') {
      buildData(user)
    } else {
      const query = search
      const items = []
      user.filter(function (item) {
        if (item.game) {
          if (item.game.indexOf(query) > -1) {
            items.push(item)
          }
        }
      })
      buildData(items)
    }
  }, [search])
  const gettournaments = async () => {
    const url = endpoints.addgame;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.msg) {
          const games = result.data;
          var temarr = [];
          games.forEach((element, index) => {
            temarr.push({ key: element.name })
          })
          setTounamentType(temarr);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const getGame = async (game) => {
  
    if (game === 'cricket') {
      const url = endpoints.cricketMatchInfo;
      try {
        const data = await path.getCall({ url });
        const result = await data.json();
        if (result.status === true) {
          if (result && result.data) {
            const games = result.data.tournaments;
            var temarr = [];
            games.forEach((element, index) => {
              temarr.push({
                key: element.name,
                value: element
              })
            })
            setMatchType(temarr);
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    }else if(game ==='footbal'){
      const url = endpoints.listfootball;
      try {
        const data = await path.getCall({ url });
        const result = await data.json();
        if (result.status === true) {
          if (result && result.data) {
            const games = result.data;
            var temarr = [];
            games.forEach((element, index) => {
              temarr.push({
                key: element.name,
                value: element
              })
            })
            setMatchType(temarr);
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      setMatchType([])
    }
  }
  const getdata = async () => {
    setLoading(true);
    const url = endpoints.listtournament;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          buildData(result.data);
          setLoading(false);
          setUser(result.data);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const [disableId, setDisableId] = useState(false)
  const handleDelete = async (deleteid) => {
    setDisableId(deleteid._id)
    handleOpenDisable()
  }
  const handleDisable = async()=>{
    const url = endpoints.deletetournamet;
    let payload = {
      "_id": disableId,
      "status": "0"
    }
    try {
      const data = await path.putCall({ url, payload });
      const result = await data.json();
      if (result.status === true) {
        toast.success(result.msg, {
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
        getdata();
        handleCloseDisable();
      }
      else {
        toast.error(result.msg, {
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
        getdata();
        handleCloseDisable();
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const onFormsubmitedit = async () => {
    const url = endpoints.deletetournamet;
    let payload = {
      "_id": userdataedit._id,
      "bet_amount": userdataedit.bet_amount,
      "bet_limit": userdataedit.bet_limit,
      "summary": userdataedit.description,
    }
    try {
      const data = await path.putCall({ url, payload });
      const result = await data.json();
      if (result.status === true) {
        toast.success(result.msg, {
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
        getdata();
        handleClose1();
      }
      else {
        toast.error(result.msg, {
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
        handleClose1();
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const handleEdit = async (editid) => {
    handleOpen1();
    setUserdataedit(editid)
  }
  const handleMatch = async (matches) => {
    setLoading(true);
    setMatches1(false);
    const url = `${endpoints.cricketMatchdetailsInfo}?tournament_id=${matches.tournament_id}`;
    try {
      const data = await path.postCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data && result.data.match_details) {
          buildData1(result.data.match_details);
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const buildData1 = (users, index) => {
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
          {moment(element.start_at * 1000).local().format('lll')}
        </MDTypography>
      )
      temp.type = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.format}
        </MDTypography>
      )
      temp.title = (
        <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ width: '10px' }}>
          {element.title}
        </MDTypography>
      )
      temp.team = (
        <MDTypography variant="caption" color="text" fontWeight="medium">

          <Grid container spacing={0} mr={3} px={3}>
            <Grid item xs={5} md={5}>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <div style={{ alignSelf: 'center' }}>
                  <p>{element.teams.a.name}</p>
                </div>
                <div style={{ borderRadius: '50%' }}>
                  <img alt="flag"src={element.teams.a.country_code === null ? img : `https://letswinsports.io/service/img/flag/${(element.teams.a.country_code).toLowerCase()}.png`} style={{ width: '30px', margin: '0 7px' }} />
                </div>
              </div>
            </Grid>
            <Grid item xs={1} md={1} alignSelf="center">
              <p>vs</p>
            </Grid>
            <Grid item xs={6} md={6}>
              <div style={{ display: 'flex', justifyContent: 'start' }}>
                <img alt="flag" src={element.teams.b.country_code === null ? img : `https://letswinsports.io/service/img/flag/${(element.teams.b.country_code.toLowerCase())}.png`} style={{ width: '30px', margin: '0 7px' }} />
                <div style={{ alignSelf: 'center', textAlign: 'left' }}>
                  <p>{element.teams.b.name}</p>
                </div>
              </div>
            </Grid>
          </Grid>
        </MDTypography >
      )
      temp.venue = (
        <MDTypography variant="caption" color="text" fontWeight="medium" sx={{ width: '10px' }}>
          {element.venue.name}{","} {element.venue.city}
        </MDTypography>
      )
      temp.status = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.status}
        </MDTypography>
      )
      temp.action = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          <MDButton color="dark" size="small" sx={{ marginLeft: '10px' }} onClick={() => openModal2(element)}>
            View
          </MDButton>
        </MDTypography>
      )
      tempArr.push(temp)

    });
    setCollection1({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Event Date", accessor: "date", align: "center" },
        { Header: "Type", accessor: "type", align: "center" },
        { Header: "Team", accessor: "team", align: "center" },
        { Header: "Title", accessor: "title", width: "10", align: "center" },
        { Header: "Venue", accessor: "venue", width: "10", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
      ],
      rows: tempArr
    })
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
          {moment(element.tournament_info.start_date * 1000).local().format('lll')}
        </MDTypography>
      )
      temp.amount = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.bet_amount}
        </MDTypography>
      )
      temp.betlimit = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.bet_limit}
        </MDTypography>
      )
      temp.game = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.game.toUpperCase()}
        </MDTypography>
      )
      temp.event = (
        <div style={{ position: 'relative' }}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            <img src={`${element.cup_image}`} style={{ position: "absolute", height: '90px', top: '30%', right: '5%' }} />
            <p style={{ color: 'rgb(255 255 255)', position: 'absolute', top: '33%', left: "auto", width: '220px', right: "auto", marginLeft: "35px", fontSize: "18px" }}>
              {element.tournament_info.name} </p>
            <img src={`${element.tournament_image}`} />
          </MDTypography >
        </div>
      )
      temp.action = (
        <>
          <MDButton color="warning" size="small" onClick={() => handleEdit(element)}>
            Edit
          </MDButton>
          <MDButton color="info" size="small" sx={{ marginLeft: '10px' }} onClick={() => handleMatch(element)}>
            Matches
          </MDButton>
          <MDButton color="dark" size="small" sx={{ marginLeft: '10px' }} onClick={() => handleDelete(element)}>
            Disable
          </MDButton>
        </>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Tournament", accessor: "game", align: "center" },
        { Header: "Event", accessor: "event", align: "center" },
        { Header: "Event Date & Time", accessor: "date", align: "center" },
        { Header: "Bet Amount", accessor: "amount", align: "center" },
        { Header: "Bet Limit", accessor: "betlimit", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
      ],
      rows: tempArr
    })
  }
  const openModal = () => {
    handleOpen();
  }
  const openModal2 = (element) => {
    getplayerinfo(element.match_key);
  }
  const getmatchdetailsview = () => {
    setPlayerInfo(!playerInfo)
  }
  const getplayerinfo = async (matchkey) => {
    setLoading(true);
    const url = `${endpoints.playerinfo}?match_key=${matchkey}`;
    try {
      const data = await path.postCall({ url });
      const result = await data.json();
      if (result.status === true) {
        setMatchInfo(result.data)
        setMatchPlayerA(result.data.teamA);
        setMatchPlayerB(result.data.teamB)
        setPlayerInfo(!playerInfo)
        setLoading(false);
      }
      else {
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
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdataa,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values)
    },
  });
  const handleCapture = async ({ target }) => {
    setSelectedFile(target.files[0]);
  };
  const handleCapture1 = async ({ target }) => {
    setTropyFile(target.files[0]);
  };
  const uploadImage = async (image) => {
    if (image === selectedFile) {
      formdata.append("image", selectedFile);
      const urlimage = endpoints.upload;
      const validateToken = sessionStorage.getItem('accesstoken');
      try {
        const data = await axios.post(urlimage, formdata, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Authorization': `${validateToken}`,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        });
        if (data.status === 200) {
          return data.data.data.Location;
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    else if (image === tropyFile) {
      formdata1.append("image", tropyFile);
      const urlimage = endpoints.upload;
      const validateToken = sessionStorage.getItem('accesstoken');
      try {
        const data = await axios.post(urlimage, formdata1, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Authorization': `${validateToken}`,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        });
        if (data.status === 200) {
          return data.data.data.Location;
        }
      }
      catch (error) {
        console.error(error);
      }
    }

  }
  const onFormsubmit = async (values) => {
    const bg_image = await uploadImage(selectedFile);
    const tropy_image = await uploadImage(tropyFile);
    if (bg_image && tropy_image) {
      const url = endpoints.listtournament;
      const payload = {
        "tournament_info": tournamentvalue,
        "tournament_id": tournamentKey,
        "game": GamesType,
        "bet_amount": values.min_bid,
        "bet_limit": values.bet_limit,
        "withdraw_type": withdrawtype,
        "tournament_image": bg_image,
        "fee_percentage": values.fee_percentage,
        "cup_image": tropy_image,
        "summary": values.description,
      }
      try {
        const data = await path.postCall({ url, payload });
        const result = await data.json();
        if (result.status === true) {
          toast.success(result.msg, {
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
          getdata();
          handleClose();
        }
        else {
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
          handleClose();
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      toast.error("Please select a proper image", {
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
  }
  const percentageCalculate = async (number) => {
    if (number === 'percentage') {
      SetisPercentage(true);
    }
    else {
      SetisPercentage(false);
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 style={{ textAlign: 'center' }}>Add Tournament</h4>
          <form style={{ margin: '10px 0' }} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="Games">Games</InputLabel>
                  <Select
                    style={{ height: '45px' }}
                    labelId="Games"
                    id="games"
                    value={GamesType}
                    label="games"
                    onChange={(e) => {
                      setGamesType(e.target.value)
                      gameChange(e.target.value)
                    }}
                  >
                    <MenuItem value="select">Select Game</MenuItem>
                    {tounamentType && tounamentType.length > 0 && tounamentType.map((name) => (
                      <MenuItem value={name.key}>
                        {name.key}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="Matches">Tournaments</InputLabel>
                  <Select
                    style={{ height: '45px' }}
                    labelId="matchtype"
                    id="matchtype"
                    name="matchtype"
                    label="Tournaments"
                    value={userdataa.matchtype}
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        matchtype: e.target.value
                      })
                      formik.handleChange(e)
                    }}
                    error={formik.touched.matchtype && Boolean(formik.errors.matchtype)}
                    helperText={formik.touched.matchtype && formik.errors.matchtype}
                  >
                    {matchType && matchType.length > 0 && matchType.map((name) => (
                     
                      <MenuItem value={name.value.key ?name.value.key:name.value.id} onClick={() => {
                        setTournamentValue(name.value)
                        setTournamentKey(name.value.key ?name.value.key:name.value.id);
                      }
                      }>{name.key}{name.value.start_date && " - "}{name.value.start_date &&moment(name.value.start_date * 1000).local().format('lll')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      variant="outlined"
                      rows={5}
                      multiline
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          description: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="min_bid"
                      name="min_bid"
                      label=" Bid Amount"
                      variant="outlined"
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          min_bid: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                      error={formik.touched.min_bid && Boolean(formik.errors.min_bid)}
                      helperText={formik.touched.min_bid && formik.errors.min_bid}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="bet_limit"
                      name="bet_limit"
                      label="Bet Limit"
                      variant="outlined"
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          bet_limit: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                      error={formik.touched.bet_limit && Boolean(formik.errors.bet_limit)}
                      helperText={formik.touched.bet_limit && formik.errors.bet_limit}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <InputLabel sx={{ marginBottom: '10px' }}>Background</InputLabel>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="image"
                      name="image"
                      variant="outlined"
                      accept="image/jpeg"
                      type="file"
                      onChange={handleCapture}
                      required
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <InputLabel sx={{ marginBottom: '10px' }}>Tropy</InputLabel>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="cupimage"
                      name="cupimage"
                      variant="outlined"
                      accept="image/jpeg"
                      type="file"
                      onChange={handleCapture1}
                      required
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="Matches">Withdraw Type</InputLabel>
                  <Select
                    style={{ height: '45px' }}
                    labelId="withdrawtype"
                    id="withdrawtype"
                    label="Withdraw Type"
                    value={withdrawtype}
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        withdrawtype: e.target.value
                      })
                      setWithdrawtype(e.target.value)
                      percentageCalculate(e.target.value);
                    }}
                  >
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {isPercentage ?
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="fee_percentage"
                    name="fee_percentage"
                    variant="outlined"
                    label="Fee Percentage"
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        fee_percentage: e.target.value
                      })
                      formik.handleChange(e)
                    }}
                    error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                    helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                  />
                </Grid>
                :
                null}

            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleClose} fullWidth>
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="info" type="submit" fullWidth>
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Modal
        open={open1}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form style={{ margin: '10px 0' }} >
            <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="min_bid"
                      name="min_bid"
                      label=" Bid Amount"
                      variant="outlined"
                      defaultValue={userdataedit.bet_amount}
                      onChange={(e) => {
                        setUserdataedit({
                          ...userdataedit,
                          bet_amount: e.target.value
                        })
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              {/* <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      variant="outlined"
                      defaultValue={userdataedit.description}
                      rows={5}
                      multiline
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          description: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </MDBox>
                </Grid>
              </Grid> */}
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="bet_limit"
                      name="bet_limit"
                      label="Bet Limit"
                      defaultValue={userdataedit.bet_limit}
                      variant="outlined"
                      onChange={(e) => {
                        setUserdataedit({
                          ...userdataedit,
                          bet_limit: e.target.value
                        })
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleClose1} fullWidth>
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="info" onClick={onFormsubmitedit} fullWidth>
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openDisable}
        onClose={handleCloseDisable}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form style={{ margin: '10px 0' }} >
            <Grid container spacing={2} mr={3} px={3}>
              
              {/* <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      variant="outlined"
                      defaultValue={userdataedit.description}
                      rows={5}
                      multiline
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          description: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </MDBox>
                </Grid>
              </Grid> */}
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <MDBox>
                  <p>Are you sure you want to delete the Tournament?</p>
                  </MDBox>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleCloseDisable} fullWidth>
                  Cancel
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="info" onClick={handleDisable} fullWidth>
                  Ok
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {/* <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} textAlign="center">
          <h5 style={{ fonSize: '20px' }}>{matchInfo.name}</h5>
          <p style={{ fontSize: '12px', fontWeight: "500" }}>{matchInfo.sub_title}</p>
          <h6 style={{ color: "#8d8d8d" }}>{matchInfo.status}</h6>
          <h6 style={{ color: "green" }}>{matchInfo?.winner === "a" ? matchInfo?.teams?.a?.name : matchInfo?.teams?.b?.name}</h6>

          <Grid container spacing={2} mr={3} justifyContent="end">
            <Grid item md={6}>
              <ul>
                {matchPlayerA.map((data, index) => {
                  <li>
                    {data.name}
                  </li>
                })}
              </ul>
            </Grid>
          </Grid>

        </Box>
      </Modal> */}

      {
        matches1 ?
          <>
            <Grid container spacing={2} mr={3} justifyContent="end">
              <div className="mb-3">
                <div className="searchbar-icon1" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className={classes.inputfields}
                    onChange={onSearchChange}
                    placeholder="Search Game"
                  />
                  <span className="search-icon pe-2 text-dark">
                    <SearchIcon sx={{ color: '#88a4b2', marginTop: '10px', position: "absolute", top: 0, right: "3%" }} />
                  </span>
                </div>
              </div>
              <MDButton variant="gradient" color="info" sx={{ marginLeft: '10px' }}
                onClick={openModal}>
                Add Tournament
              </MDButton>
            </Grid>
            <GameList
              collection={collection}
              loading={loading}
            />
          </>
          :
          <>
            {playerInfo ?
              <>
                <GameInfo
                  matchInfo={matchInfo}
                  matchPlayerA={matchPlayerA}
                  matchPlayerB={matchPlayerB}
                  getmatchdetailsview={getmatchdetailsview}
                  loading={loading}
                />
              </> :
              <>

                <MDButton variant="gradient" color="dark" sx={{ marginLeft: '10px', float: 'right', marginTop: "10px", marginBottom: '20px' }} onClick={() => getBack()}     >
                  Back
                </MDButton>
                <div style={{ marginTop: "50px" }}>
                  <GameList
                    collection={collection1}
                    loading={loading}
                  />
                </div>
              </>}

          </>
      }
    </DashboardLayout >
  );
}

export default Users;
