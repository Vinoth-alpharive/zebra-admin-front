import { useState, useEffect } from "react";
import React from "react";
import Grid from "@mui/material/Grid";

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
  game: yup.string().required("Required"),
});

function Users() {
  var formdata = new FormData();
  var formdata1 = new FormData();
  const classes = useStyles();
  const path = usercalls();
  const [userr, setUserr] = useState([])
  const [collection, setCollection] = useState({})
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [userdataa, setUserdataa] = useState({
    game: '',
  });
  const [tropyFile, setTropyFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    getdata();
  }, [])
  const getdata = async () => {
    setLoading(true);
    const url = endpoints.addgame;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          buildData(result.data);
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const editGame = async (e) => {
    e.preventDefault();
    let bg_image;
    let game_image;
    if (selectedFile) {
      bg_image = await uploadImage(selectedFile);
    }
    if (tropyFile) {
      game_image = await uploadImage(tropyFile);
    }
    const url = endpoints.addgame;
    var payload = {
      "_id": userr._id,
      "name": (userr.game ? userr.game : userdataa.game),
      "backgroundImage": (bg_image ? bg_image : userr.backgroundImage),
      "gameImage": (game_image ? game_image : userr.gameImage),
    }
    try {
      const data = await path.putCall({ url, payload });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          getdata();
          buildData(result.data);
          handleClose1();
        }
      }
      handleClose1();
      getdata();
    }
    catch (error) {
      console.error(error);
    }
    handleClose1();
    getdata();
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
      temp.bgimage = (
        <MDTypography variant="caption" color="text" fontWeight="medium" >
          <img src={element.backgroundImage} style={{
            padding: "30px", backgroundImage: 'linear-gradient(149.99deg, #040446 -0.05%, #022874 -0.05%, #002063 26.59%, #00268A 59.44%, #0A1464 77.17%, #021B6E 100.06%)', borderRadius: "12px"
          }} />
        </MDTypography >
      )
      temp.date = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {moment(element.createdAt).format('llll')}
        </MDTypography>
      )
      temp.created = (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {element.createdBy.name}
        </MDTypography>
      )
      temp.game = (
        <div style={{ display: "flex", columnGap: "10px" }}>
          <MDTypography variant="caption" color="text" fontWeight="medium" alignSelf="center">
            {element.name.toUpperCase()}
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            <img src={element.gameImage} />
          </MDTypography>
        </div>
      )
      temp.action = (
        <>
          <MDButton color="warning" size="small" onClick={() => openModal1(element)}>
            Edit
          </MDButton>
        </>
      )

      tempArr.push(temp)

    });
    setCollection({
      columns: [
        { Header: "SR.No", accessor: "srno", align: "center" },
        { Header: "Date", accessor: "date", align: "center" },
        { Header: "Created By", accessor: "created", align: "center" },
        { Header: "BG Image", accessor: "bgimage", align: "center" },
        { Header: "Game", accessor: "game", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
      ],
      rows: tempArr
    })
  }
  const openModal = () => {
    handleOpen();
  }
  const openModal1 = (element) => {
    setUserr(element)
    handleOpen1();
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
    const id = sessionStorage.getItem('id');
    const bg_image = await uploadImage(selectedFile);
    const game_image = await uploadImage(tropyFile);
    if (bg_image) {
      const url = endpoints.addgame;
      const payload = {
        "createdBy": id,
        "name": values.game.toLowerCase(),
        "backgroundImage": bg_image,
        "gameImage": game_image,
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
          <h4 style={{ textAlign: 'center' }}>Add Game</h4>
          <form style={{ margin: '10px 0' }} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
                <InputLabel sx={{ marginBottom: '10px' }}>Background Image</InputLabel>
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
              <Grid item xs={12}>
                <InputLabel sx={{ marginBottom: '10px' }}>Game Image</InputLabel>
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
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="game"
                    name="game"
                    label="Game"
                    variant="outlined"
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        game: e.target.value
                      })
                      formik.handleChange(e)
                    }}
                    error={formik.touched.game && Boolean(formik.errors.game)}
                    helperText={formik.touched.game && formik.errors.game}
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
                <MDButton variant="gradient" color="info" type="submit" fullWidth>
                  Add
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
          <h4 style={{ textAlign: 'center' }}>Add Game</h4>
          <form style={{ margin: '10px 0' }} onSubmit={editGame}>
            <Grid container spacing={2} mr={3} px={3}>
              <Grid item xs={12}>
                <InputLabel sx={{ marginBottom: '10px' }}>Background Image</InputLabel>
                <MDBox>
                  <TextField
                    fullWidth
                    id="image"
                    name="image"
                    variant="outlined"
                    accept="image/jpeg"
                    type="file"
                    // defaultValue={userr.backgroundImages}
                    onChange={handleCapture}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ marginBottom: '10px' }}>Game Image</InputLabel>
                <MDBox>
                  <TextField
                    fullWidth
                    id="cupimage"
                    name="cupimage"
                    variant="outlined"
                    accept="image/jpeg"
                    type="file"
                    // defaultValue={userr.gameImage}
                    onChange={handleCapture1}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="game"
                    name="game"
                    label="Game"
                    variant="outlined"
                    defaultValue={userr.name}
                    onChange={(e) => {
                      setUserdataa({
                        ...userdataa,
                        game: e.target.value
                      })
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleClose1} fullWidth>
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

      <Grid container spacing={2} mr={3} justifyContent="end">
        <MDButton variant="gradient" color="info" sx={{ marginLeft: '10px' }}
          onClick={openModal}>
          Add Game
        </MDButton>
      </Grid>
      <GameList
        collection={collection}
        loading={loading}
      />

    </DashboardLayout >
  );
}

export default Users;
