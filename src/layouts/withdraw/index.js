import * as React from 'react';
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

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
import Web3 from 'web3';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Socket } from '../../socket/useSocket';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'react-toastify/dist/ReactToastify.css';
import { element } from 'prop-types';

import routeABI from '../../web3/ABI/routeABI'
import routerAddress from '../../web3/contract/routerAddress'
import routerethAddress from '../../web3/contract/ethrouterAddress'

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
function Users() {
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

  const [name, setname] = useState()
  const [nameerror, setnameError] = useState(null);

  const [routerAbi, setRouterAbi] = useState()
  const [routerContract, setRouterContract] = useState()

  const [email, setEmail] = useState();
  const [emailerror, setemailError] = useState(null);

  const [userId, setUserId] = useState();

  const [selcId, setSelecId] = useState()

  const [sts, setSts] = useState()

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
  // useEffect(() => {
  //   getdata();
  // }, [])

  var WEB = new Web3(window.ethereum);

  const getdata = async (data) => {
    setLoading(true);
    var url = endpoints.withdrawlists;
    var payload = {
      Network: data
    }
    try {
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      console.log("🚀 ~ file: index.js:114 ~ getdata ~ result:", result)
      // console.log(result, "res")
      if (result.success === true) {
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
    setname(ele?.Address)
    setEmail(ele?.Percentage)
    setRouterAbi(JSON.parse(ele?.router_Abi))
    setRouterContract(ele?.router_contract)
    setSelecId(ele?._id)
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

  const chainrouter = (data) => {
    setSts(data)
    getdata(data)
  }

  const updates = async () => {
    var url = endpoints.update_user;
    try {
      const address = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log(routerAbi, "routerAbi")
      var routeInstance = new WEB.eth.Contract(
        routerAbi,
        routerContract
      );
      const app1 = await routeInstance.methods.updateFeeAndAddress(name, email).send({
        from: address[0]
      })

      if (app1) {
        const payload = {
          Address: name,
          Percentage: email,
          _id: selcId
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
    catch (error) {
      console.error(error);
    }
  }

  const status = (id) => {
    if (id === "1") {
      getdata()
    }
  }

  // const soc = Socket();

  // soc?.on('withdraw', (result) => {
  //   // console.log(result);
  //   // buildData1(result);
  // })

  // const initiaterequst = async () => {
  //   var url = endpoints.withdrawedit;
  //   var payload = {
  //     "_id": elementt._id,
  //     "status": "5"
  //   }
  //   try {
  //     const data = await path.putCall({ url, payload });
  //     const result = await data.json();
  //     if (result.status === true) {
  //       if (result && result.msg) {
  //         toast.success("Initiated Successfully", {
  //           duration: 3000,
  //           position: 'top-right',
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: 'colored',
  //         })
  //         handleClose();
  //       }
  //       else {
  //         toast.error(result.msg, {
  //           duration: 3000,
  //           position: 'top-right',
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: 'colored',
  //         })
  //         handleClose();
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }

  // }

  // const deleteReq = async (element, index) => {
  //   // handleOpen();
  //   setElementt(element);
  //   setIndexvalue(index);
  //   var url = endpoints.withdrawedit;
  //   var payload = {
  //     "_id": element._id,
  //     "status": "6",
  //     "status_text": "Admin cancel your withdraw request"
  //   }
  //   try {
  //     const data = await path.putCall({ url, payload });
  //     const result = await data.json();
  //     if (result.status === true) {
  //       toast.success(result.msg, {
  //         duration: 3000,
  //         position: 'top-right',
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'colored',
  //       })
  //       getdata("requst");
  //     }
  //     else {
  //       toast.error(result.msg, {
  //         duration: 3000,
  //         position: 'top-right',
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'colored',
  //       })
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

  // const addInitiate = async (element, index) => {
  //   setElementt(element);
  //   setIndexvalue(index);
  //   handleOpen();
  //   const url = endpoints.withdrawinitiate;
  //   var payload = {
  //     "no_of_token": element.no_of_token,
  //     "tokenAmount": element.live_price,
  //     "currency": element.coin,
  //     "withdrawAddress": element.send_address,
  //     "add_tx_fee": 2,
  //     "transaction_type": element.transaction_type,
  //     "withdraw_id": element._id

  //   }
  //   try {
  //     const data = await path.postCall({ url, payload });
  //     const result = await data.json();
  //     if (result.status === true) {
  //       //
  //     }
  //     else {
  //       toast.error(result.msg, {
  //         duration: 3000,
  //         position: 'top-right',
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: 'colored',
  //       })
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  //   getdata("requst");
  // }

  const buildData = (users, index) => {
    const tempArr = [];
    users.forEach((element, index) => {
      var temp = {}
      // temp.srno = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {index + 1}
      //   </MDTypography>
      // )  
      // temp.coin = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {element?.Address}
      //   </MDTypography>
      // )
      temp.router = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.router_contract}
        </MDTypography>
      )
      temp.email = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.Percentage ? element?.Percentage : "-"}
        </MDTypography>
      )
      temp.name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.Address ? element?.Address : "-"}
        </MDTypography>
      )
      temp.action = (
        <Grid container spacing={1} mr={3} px={3} justifyContent="end">
          <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" onClick={() => { setOpen(true); updateValue(element) }} >
              View
            </MDButton>
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
        { Header: "RouterContract", accessor: "router", width: "10%", align: "center" },
        { Header: "Address", accessor: "name", width: "10%", align: "center" },
        { Header: "Percentage", accessor: "email", align: "center" },
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
                Edit Fees
              </MDTypography>
              <div style={{ display: "flex", flexDirection: "column", margin: "auto", textAlign: "center", gap: "1em", padding: "1em" }}>
                <TextField id="outlined-basic"
                  value={name}
                  onChange={(e) => {
                    // console.log(e.target.value,"DOw ")
                    setname(e.target.value); setnameError(null)
                  }} label="Address" variant="outlined" />

                {nameerror && <p style={{ color: 'red', fontSize: "12px" }}> {nameerror}</p>}

                <TextField id="outlined-basic" label="Percentage"
                  value={email}
                  onChange={(e) => {
                    //    console.log(e.target.value,"Done ")
                    setEmail(e.target.value); setemailError(null)
                  }} variant="outlined" />

                {emailerror && <p style={{ color: 'red', fontSize: "12px" }}> {emailerror}</p>}

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
        chain={chainrouter}
        tablename="Withdraw Request" />

    </DashboardLayout >
  );
}

export default Users;
