import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import { ToastContainer, toast } from 'react-toastify'
import { makeStyles } from '@mui/styles';
import SubadminList from "./components/SubadminList";
import SubadminCreate from "./components/SubadminCreate";
import SubAdminView from "./components/SubAdminView";
import moment from 'moment'
import * as yup from 'yup';  
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
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
const useStyles = makeStyles({
  inputfields: {
    height: "40px",
    color: "#000",
    padding: " 5px 10px",
    borderRadius: "6px",
    border: "solid 1px #cbcbcb",
    width: "220px",
    '&:focus-visible': {
      outline: 'none',
    },
  },
});

function Users() {
  const classes = useStyles();
  const [user, setUser] = useState([])
  const path = usercalls();
  const navigate = useNavigate();
  const [getdetails, setGetdetails] = useState(false)
  const [collection, setCollection] = useState({})
  const [search, setSearch] = useState('')
  const [viewsubadmin, setViewsubAdmin] = useState(false)
  const [admindetails, setAdmindetails] = useState({})
  const [passwordId, setPasswordId] = useState('')
    const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose =async () => {
    setOpen(false);
    
  }
  const [userdataa, setUserdataa] = useState({
    password: ''
});


  const viewadmin = (element) => {
    setViewsubAdmin(!viewsubadmin);
    setAdmindetails(element);
  }

  const CreateAdmin = () => {
    setGetdetails(!getdetails);
  }
  useEffect(() => {
    const token = sessionStorage.getItem('roletype');
    if (token === "SUPERADMIN") {
      getdata();
    }
    else {
      navigate("/dashboard");
    }
  }, [])

  const getdata = async () => {
    setLoading(true);
    const url = endpoints.subadminlist;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          buildData(result.data);
          setUser(result.data);
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const resetPassword = async (element) => {
    setPasswordId(element._id)
    handleOpen();
} 
const validationSchema = yup.object().shape({
  password: yup.string().required('No password provided.') 
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')

});
const deleteAdmin = async(element)=>{
  try {
  const url = endpoints.update;
  const payload = {
      "userid": element._id,
      "active":"false"
    }
    const data = await path.putCall({ url, payload });
    const result = await data.json();
    if (result.status === true) {
        toast.success(result.data, {
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
        getdata()
    }
}catch (error) {
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
      temp.id = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {moment(element.createdAt).format("llll")}
        </MDTypography>
      )
      temp.email = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.email}
        </MDTypography>
      )
      temp.name = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.name}
        </MDTypography>
      )
      temp.action = (
        <>
          <MDButton color="info" size="small" onClick={() =>resetPassword(element)} >
            Reset password
          </MDButton>
          <MDButton color="error" size="small" onClick={() => deleteAdmin(element)} sx={{ marginLeft: "10px" }}>
            Disable
          </MDButton>
        </>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Created At", accessor: "id", align: "center" },
        { Header: "Email", accessor: "email", align: "left" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Action", accessor: "action", width: "10%", align: "center" },
      ],
      rows: tempArr
    })
  }
  const onSearchChange = async (event) => {
    setSearch(event.target.value)
  }
  useEffect(() => {
    if (search == '') {
      buildData(user)
    } else {
      const query = search;
      const items = []
      user.filter(function (item) {
        if (item.name) {
          if (item.name.indexOf(query) > -1) {
            items.push(item)
          }
        }
      })
      buildData(items)
    }
  }, [search])

  const onFormsubmit = async (values,) => {
    setUserdataa(values);
    const url = endpoints.resetpassword;
    if (userdataa) {
        const payload = {
            "userid": passwordId,
            "password": values.password
        }
        try {
            const data = await path.postCall({ url, payload });
            const result = await data.json();
            if (result.status === true) {
                toast.success(result.data, {
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
                handleClose();
                setUserdataa('')
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
                setUserdataa('');
            }
        }
        catch (error) {
            console.error(error);
        }
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
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {
        getdetails ?
          <SubadminCreate
            Createadmin={CreateAdmin}
          />
          :
          <>
            {viewsubadmin ?
              <SubAdminView
                Viewadmin={viewadmin}
                Admindetails={admindetails}
              />
              :
              <>
                <Grid container spacing={2} mr={3} justifyContent="end">
                  <Grid item xs={12} md={3} textAlign="right">
                    <div className="mb-3" style={{ position: 'relative' }}>
                      <div className="searchbar-icon1"          >
                        <input
                          type="text"
                          className={classes.inputfields}
                          onChange={onSearchChange}
                          placeholder="Search user Name"
                        />
                        <span className="search-icon pe-2 text-dark">
                          <SearchIcon sx={{ color: '#88a4b2', marginTop: '12px', position: "absolute", right: "3%" }} />
                        </span>
                      </div>
                    </div>
                  </Grid>
                  <Grid item md={1} xs={12}>
                    <MDButton variant="gradient" color="info" onClick={CreateAdmin} fullWidth>
                      Create
                    </MDButton>
                  </Grid>
                </Grid>
                <SubadminList
                  Createadmin={CreateAdmin}
                  Collection={collection}
                  loading={loading}
                />
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <label style={{ padding: '0 20px 10px' }}>Enter Password</label>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={6} mr={3} px={3}>
                            <Grid item xs={12}>
                                <MDBox>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Enter Password"
                                        variant="outlined"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                </MDBox>
                            </Grid>
                        </Grid>
                        <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
                            <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                                <MDButton variant="gradient" color="dark" onClick={ e => {formik.resetForm();handleClose()}} fullWidth>
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
              </>
            }
          </>

      }
    </DashboardLayout >
  );
}

export default Users;
