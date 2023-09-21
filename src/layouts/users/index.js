import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";

// Images
import MDTypography from "components/MDTypography";
import SearchIcon from '@mui/icons-material/Search';

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

      temp.action = (
        <Grid container spacing={1} mr={1} px={3} justifyContent="start">
          <Grid item xs={12} md={4} >
            <MDButton color="info" size="small" onClick={() => { editcoinprice(element); setSelc(element) }}>
              Add
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


  return (
    <DashboardLayout>
      <DashboardNavbar />
      {viewdetails ?
        <>
          <UserView
            Viewdetails={ViewUserdetails}
            userdata={userdata}
            getUser={getUser}
            detail={value}
            selc={selc}
          />

        </>
        :
        <>
          {ciewdetails ?
            <>
              <LiquidityAdd
                Viewdetails={CiewUserdetails}
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
                      <MDButton variant="gradient" color="info" onClick={() => CiewUserdetails()} fullWidth>
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
