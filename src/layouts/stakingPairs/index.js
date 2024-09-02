import * as React from 'react';
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Images
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import WithdrawList from "./components/WithdrawList";
import usercalls from "../../auth/endpoints";
import { ToastContainer, toast } from 'react-toastify'
import moment from "moment";
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Socket } from '../../socket/useSocket';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'react-toastify/dist/ReactToastify.css';
import { element } from 'prop-types';
import { useRef } from 'react';
import Web3 from 'web3';
import stakingAbi from '../../web3/ABI/stakingAbi.json'
import erc20Abi from '../../web3/ABI/erc20.json'
import wanStakingAddress from '../../web3/contract/wanStakingAddress'
import ethStakingAddress from '../../web3/contract/ethStakingAddress'
import { makeStyles } from '@mui/styles';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};
const buttonStyle = {
  marginTop: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "between",
};


const BootstrapInput = styled(InputBase)(({ theme }) => ({

  '& .MuiInputBase-input': {

    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    height: '40px !important'

  },
}));

function Users() {

  var WEB = new Web3(window.ethereum);
  const path = usercalls();
  const navigate = useNavigate();
  const [viewdetails, setViewdetails] = useState(false)
  const [collection, setCollection] = useState({})
  const [user, setUser] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(true)
  const [elementt, setElementt] = useState();
  const [indexvalue, setIndexvalue] = useState();
  const [state, setState] = useState();
  const [network, setNetwork] = useState();



  const Allocaiton = useRef()
  const poolupdate = useRef()
  const minDeposite = useRef()
  const [lockperiod, setLockPeriod] = useState()



  const [name, setname] = useState()
  const [nameerror, setnameError] = useState(null);

  const [email, setEmail] = useState();
  const [emailerror, setemailError] = useState(null);
  const [mindepositeerror, setmindepositeError] = useState(null);
  const [lockerror, setlockError] = useState(null);

  const [age, setAge] = React.useState(0);

  const handleChange = (event) => {
    setAge(event.target.value);
    if (event.target.value === 1) {
      setLockPeriod(2629743)
    } else if (event.target.value === 6) {
      setLockPeriod(2629743 * 6)
    } else if (event.target.value === 12) {
      setLockPeriod(2629743 * 12)
    }
  };


  const [id, setId] = useState();

  const [userId, setUserId] = useState();

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  function isvalidPass(pass) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(pass);
  }

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(!passwordShown);
  };

  const ViewUserdetails = () => {
    setViewdetails(!viewdetails);
  }
  useEffect(() => {
    getdata();
  }, [])

  const getdata = async () => {
    setLoading(true);
    var url = endpoints.getstakingPairs;
    var payload = {
      _id: 'all'
    }
    try {
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      console.log(result, "res")
      if (result.success === true) {
        console.log(result?.result?.length, "asfd")
        if (result && result.result) {
          buildData(Array.isArray(result.result) ? result?.result : new Array(result?.result))
          setLoading(false);
          setUser(result.result)
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const updateValue = async (ele) => {
    setId(ele)
  }

  const deletes = async () => {
    var url = endpoints.delete_user;
    try {
      const payload = {
        id: userId
      }
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      if (result.success === true) {
        setOpen(false)
        getdata()
        toast.success(result.message, {
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
    }
    catch (error) {
      console.error(error);
    }
  }

  const updates = async () => {
    var url = endpoints.stakingLiq;
    console.log(id, "ids")
    try {
      if (Allocaiton.current.value === "") {
        setnameError("Please Enter Allocation")
      } else if (poolupdate.current.value === "") {
        setemailError("Please Enter Pool Update")
      } else if (minDeposite.current.value === "") {
        setmindepositeError("Please Enter Min Deposite")
      } else if (lockperiod === "") {
        setlockError("Please Enter Lock Period")
      } else {
        const address = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        const contractInstance = await new WEB.eth.Contract(stakingAbi, id?.contractAddress)
        const erc20Instance = await new WEB.eth.Contract(erc20Abi, id?.LP_Token)
        var decimal = await erc20Instance.methods.decimals().call()
        console.log("🚀 ~ updates ~ decimal:", decimal, Number(minDeposite.current.value) * (10 ** Number(decimal)))
        const initialize = await contractInstance.methods.addPool(Allocaiton.current.value, Boolean(poolupdate.current.value), Number(minDeposite.current.value) * (10 ** Number(decimal)), lockperiod).send({
          from: address[0]
        })
        if (initialize) {
          const payload = {
            _id: id?._id,
            Allocation_Point: Allocaiton.current.value,
            Pool_Update: poolupdate.current.value,
            Min_Deposit: minDeposite.current.value,
            Lock_Period: lockperiod
          }
          const data = await path.postCall({ url, payload });
          const result = await data.json();
          if (result.success === true) {
            setOpen(false)
            getdata()
            toast.success(result.message, {
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
        }

      }

    }
    catch (error) {
      console.error(error);
    }
  }

  const status = (id) => {
    if (id === "1") {
      getdata()
    }
  }

  const buildData = (users, index) => {
    const tempArr = [];
    users.forEach((element, index) => {
      var temp = {}
      // temp.srno = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {index + 1}
      //   </MDTypography>
      // )  
      temp.end = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(element?.End_Time * 1000)}
        </MDTypography>
      )

      temp.start = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(element?.Start_Time * 1000)}
        </MDTypography>
      )
      temp.Rpcurl = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.contractAddress}
        </MDTypography>
      )
      temp.Chain = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.Reward_Token_Symbol}
        </MDTypography>
      )
      temp.Chain1 = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.LP_Token_Symbol}
        </MDTypography>
      )
      temp.action = (
        <Grid container spacing={1} mr={3} px={3} justifyContent="end">
          <Grid item xs={12} md={4} >
            {/* <MDButton color="info" size="small" onClick={() => { setOpen(true); updateValue(element) }} >
              View
            </MDButton> */}
            {element?.Min_Deposit === "" ?
              <MDButton color="info" size="small" onClick={() => { setOpen(true); updateValue(element); console.log(element, "element") }} >
                View
              </MDButton> :
              <MDButton color="info" size="small" onClick={() => { console.log(element, "element") }} >
                View
              </MDButton>}

          </Grid>
          {/* <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" onClick={() => userWallet(element)}>
              Transactions
            </MDButton>
          </Grid>
          <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" style={{ marginLeft: '30px' }} onClick={() => bettingHistory(element)}>
              Bet History
            </MDButton>
          </Grid> */}
        </Grid >
      )
      tempArr.push(temp)

    });


    setCollection({
      columns: [
        // { Header: "Id", accessor: "Id", width: "10%", align: "center" },
        { Header: "LP Token ", accessor: "Chain1", width: "10%", align: "center" },
        { Header: "Reward Token ", accessor: "Chain", width: "10%", align: "center" },
        { Header: "Contract Address", accessor: "Rpcurl", align: "center" },
        { Header: "Start Time", accessor: "start", align: "center" },
        { Header: "End Time", accessor: "end", align: "center" },
        { Header: "Action", accessor: "action", width: "10%", align: "center" },
      ],
      rows: tempArr
    })




  }




  return (
    <DashboardLayout>
      {open && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <MDTypography id="transition-modal-title" variant="h5" component="h5">
                Add Pool
              </MDTypography>
              <div style={{ display: "flex", flexDirection: "column", margin: "auto", textAlign: "center", gap: "1em", padding: "1em" }}>

                <TextField id="outlined-basic"
                  type='Number'
                  value={name}
                  inputRef={Allocaiton}
                  onChange={(e) => {
                    setnameError(null)
                  }} label="Allocaiton Point" variant="outlined" />

                {nameerror && <p style={{ color: 'red', fontSize: "12px" }}> {nameerror}</p>}

                <TextField id="outlined-basic" label="Pool Update (true or false)"
                  value={email}
                  inputRef={poolupdate}
                  onChange={(e) => {
                    //    console.log(e.target.value,"Done ")
                    setemailError(null)
                  }} variant="outlined" />

                {emailerror && <p style={{ color: 'red', fontSize: "12px" }}> {emailerror}</p>}

                <TextField id="outlined-basic" label="Min Deposite"
                  type='Number'
                  value={email}
                  inputRef={minDeposite}
                  onChange={(e) => {
                    //    console.log(e.target.value,"Done ")
                    setmindepositeError(null)
                  }} variant="outlined" />

                {mindepositeerror && <p style={{ color: 'red', fontSize: "12px" }}> {mindepositeerror}</p>}

                {/* <TextField id="outlined-basic" label="Lock Period"
                  type='Number'
                  value={email}
                  inputRef={lockperiod}
                  onChange={(e) => {
                    //    console.log(e.target.value,"Done ")
                    setlockError(null)
                  }} variant="outlined" /> */}

                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Lock Period</InputLabel>
                  <Select

                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={age}
                    onChange={handleChange}
                    autoWidth
                    label="Lock Period"
                    input={<BootstrapInput />}

                  >
                    <MenuItem value={1}>One Month</MenuItem>
                    <MenuItem value={6}>Six Month</MenuItem>
                    <MenuItem value={12}>One Year</MenuItem>
                  </Select>
                </FormControl>

                {lockerror && <p style={{ color: 'red', fontSize: "12px" }}> {lockerror}</p>}

              </div>

              <Box sx={buttonStyle}>
                <MDButton
                  // onClick={initiaterequst}
                  color="info"
                  size="small"
                  style={{ margin: "0 10px" }}
                  onClick={() => { updates() }}
                >
                  Update
                </MDButton>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
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

      <WithdrawList
        collection={collection}
        loading={loading}
        status={status}
        Viewdetails={ViewUserdetails}
        tablename="Withdraw Request" />

    </DashboardLayout >
  );
}

export default Users;
