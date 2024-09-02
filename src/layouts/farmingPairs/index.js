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

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Socket } from '../../socket/useSocket';
import TextField from '@mui/material/TextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'react-toastify/dist/ReactToastify.css';
import { element } from 'prop-types';
import Web3 from 'web3';
import erc20 from '../../web3/ABI/erc20.json';


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
  const [network, setNetwork] = useState();

  const [amountss, setAmountsss] = useState(0)



  const [name, setname] = useState('')
  const [nameerror, setnameError] = useState(null);

  const [email, setEmail] = useState();
  const [emailerror, setemailError] = useState(null);

  const [selected, setSelected] = useState()

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
    var url = endpoints.farmingPairs;
    try {
      const data = await path.getCall({ url });
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
    setSelected(ele)
    var WEB = new Web3(ele?.Network?.rpc_Url);
    const conractInstance = await new WEB.eth.Contract(erc20, ele?.Reward_Token)
    const bal = await conractInstance.methods.balanceOf(ele?.contractAddress).call()
    const deci = await conractInstance.methods.decimals().call()
    setAmountsss(Number(bal) / (10 ** Number(deci)))
    // setId(ele?._id)
    // setname(ele?.name)
    // setEmail(ele?.rpc_Url)
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
    // var url = endpoints.update_users;
    console.log(selected, "selsec")
    try {
      console.log(name, "dsfadf")
      if (name == '') {
        setnameError('Please Enter Amount')
      } else {
        const address = await window.ethereum.request({
          method: "eth_requestAccounts"
        });

        var WEB = new Web3(window.ethereum);
        const browserChainid = await WEB.eth.getChainId()
        if (Number(browserChainid) != selected?.Network?.chainId) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: WEB.utils.toHex(selected?.Network?.chainId) }]
          });
        }
        const conractInstance = await new WEB.eth.Contract(erc20, selected?.Reward_Token)
        console.log(selected?.contractAddress, name, "sdelsef")
        const deci = await conractInstance.methods.decimals().call()
        console.log("🚀 ~ updates ~ deci:", deci, address[0], (Number(name) * (10 ** Number(deci))).toString())
        // const trans = await conractInstance.methods.transfer(selected?.contractAddress, (Number(name) * (10 ** Number(deci))).toString()).send({
        //   from: address[0]
        // })
        const trans = await conractInstance.methods.transfer(selected?.contractAddress, (Number(name) * (10 ** Number(deci))).toString()).send({
          from: address[0]
        })
        console.log("🚀 ~ trans ~ trans:", trans)
        if (trans) {
          setname('')
          setOpen(false)
          toast.success("Amount Added Successfully", {
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
      // const payload = {
      //   id: id,
      //   chain: name,
      //   rpc_Url: email,
      // }
      // const data = await path.postCall({ url, payload });
      // const result = await data.json();
      // if (result.success === true) {
      //   setOpen(false)
      //   getdata()
      //   toast.success(result.message, {
      //     duration: 3000,
      //     position: 'top-right',
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: 'colored',
      //   })
      // }
    }
    catch (error) {
      console.error(error, "sefsduhfisudfhisduf");
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
      temp.action = (
        <Grid container spacing={1} mr={3} px={3} justifyContent="end">
          <Grid item xs={12} md={4} >
            {/* <MDButton color="info" size="small" onClick={() => { setOpen(true); updateValue(element) }} >
              View
            </MDButton> */}
            <MDButton color="info" size="small" onClick={() => { navigate(`${endpoints.front}/FarmingAddPairs`, { state: { data: element } }) }} >
              View
            </MDButton>
          </Grid>
          <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" onClick={() => { setOpen(true); updateValue(element) }} >
              Add Amount
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
        // { Header: "Id", accessor: "Id", width: "10%", align: "center" },
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
                Add Amount
              </MDTypography>
              <div style={{ display: "flex", flexDirection: "column", margin: "auto", textAlign: "center", gap: "1em", padding: "1em" }}>

                <TextField id="outlined-basic"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value); setnameError(null)
                  }} label="Amount" variant="outlined" />

                {nameerror && <p style={{ color: 'red', fontSize: "12px" }}> {nameerror}</p>}

                <label>Amount:{amountss} </label>

                {/* <TextField id="outlined-basic" label="RpcUrl"
                  value={email}
                  onChange={(e) => {
                    //    console.log(e.target.value,"Done ")
                    setEmail(e.target.value); setemailError(null)
                  }} variant="outlined" />

                {emailerror && <p style={{ color: 'red', fontSize: "12px" }}> {emailerror}</p>} */}

              </div>

              <Box sx={buttonStyle}>
                <MDButton
                  // onClick={initiaterequst}
                  color="info"
                  size="small"
                  style={{ margin: "0 10px" }}
                  onClick={() => { updates() }}
                >
                  Add Amount
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
