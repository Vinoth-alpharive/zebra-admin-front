import { useState, useEffect } from "react";
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';



// Material Dashboard 2 React components
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import AssetList from "./components/AssetList";
import AssetCreate from "./components/AssetCreate";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";

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
  coinprice: yup.number().required("Required"),
});


const currencies = [
  {
    value: 'USD',
    label: 'USD',
  },
  {
    value: 'USDT',
    label: 'USDT',
  },]



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
  const classes = useStyles();
  const path = usercalls();
  const navigate = useNavigate();
  const [getdetails, setGetdetails] = useState(false)
  const [collection, setCollection] = useState({})
  const [enable, setEnable] = useState(false)
  const [data, setData] = useState(false)
  const [id, setId] = useState('')
  const [price, setPrice] = useState('')
  const [search, setSearch] = useState('')
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true);
  const editcoinprice = (element) => {
    handleOpen();
    setId(element.users._id);
    setPrice(element.price)
  }
  const [userdata, setUserdata] = useState({
    coinprice: price,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const CreateAdmin = () => {
    setGetdetails(!getdetails);
  }
  const onSearchChange = async (event) => {
    setSearch(event.target.value)
  }
  useEffect(() => {
    if (search == '') {
      buildData(user)
    } else {
      const query = search
      const items = []
      user.filter(function (item) {
        if (item.coinname
        ) {
          if (item.coinname
            .indexOf(query) > -1) {
            items.push(item)
          }
        }
      })
      buildData(items)
    }
  }, [search])

  useEffect(() => {
    getdata();
  }, [])

  const getdata = async () => {
    setLoading(true);
    const url = endpoints.createasset;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.success === true) {
        if (result && result.result) {
          setLoading(false);
          buildData(result.result);
          setUser(result.result);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdata,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values)
    },
  });

  const onFormsubmit = async (values) => {
    setUserdata(values)
    const url = endpoints.createasset;
    const auth = sessionStorage.getItem('accesstoken');
    axios
      .post("http://142.93.42.165/betback/v1/auth/walletAmountAdd", {
        user_id: id,
        Amount: values.coinprice,
      }, {
        headers: {
          Authorization: auth,
        }
      })
      .then((response) => {
        getdata()
        setOpen(false)
        toast.success(response.data.message, {
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
      }).catch((error) => {
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      });

    // if (userdata) {
    //   const payload = {
    //     "_id": id,
    //     "price": values.coinprice,
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
    //       handleClose();
    //       getdata();
    //     }
    //     else {
    //       toast.error(result.msg, {
    //         position: 'top-right',
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: 'colored',
    //       })
    //       handleClose();
    //       getdata();
    //     }
    //   }
    //   catch (error) {
    //     console.error(error);
    //   }
    // }
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
      temp.id = (
        <>
          {/* <Grid container mr={3} justifyContent="start"> */}
          {/* <Grid item xs={12} md={4} textAlign="left" alignSelf="center">
              <img src={element.image} class="img-fluid" width="30" />
            </Grid> */}
          {/* <Grid item xs={12} md={8} mb={1} textAlign="center" alignSelf="center"> */}
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {element?.users?.user_name}
          </MDTypography>
          {/* </Grid> */}
          {/* </Grid> */}
        </>
      )
      temp.emails = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.users?.email}
        </MDTypography>
      )
      temp.email = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.stripe_balance}
        </MDTypography>
      )
      temp.name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element?.usdt_balance}
        </MDTypography>
      )
      temp.action = (
        <MDButton color="info" size="small" onClick={() => editcoinprice(element)}>
          Edit
        </MDButton>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Name", accessor: "id", align: "left" },
        { Header: "Email", accessor: "emails", align: "center" },
        { Header: "USD Balance", accessor: "email", align: "center" },
        { Header: "USDT Balance", accessor: "name", align: "center" },
        { Header: "Action", accessor: "action", width: "10%", align: "center" },
      ],
      rows: tempArr
    })
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
              <span className="search-icon pe-2 text-dark">
                <SearchIcon sx={{ color: '#88a4b2', marginTop: '10px', position: "absolute", right: "3%" }} />
              </span>
            </div>
          </div>
        </Grid>
        <Grid item md={1} xs={12}>
          <MDButton variant="gradient" color="info" onClick={() => CreateAdmin()} fullWidth>
            Create
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
          <label style={{ padding: '0 20px 0px' }}>Enter Coin Price</label>
          <TextField style={{ minWidth: "135px", padding: "2px 0" }}
            id="standard-select-currency-native"
            select
            //  label="Native select"
            defaultValue="EUR"
            SelectProps={{
              native: true,
            }}
            //  helperText="Please select your currency"
            variant="standard"
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
                <MDBox mt={2}>
                  <TextField
                    fullWidth
                    id="coinprice"
                    name="coinprice"
                    label="Coin Price"
                    variant="outlined"
                    defaultValue={price}
                    //value={formik.values.coinprice}
                    onChange={formik.handleChange}
                    error={formik.touched.coinprice && Boolean(formik.errors.coinprice)}
                    helperText={formik.touched.coinprice && formik.errors.coinprice}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleClose} fullWidth>
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="info" type="submit" fullWidth onClick={() => {

                }}>
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      {
        getdetails ?
          <AssetCreate
            Createadmin={CreateAdmin}
            enable={enable}
            data={data}
          />
          :
          <>
            <AssetList
              loading={loading}
              Createadmin={CreateAdmin}
              Collection={collection}
            />
          </>

      }
    </DashboardLayout >
  );
}

export default Users;
