import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";

// Images
import moment from "moment";
import MDTypography from "components/MDTypography";
import SearchIcon from '@mui/icons-material/Search';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import UserList from "./components/UserList";
import UserView from "./components/UserView";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ErrorIcon from '@mui/icons-material/Error';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField'; 
import { ToastContainer, toast } from 'react-toastify'
import MDBox from "components/MDBox";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
const useStyles = makeStyles({
  inputfields: {
    height: "40px",
    color: "#000",
    padding: " 5px 10px",
    borderRadius: "6px",
    border: "solid 1px #cbcbcb",
    width: "220px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '&:focus-visible': {
      outline: 'none',
    },
  },
});



function Users() {
  const navigate = useNavigate();
  const path = usercalls();
  const [viewdetails, setViewdetails] = useState(false)
  const [bethistory, setBetHistory] = useState(false)
  const [userWallets, setUserWallets] = useState(false)
  const [collection, setCollection] = useState({})
  const [collection1, setCollection1] = useState({})
  const [collection2, setCollection2] = useState({})
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState({})
  const [search, setSearch] = useState('')
  const [walletInfo, setWalletInfo] = useState({})
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isPercentage, SetisPercentage] = useState(true);
  const [withdrawtype, setWithdrawtype] = useState("percentage");
  const [footBallMatchId, setFootBallMatchId] = useState('')
  const onSearchChange = async (event) => {
    setSearch(event.target.value)
  }
  const classes = useStyles();
  const [userdataa, setUserdataa] = useState({
    winning_price: '',
    bet_limit: '',
    bet_amount: '',
    feetype:withdrawtype,
    fee_percentage: '',
    id:''
  
  });
  const editBetAmount = async (element) => {
    setUserdataa({  
    "bet_amount":element?.betting_price,
    "bet_limit":element.bet_limit,
    "feetype":element.withdraw_type,
    "fee_percentage":element.fee_percentage,
    "winning_price":element.winning_amount})
  //  console.log(element);
   setWithdrawtype(element.fee_type)
   percentageCalculate(element.withdraw_type);
   setFootBallMatchId(element?.match_id)
   getdata();
  }

  useEffect(() => {
    getdata();
  }, [])

  useEffect(() => {
    if (search == '') {
      buildData(user)
    } else {
      const query = search.toLowerCase()
      const items = []
      user.filter(function (item) {
        if (item.email) {
          if (item.email.indexOf(query) > -1) {
            items.push(item)
          }
        }
      })
      buildData(items)
    }
  }, [search,user])
  
  const validationSchema = yup.object().shape({
    bet_amount: yup.number().required("Required"),
    winning_price: yup.number().required("Required"),
    bet_limit: yup.number().required("Required"),
    feetype: yup.string().required("Required"),
    fee_percentage: yup.number().required("Required"),
  });
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, borderRadius: '10px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px 0',
  };
  const percentageCalculate = async (number) => {
    if (number === 'percentage') {
      SetisPercentage(true);
    }
    else {
      SetisPercentage(false);
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
  const onFormsubmit = async (values) => {
   
    let payload={ 
     "match_id":footBallMatchId,
     "betting_price":values?.bet_amount,
     "bet_limit":values.bet_limit,
     "withdraw_type":values.feetype,
      "fee_percentage":values.fee_percentage,
      "winning_amount":values.winning_price
    }
    const url = endpoints.editCricketBetAmount;
    try {
     const data = await path.postCall({ url, payload });
     const result = await data.json();
    
     if (result.status === true) {
         toast.success("Bet Amount added successfully!", {
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
         
       getdata()
         handleClose();
         // setUserdataa('')
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
         // setUserdataa('');
     }
 }
 catch (error) {
     console.error(error);
 }
   }
  const getbetdata = async (id) => {
    setLoading(true);
    const url = `${endpoints.bethistory}?user_id=${id}`;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result) {
      
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const getdata = async () => {
    setLoading(true);
    const url = endpoints.cricketBtAmtMatch;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          buildData(result.data);
          setLoading(false);
          setUser(result.data)
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
      temp.match_name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.match_name}
        </MDTypography>
      )
      temp.team = (
        <MDTypography variant="caption" color="text" fontWeight="medium" style={{display:'flex',alignItems:'center',width:'100%',margin:'auto',gap:'20px'}}>
         <div style={{display:'flex',alignItems:'center',justifyContent:'end',width:'50%',gap:'5px',margin:'auto'}}>
         <b style={{color:'black',textAlign:'right'}}>{element.home_team_name} </b> 
          
          <img src={element.home_team_logo?element.home_team_logo:"dummyFlag.png"} alt="home_team_logo" style={{width:"25px"}}/>
         </div>
         <div>  VS </div>
      <div style={{display:'flex',alignItems:'center',width:'50%',justifyContent:'start',gap:'5px',margin:'auto'}}>
      <img src={element.away_team_logo?element.away_team_logo : "/dummyFlag.png"} alt="home_team_logo" style={{width:"25px"}}/>
   
        <b style={{color:'black',textAlign:'left'}}> {element.away_team_name}</b> 
      </div>
        
        
        </MDTypography>
      )
      temp.winning_price = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.winning_amount}
        </MDTypography>
      )
      temp.betting_price = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.betting_price}
        </MDTypography>
      )
      temp.bet_limit = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.bet_limit}
        </MDTypography>
      )
      temp.fee_type = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.withdraw_type}
        </MDTypography>
      )
      temp.fee_percentage = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.fee_percentage}
        </MDTypography>
      )
      temp.match_time = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
       { moment( element.match_time*1000).format("LLL") }
        </MDTypography>
      )
      temp.status = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.status}
        </MDTypography>
      )
      temp.action = (
        <Grid container spacing={1} mr={3} px={3} justifyContent="end">
          <Grid item  >
            <MDButton color="info" size="small" onClick={() => {editBetAmount(element);handleOpen();}}>
           Edit
            </MDButton>
          </Grid>
        
         
        </Grid>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Tournament", accessor: "match_name", align: "center" },
        { Header: "Match Name", accessor: "team", align: "center" },
        { Header: "Winning Amount", accessor: "winning_price", align: "center" },
        { Header: "Bet Amount", accessor: "betting_price", align: "center" },
        { Header: "Bet Limit", accessor: "bet_limit", align: "center" },
        { Header: "Fee Type", accessor: "fee_type", align: "center" },
        { Header: "Fee Percentage", accessor: "fee_percentage", align: "center" },
        { Header: "Match Time", accessor: "match_time", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Action", accessor: "action", width: "10%", align: "center" },
      ],
      rows: tempArr
    })
  }


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
      <UserList
                    loading={loading}
                    collection={collection}
                    username="Tournament And Match Info" />
                                                    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label style={{ padding: '0 20px 0px' }}>Edit Bet Details</label>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mr={3} px={3}>
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
                        bet_amount: e.target.value
                      })
                      formik.handleChange(e)
                    }}
                    // error={formik.touched.bet_amount && Boolean(formik.errors.bet_amount)}
                    // helperText={formik.touched.bet_amount && formik.errors.bet_amount}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={2} mr={3} px={3}>
                <Grid item xs={12}>
                  <MDBox mt={2}>
                    <TextField
                      fullWidth
                      id="winning_price"
                      name="winning_price"
                      label="Winning Price"
                      variant="outlined"
                      value={userdataa?.winning_price}
                      onChange={(e) => {
                        setUserdataa({
                          ...userdataa,
                          winning_price: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={2} mr={3} px={3}>
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
                          bet_limit: e.target.value
                        })
                        formik.handleChange(e)
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
              <MDBox mt={2}>
                <FormControl fullWidth>
                  <InputLabel id="Matches">Fee Type</InputLabel>
                  <Select
                    style={{ height: '45px' }}
                    labelId="feetype"
                    id="feetype"
                    label="Fee Type"
                    value={userdataa.feetype}
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        feetype: e.target.value
                      })
                      
                      setWithdrawtype(e.target.value)
                      percentageCalculate(e.target.value);
                    }}
                  >
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
                </MDBox>
              </Grid>
              </Grid>
              {isPercentage ?
                <Grid container spacing={2} mr={3} px={3}>
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
                        fee_percentage: e.target.value,
                   
                     
                      })
                      formik.handleChange(e)
                    }}
                    // error={formik.touched.fee_percentage && Boolean(formik.errors.fee_percentage)}
                    // helperText={formik.touched.fee_percentage && formik.errors.fee_percentage}
                  />
                  </MDBox>
                </Grid>
                </Grid>
                :
                null}
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark"  onClick={ e => {formik.resetForm();handleClose()}} fullWidth>
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

    </DashboardLayout >
  );
}

export default Users;
