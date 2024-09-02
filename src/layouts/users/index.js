import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import Web3 from 'web3';
import CircularProgress from '@mui/material/CircularProgress';
// Images
import MDTypography from "components/MDTypography";
import SearchIcon from '@mui/icons-material/Search';
import MDBox from "components/MDBox";
// import MDButton from "components/MDButton";
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import UserList from "./components/UserList";
import UserView from "./components/UserView";
import LiquidityAdd from "./components/LiquidityAdd";
import { useFormik } from 'formik';
import * as yup from 'yup';
import AssetList from "./components/LiquidityAdd"
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import erc20Abi from '../../web3/ABI/erc20.json'
import factoryAbi from '../../web3/ABI/factoryAbi.json'
import ethFactoryAddress from '../../web3/contract/ethFactoryAddress'
import wanFactoryAddress from '../../web3/contract/wanFactoryAddress'

const validationSchema = yup.object().shape({
  coinprice: yup.number().required("Required"),
});

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


function Users() {
  const navigate = useNavigate();
  const path = usercalls();
  const [viewdetails, setViewdetails] = useState(false)
  const [ciewdetails, setCiewdetails] = useState(false)
  const [userdatas, setUserdatas] = useState(false)
  const [bethistory, setBetHistory] = useState(false)
  const [userWallets, setUserWallets] = useState(false)
  const [collection, setCollection] = useState({})
  const [collection1, setCollection1] = useState({})
  const [collection2, setCollection2] = useState({})
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState({})
  const [search, setSearch] = useState('')
  const [walletInfo, setWalletInfo] = useState(false)
  const [value, setvalue] = useState()
  const handleClose = () => setOpen(false);
  const [enable, setEnable] = useState(false)
  const [data, setData] = useState(false)

  const [selc, setSelc] = useState()

  const onSearchChange = async (event) => {
    setSearch(event.target.value)
  }
  const classes = useStyles();

  const userWallet = (element) => {
    // getUser1(element._id);
    // setUserWallets(!userWallets)
  }
  const CreateAdmin = () => {
    setWalletInfo(true)
    // setGetdetails(!getdetails);
  }
  const userWalletsss = () => {
    setUserWallets(!userWallets)
  }
  const ViewUserdetails = () => {
    setViewdetails(!viewdetails);
  }
  const CiewUserdetails = () => {
    setCiewdetails(!ciewdetails);
  }

  const Userdetails = () => {
    setUserdatas(!userdatas);
    getdata()
  }
  const editcoinprice = (element) => {
    getUser(element._id);
    setvalue(element);
    setViewdetails(!viewdetails);
    setCiewdetails(!ciewdetails);
  }
  // const bettingHistory = async (element) => {
  //   getbetdata(element._id);
  //   setBetHistory(!bethistory)
  // }
  const bettingHistoryBack = async () => {

    setBetHistory(!bethistory)
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);


  const [pair1, setPair1] = useState()
  const [pair2, setPair2] = useState()

  const [bal1, setBal1] = useState()
  const [bal2, setBal2] = useState()

  const [statuss, setStatuss] = useState(false)

  const [liqudity, setLiquidity] = useState(false)

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
  }, [search])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdata,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values)
    },
  });
  // const getbetdata = async (id) => {
  //   setLoading(true);
  //   const url = `${endpoints.bethistory}?user_id=${id}`;
  //   try {
  //     const data = await path.getCall({ url });
  //     const result = await data.json();
  //     if (result.status === true) {
  //       if (result && result) {
  //         buildData2(result.data);
  //         setLoading(false);
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }
  const getdata = async () => {
    setLoading(true);
    const url = endpoints.getLiquidity;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result) {
        // if (data && data.data) {
        // for (let i = 0; i < result?.result?.length; i++) {
        //   const element = result?.result?.[i];
        //   console.log(element)

        //   var WEB = new Web3(element?.network?.rpc_Url);
        //   var factoryInstance;
        //   if (element?.network?.name === 'WAN') {
        //     factoryInstance = new WEB.eth.Contract(
        //       factoryAbi,
        //       wanFactoryAddress
        //     )
        //   } else if (element?.network?.name === 'Ethereum Mainnet') {
        //     factoryInstance = new WEB.eth.Contract(
        //       factoryAbi,
        //       ethFactoryAddress
        //     )
        //   }

        //   const pair = await factoryInstance.methods.getPair(element?.address1, element?.address2).call()
        //   const token1 = new WEB.eth.Contract(
        //     erc20Abi,
        //     element.address1
        //   );
        //   const token2 = new WEB.eth.Contract(
        //     erc20Abi,
        //     element.address2
        //   );
        //   if (pair !== '0x0000000000000000000000000000000000000000') {
        //     const decimal1 = await token1.methods.decimals().call()
        //     const decimal2 = await token2.methods.decimals().call()
        //     const val1 = await token1.methods.balanceOf(pair).call()
        //     const val2 = await token2.methods.balanceOf(pair).call()
        //     const bal1 = Number(val1) / (10 ** Number(decimal1))
        //     const bal2 = Number(val2) / (10 ** Number(decimal2))
        //     element.bal1 = bal1
        //     element.bal2 = bal2
        //   }
        // }
        buildData(result.result);
        setLoading(false);
        setUser(result.result)
        // }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const getBalance = async (element) => {
    try {
      console.log(element, "ele")
      // const element = result?.result?.[i];
      // console.log(element)
      setStatuss(true)
      setLiquidity(false)
      setPair1(element?.symbol1)
      setPair2(element?.symbol2)
      handleOpen()

      var WEB = new Web3(element?.network?.rpc_Url);
      var factoryInstance = new WEB.eth.Contract(
        JSON.parse(element?.factory_Abi),
        element?.factory_contract
      )

      const pair = await factoryInstance.methods.getPair(element?.address1, element?.address2).call()
      console.log("🚀 ~ file: index.js:244 ~ getBalance ~ pair:", pair)
      const token1 = new WEB.eth.Contract(
        erc20Abi,
        element.address1
      );
      const token2 = new WEB.eth.Contract(
        erc20Abi,
        element.address2
      );
      if (pair !== '0x0000000000000000000000000000000000000000') {
        const decimal1 = await token1.methods.decimals().call()
        const decimal2 = await token2.methods.decimals().call()
        const val1 = await token1.methods.balanceOf(pair).call()
        const val2 = await token2.methods.balanceOf(pair).call()
        const bal1 = Number(val1) / (10 ** Number(decimal1))
        console.log("🚀 ~ file: index.js:258 ~ getBalance ~ bal1:", bal1)
        const bal2 = Number(val2) / (10 ** Number(decimal2))
        console.log("🚀 ~ file: index.js:260 ~ getBalance ~ bal2:", bal2)
        // element.bal1 = bal1
        // element.bal2 = bal2
        setBal1(bal1)
        setBal2(bal2)
        setStatuss(false)
      } else {
        setStatuss(false)
        setLiquidity(true)
      }
    } catch (error) {
      console.log("🚀 ~ getBalance ~ error:", error)
      setStatuss(false)
      setLiquidity(true)
    }

  }

  const sts = (pre) => {
    console.log(pre, "pre")
    setViewdetails(!viewdetails);
    getdata();
  }

  const changeStatus = async (Id) => {
    console.log("🚀 ~ changeStatus ~ Id:", Id)
    try {
      const url = endpoints.removePais;
      const payload = { Id: Id }
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      console.log("🚀 ~ changeStatus ~ result:", result)
      if (result?.success == true) {
        toast.success(result?.message, {
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
      } else {
        toast.error(result?.message, {
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

    } catch (error) {
      console.log("🚀 ~ changeStatus ~ error:", error)

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
      // temp.date = (
      //   <MDTypography variant="caption" color="text" fontWeight="medium">
      //     {moment(new Date(parseInt((element._id).substring(0, 8), 16) * 1000)).format('lll')}
      //   </MDTypography>
      // )
      // console.log(moment(new Date(parseInt((element._id).substring(0, 8), 16) * 1000)).format('lll'), "date");
      temp.id = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.pair_symbol}
        </MDTypography>
      )
      temp.c1Name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.symbol1}
        </MDTypography>
      )
      temp.c2Name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.symbol2}
        </MDTypography>
      )
      temp.kyc = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.address1}
        </MDTypography>
      )
      temp.email = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.address2}
        </MDTypography>
      )
      temp.date = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.network.name}
        </MDTypography>
      )
      temp.c1 = (
        // <MDTypography variant="caption" color="text" fontWeight="medium">
        //   {element?.bal1 ? element?.bal1 : '-'}
        // </MDTypography>
        <Grid container spacing={1} mr={1} px={3} justifyContent="start">
          <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" onClick={() => { getBalance(element) }}>
              Balance
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
        </Grid>
      )
      temp.action = (
        <Grid container spacing={5} mr={1} px={3} justifyContent="center">
          <Grid item xs={6} md={4} >
            <MDButton color="info" size="small" onClick={() => { editcoinprice(element), setSelc(element) }}>
              Add
            </MDButton>
          </Grid>

          <Grid item xs={6} md={4} >
            <Switch
              checked={(element?.isVisible == true ? true : false)}
              onChange={() => { changeStatus(element?._id) }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
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
        </Grid>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Pair ", accessor: "id", align: "center" },
        { Header: "Coin1 Name", accessor: "c1Name", align: "center" },
        { Header: "Coin2 Name", accessor: "c2Name", align: "center" },
        { Header: "Coin1 Address", accessor: "kyc", align: "center" },
        { Header: "Coin2 Address", accessor: "email", align: "center" },
        { Header: "Network Name", accessor: "date", align: "center" },
        { Header: "Balance", accessor: "c1", align: "center" },
        { Header: "Action", accessor: "action", width: "15%", align: "center" },
      ],
      rows: tempArr
    })
  }

  const getUser = async (id) => {
    const url = `${endpoints.getusers}?_id=${id}`;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          setUserdata(result.data);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  // const refreshUserData = async () => {
  //   const url = endpoints.getchain;
  //       try {
  //           const data = await path.getCall({ url });
  //           const result = await data.json();
  //           setChrr(result.result)
  //       } catch (error) {
  //           console.log(error, "error");
  //       }
  //   }

  //   useEffect(() => {
  //     refreshUserData();
  //   }, [])


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
      {viewdetails ?
        <>
          <UserView
            ViewUserdetails={ViewUserdetails}
            userdata={userdata}
            getUser={getUser}
            detail={value}
            sts={sts}
            selc={selc}
          />

        </>
        :
        <>

          <Modal
            open={open}
            onClose={() => { setOpen(false); setBal1(); setBal2() }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <label style={{ padding: '0 20px 10px' }}>Balance</label>
              {
                statuss == true ?
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <CircularProgress />
                    </div>


                  </>
                  :
                  <>
                    {liqudity == true ?
                      <div style={{ textAlign: 'center' }}>
                        No Liquidity Available
                      </div> :
                      <form onSubmit={formik.handleSubmit} style={{ margin: '10px 0' }}>
                        <Grid container spacing={6} mr={3} px={3}>
                          <Grid item xs={12}>
                            {/* <MDBox>
                        <TextField
                          fullWidth
                          id="token"
                          name="token"
                          label="Enter No of Tokens"
                          variant="outlined"
                          onChange={formik.handleChange}
                          error={formik.touched.token && Boolean(formik.errors.token)}
                          helperText={formik.touched.token && formik.errors.token}
                        />
                      </MDBox> */}
                            <label>{pair1} </label> :  <span>{bal1} </span>
                            <br></br>
                            <label>{pair2} </label> :  <span>{bal2} </span>

                          </Grid>
                        </Grid>
                        <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
                          <Grid item xs={12} md={12} sx={{ paddingTop: "10px!important" }}>
                            <MDButton variant="gradient" color="dark" onClick={() => { setOpen(false); setBal1(); setBal2() }} fullWidth>
                              Back
                            </MDButton>
                          </Grid>
                          {/* <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                      <MDButton variant="gradient" color="info" type="submit" fullWidth>
                        Add
                      </MDButton>
                    </Grid> */}
                        </Grid>
                      </form>
                    }
                  </>

              }

            </Box>
          </Modal>
          {userdatas ?
            <>
              <LiquidityAdd
                Viewdetails={Userdetails}

              />
              {/* <UserList
                collection={collection2}
                loading={loading}
                userwallets={usLiquidityAdderWallet}
                userWalletsss={userWalletsss}
                username="User Transaction Info"
                button="Back" /> */}

            </>
            :
            <>
              {bethistory ?
                < UserList
                  collection={collection1}
                  loading={loading}
                  bettingHistoryBack={bettingHistoryBack}
                  username="User Betting History"
                  button="Back" />
                : <>
                  { }
                  <Grid container spacing={2} mr={3} justifyContent="end">
                    <Grid item xs={12} md={2} textAlign="right">
                      <div className="mb-3" style={{ position: 'relative' }}>
                        <div className="searchbar-icon1"          >
                          <input
                            type="text"
                            className={classes.inputfields}
                            onChange={onSearchChange}
                            placeholder="Search by Coin name"
                          />
                          <span className="search-icon pe-2 text-dark" Symbol>
                            <SearchIcon sx={{ color: '#88a4b2', marginTop: '10px', position: "absolute", right: "3%" }} />
                          </span>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={1} xs={12}>
                      <MDButton variant="gradient" color="info" onClick={() => Userdetails()} fullWidth>
                        Add Pairs
                      </MDButton>
                    </Grid>
                  </Grid>
                  {
                    walletInfo === true ?
                      <AssetList
                        Createadmin={CreateAdmin}
                        enable={enable}
                        data={data}
                      />
                      :
                      <>Symbol
                        {/* <AssetList
              loading={loading}
              Createadmin={CreateAdmin}
              Collection={collection}
            /> */}
                      </>

                  }
                  {/* {walletInfo === true ?
                   <AddLiquidity
                  Createadmin={CreateAdmin}
                  />
                  :
                   <> </>
                } */}
                  <UserList

                    loading={loading}
                    collection={collection}
                    username="Liquidity Info" />
                </>
              }
            </>}
        </>
      }

    </DashboardLayout >
  );
}

export default Users;
