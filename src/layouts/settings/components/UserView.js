import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
// Material Dashboard 2 React components
import { Theme, useTheme } from '@mui/material/styles';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MDTypography from "components/MDTypography";
import { ToastContainer, toast } from "react-toastify";
import Icon from "@mui/material/Icon";
import Skeleton from "@mui/material/Skeleton";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "bootstrap";
function getStyless(name, docName, theme) {
    return {
      fontWeight:
        docName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "10px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: "20px 0",
};
const styleAbout = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  borderRadius: "10px",
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: "20px 0",
};
const useStyles = makeStyles({
  grid: {
    paddingTop: "0!important",
  },
  grid1: {
    ["@media (max-width:767px)"]: {
      paddingTop: "0!important",
    },
  },
  details: {
    padding: "20px 10px",
  },
  title: {
    fontSize: 25,
    padding: "20px 0",
  },
});

const validationSchemapass = yup.object().shape({
  oldpassword: yup.string().required("Password is required"),
  newpassword: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmpassword: yup.string().when("newpassword", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf(
        [yup.ref("newpassword")],
        "Confrim Password need to be the same as New Password"
      ),
  }),
});
const validationSchemaDoc = yup.object().shape({
    name: yup.string().required("name is required")
  });

const validationSchema = yup.object().shape({
  token: yup.string().required("Required"),
});

function UserView(props) {
  const classes = useStyles();
  const path = usercalls();
  const Viewdetails = props.Viewdetails;
  const loading = props.loading;
  const getadmin = props.getadmin;
  const adminData = props.adminData;
  const [twofactor, setTwofactor] = useState(false);
  const [secretecode, setSecretecode] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openpass, setOpenpass] = React.useState(false);
  const [openDoc, setOpenDoc] = React.useState(false);
  const [openwallet, setOpenwallet] = React.useState(false);
  const [editDoc, setEditDoc] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenpass = () => setOpenpass(true);
  const handleOpenDoc = () => setOpenDoc(true);
  const handleClosepass = () => setOpenpass(false);
  const handleCloseDoc = () => setOpenDoc(false);
  const handleOpenwallet = () => setOpenwallet(true);
  const handleClosewallet = () => setOpenwallet(false);
  const [enablee, setEnablee] = useState(false);
  const [passwordshown, setPasswordshown] = useState(false);
  const [passwordshown1, setPasswordshown1] = useState(false);
  const [passwordshown2, setPasswordshown2] = useState(false);
  const [aboutusData, setAboutusData] = useState("");
  const [docData, setDocData] = useState([])

  const [userdataapass, setUserdataapass] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [userdataDoc, setUserdataDoc] = useState({
    name: "",
  });
  const [userdataa, setUserdataa] = useState({
    token: "",
  });
  const [userdataaedit, setUserdataaedit] = useState({
    maximum_withdraw: "",
    minimum_withdraw: "",
    withdraw_limit: "",
  });
  useEffect(() => {
    const f2A_enable = sessionStorage.getItem("enable");
    if (f2A_enable == "true") {
      setTwofactor(true);
    }
    getAboutUs();
    getDocData()
  }, []);

  const enableTwofactor = async () => {
    handleOpen();
    const url = endpoints.twofacreate;
    try {
      const data = await path.postCallTokenonly({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          setSecretecode(result.data.secret);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const theme = useTheme();
  const changepassword = async () => {
    handleOpenpass();
  };
  const uploadDocument = async () => {
    handleOpenDoc();
  };
  const togglePassword = () => {
    setPasswordshown(!passwordshown);
  };
  const togglePassword1 = () => {
    setPasswordshown1(!passwordshown1);
  };
  const togglePassword2 = () => {
    setPasswordshown2(!passwordshown2);
  };
  const disableTwofactor = async () => {
    handleOpen();
    setEnablee(true);
  };

  const [editorState, setEditorState] = useState(() =>
  
    EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(aboutusData)))
  );
  //   setEditorState(EditorState.createWithContent(
  //         ContentState.createFromBlockArray(
  //             convertFromHTML(aboutusData)
  //           )))
  const handleEditorChange = (state) => {
    setEditorState(state);
    // sendContent();
  };
  const handleEdit =()=>{
    setEditDoc(true)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdataa,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values);
    },
  });

  const formikpass = useFormik({
    enableReinitialize: true,
    initialValues: userdataapass,
    validationSchema: validationSchemapass,
    onSubmit: async (values) => {
      onFormsubmitpassword(values);
    },
  });

  const formikAboutus = useFormik({
    enableReinitialize: true,
    initialValues: userdataDoc,
    validationSchema: validationSchemaDoc,
    onSubmit: async (values) => {
      onFormsubmitAboutus(values);
    },
  });
  const onFormsubmitAboutus = async (values) => {
    const url = endpoints.aboutus;
    const payload = {
      name: values.name,
      key: values.name,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    try {
      const data = await path.postCall({ url, payload });
      const result = await data.json();
      if (result.status === true) {
        toast.success("update successfully !", {
          duration: 3000,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        handleCloseDoc();
        getAboutUs();
      } else {
        toast.error(result.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        handleCloseDoc();
      }
      handleCloseDoc();
    } catch (error) {
      console.error(error);
    }
  };
  const formikedit = useFormik({
    enableReinitialize: true,
    initialValues: userdataaedit,
    onSubmit: async (values) => {
      onFormsubmitedit(values);
    },
  });
  const onFormsubmitedit = async (values) => {
    setUserdataaedit(values);
    const url = endpoints.adminwallet;
    const payload = {
      _id: adminData._id,
      maximum_withdraw: values.maximum_withdraw,
      minimum_withdraw: values.minimum_withdraw,
      withdraw_limit: values.withdraw_limit,
    };
    try {
      const data = await path.putCall({ url, payload });
      const result = await data.json();
      if (result.status === true) {
        toast.success(result.msg, {
          duration: 3000,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getadmin();
        handleClosewallet();
      } else {
        toast.error(result.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getadmin();
        handleClosewallet();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFormsubmitpassword = async (values) => {
    setUserdataapass(values);
    const url = endpoints.changepassword;
    if (userdataapass) {
      const payload = {
        password: values.newpassword,
        oldpassword: values.oldpassword,
      };
      try {
        const data = await path.postCall({ url, payload });
        const result = await data.json();
        if (result.status === true) {
          toast.success(result.msg, {
            duration: 3000,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          handleClosepass();
        } else {
          toast.error(result.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          handleClosepass();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onFormsubmit = async (values) => {
    setUserdataa(values);
    if (enablee === true) {
      const url = endpoints.twofaverify;
      if (userdataa) {
        const payload = {
          token: values.token,
          revoke: true,
        };
        try {
          const data = await path.postCall({ url, payload });
          const result = await data.json();
          if (result.status === true) {
            toast.success(result.msg, {
              duration: 3000,
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            sessionStorage.setItem("enable", "false");
            setTwofactor(false);
            handleClose();
          } else {
            toast.error(result.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            handleClose();
            setTwofactor(true);
            sessionStorage.setItem("enable", "true");
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      const url = endpoints.twofaverify;
      if (userdataa) {
        const payload = {
          token: values.token,
        };
        try {
          const data = await path.postCall({ url, payload });
          const result = await data.json();
          if (result.status === true) {
            toast.success(result.msg, {
              duration: 3000,
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            sessionStorage.setItem("enable", "true");
            setTwofactor(true);
            handleClose();
          } else {
            toast.error(result.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            handleClose();
            setTwofactor(false);
            sessionStorage.setItem("enable", "false");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  const getAboutUs = async (docname) => {
    const url = `${endpoints.getDoc}?key=${docname}`;
   
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      console.log(result.data[0]);
      if (result.status === true) {
        setAboutusData(result?.data[0]?.description);
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(result?.data[0]?.description)
            )
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDocData = async () => {
    const url = `${endpoints.getDoc}`;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      setDocData(result.data)
      if (result.status === true) {
        // setAboutusData(result.data[0].description);
        // setEditorState(
        //   EditorState.createWithContent(
        //     ContentState.createFromBlockArray(
        //       convertFromHTML(result.data[0].description)
        //     )
        //   )
        // );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [docName, setDocName] = React.useState([]);

  const handleChange = (e) => {
    setDocName(e.target.value)
    getAboutUs(e.target.value)
  };
  
  return (
    <>
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
          {enablee ? null : (
            <div style={{ textAlign: "center" }}>
              <h5>QR Code</h5>
              {secretecode ? (
                <img
                  src={`https://chart.googleapis.com/chart?chs=200x200&chld=M%7C0&cht=qr&chl=otpauth://totp/cricket?secret=${secretecode}&issuer=cricket`}
                />
              ) : null}
            </div>
          )}

          {/* <label style={{ padding: '0 20px 10px' }}>Enter six digit code</label> */}
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={6} mr={3} px={3}>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="token"
                    name="token"
                    label="Enter six digit code"
                    variant="outlined"
                    onChange={formik.handleChange}
                    error={formik.touched.token && Boolean(formik.errors.token)}
                    helperText={formik.touched.token && formik.errors.token}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={6}
              mr={3}
              px={3}
              sx={{ marginTop: "10px" }}
            >
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  onClick={handleClose}
                  fullWidth
                >
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="submit"
                  fullWidth
                >
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {/* password */}
      <Modal
        open={openpass}
        onClose={handleOpenpass}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label style={{ padding: "0 20px 10px", marginBottom: "20px" }}>
            Change Password
          </label>
          <form onSubmit={formikpass.handleSubmit}>
            <Grid container spacing={1} mr={3} px={3} mt={1}>
              <Grid item xs={12}>
                <MDBox sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    id="oldpassword"
                    name="oldpassword"
                    label="Old Password"
                    variant="outlined"
                    type={passwordshown ? "text" : "password"}
                    onChange={formikpass.handleChange}
                    error={
                      formikpass.touched.oldpassword &&
                      Boolean(formikpass.errors.oldpassword)
                    }
                    helperText={
                      formikpass.touched.oldpassword &&
                      formikpass.errors.oldpassword
                    }
                  />
                  {passwordshown ? (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword}
                    >
                      visibility
                    </Icon>
                  ) : (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword}
                    >
                      visibility_off
                    </Icon>
                  )}
                </MDBox>
              </Grid>

              <Grid item xs={12}>
                <MDBox sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    id="newpassword"
                    name="newpassword"
                    label="New Password"
                    variant="outlined"
                    type={passwordshown2 ? "text" : "password"}
                    onChange={formikpass.handleChange}
                    error={
                      formikpass.touched.newpassword &&
                      Boolean(formikpass.errors.newpassword)
                    }
                    helperText={
                      formikpass.touched.newpassword &&
                      formikpass.errors.newpassword
                    }
                  />
                  {passwordshown2 ? (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword2}
                    >
                      visibility
                    </Icon>
                  ) : (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword2}
                    >
                      visibility_off
                    </Icon>
                  )}
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    id="confirmpassword"
                    name="confirmpassword"
                    label="Confirm   Password"
                    variant="outlined"
                    type={passwordshown1 ? "text" : "password"}
                    onChange={formikpass.handleChange}
                    error={
                      formikpass.touched.confirmpassword &&
                      Boolean(formikpass.errors.confirmpassword)
                    }
                    helperText={
                      formikpass.touched.confirmpassword &&
                      formikpass.errors.confirmpassword
                    }
                  />
                  {passwordshown1 ? (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword1}
                    >
                      visibility
                    </Icon>
                  ) : (
                    <Icon
                      fontSize="small"
                      sx={{ position: "absolute", top: "25%", right: "4%" }}
                      onClick={togglePassword1}
                    >
                      visibility_off
                    </Icon>
                  )}
                </MDBox>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={6}
              mr={3}
              px={3}
              sx={{ marginTop: "10px" }}
            >
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  onClick={handleClosepass}
                  fullWidth
                >
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="submit"
                  fullWidth
                >
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {/* wallet */}
      <Modal
        open={openDoc}
        fullWidth={true}
        onClose={handleOpenDoc}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleAbout}>
          <form onSubmit={formikAboutus.handleSubmit}>
            <Grid item xs={12}>
              <div style={{ display: "flex", flexDirection: "row" }}>
              {editDoc ?
              <>
              <MDBox sx={{ position: "relative" ,padding:"0 20px"}}>
              <Select
          displayEmpty
          value={docName}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Select..</em>;
            }

            return selected;
          }}
        //   MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {docData?.map((element,i)=>{
            return(
             <MenuItem
             key={i}
             value={element.name}
            //  style={getStyless(element.name, docName, theme)}
           >
             {element.name}
           </MenuItem>
            )
          })
         
}
        </Select>       
              </MDBox>
              <MDButton
                style={{ padding: "0 50px", marginBottom: "20px",marginLeft:"200px" }}
                  variant="gradient"
                  color="dark"
                  onClick={()=>{setEditDoc(false);setEditorState(EditorState.createEmpty())}}
                
                >
                New
                </MDButton>  
              </>:
              <>
                <label style={{ padding: "0 20px 10px", marginBottom: "20px" }}>
                  Name
                </label>
                <MDBox sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Enter the Name"
                    variant="outlined"
                    type="text"
                    onChange={formikAboutus.handleChange}
                    error={
                      formikAboutus.touched.name &&
                      Boolean(formikAboutus.errors.name)
                    }
                    helperText={
                      formikAboutus.touched.name && formikAboutus.errors.name
                    }
                  />
                </MDBox>
               
                
                <MDButton
                style={{ padding: "0 50px", marginBottom: "20px",marginLeft:"200px" }}
                  variant="gradient"
                  color="dark"
                  onClick={handleEdit}
                
                >
                  Edit
                </MDButton>
                </>
}
              </div>
            </Grid>
            <Grid container spacing={1} mr={3} px={3} mt={1}>
              <Editor
                editorState={editorState}
                // defaultEditorState={editorState}
                onEditorStateChange={(editorState) => {
                  setEditorState(editorState);
                  handleEditorChange(editorState);
                }}
                // onEditorStateChange={handleEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{ border: "1px solid green", height: 300 }}
                wrapperStyle={{ width: 1000, border: "1px solid black" }}
              />
            </Grid>
            <Grid
              container
              spacing={6}
              mr={3}
              px={3}
              sx={{ marginTop: "10px" }}
            >
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  onClick={handleCloseDoc}
                  fullWidth
                >
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="submit"
                  fullWidth
                >
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openwallet}
        onClose={handleClosewallet}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formikedit.handleSubmit} style={{ margin: "10px 0" }}>
            <Grid container spacing={1} mr={3} px={3}>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="maximum_withdraw"
                    name="maximum_withdraw"
                    label="Maximum Withdraw"
                    variant="outlined"
                    defaultValue={adminData.maximum_withdraw}
                    onChange={formikedit.handleChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="minimum_withdraw"
                    name="minimum_withdraw"
                    label="Minimun Withdraw"
                    variant="outlined"
                    defaultValue={adminData.minimum_withdraw}
                    onChange={formikedit.handleChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="withdraw_limit"
                    name="withdraw_limit"
                    label="Withdraw Limit"
                    variant="outlined"
                    defaultValue={adminData.withdraw_limit}
                    onChange={formikedit.handleChange}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={6}
              mr={3}
              px={3}
              sx={{ marginTop: "10px" }}
            >
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  onClick={handleClosewallet}
                  fullWidth
                >
                  Back
                </MDButton>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="submit"
                  fullWidth
                >
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <MDBox pt={2} pb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Card>
              <Grid container spacing={0} px={2} pt={2}>
                <Grid item md={10} xs={8} textAlign="left">
                  <MDTypography variant="h6" className={classes.title}>
                    Admin Details
                  </MDTypography>
                </Grid>
                <Grid item md={2} xs={4} textAlign="right">
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={() => handleOpenwallet()}
                    fullWidth
                  >
                    Update Wallet
                  </MDButton>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    sx={{ marginTop: "10px", marginLeft: "0" }}
                  >
                    <Grid item md={8} xs={12}>
                      <MDTypography variant="h6" className={classes.details}>
                        Balance
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.grid1}>
                      <MDTypography variant="h6" className={classes.details}>
                        {loading ? (
                          <Skeleton />
                        ) : (
                          <>{adminData && adminData.balance}</>
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item md={8} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        Maximum Withdraw
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        {loading ? (
                          <Skeleton />
                        ) : (
                          <>{adminData && adminData.maximum_withdraw}</>
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item md={8} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        Minimum Withdraw
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        {loading ? (
                          <Skeleton />
                        ) : (
                          <>{adminData && adminData.minimum_withdraw}</>
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item md={8} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        Withdraw Limit
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        {loading ? (
                          <Skeleton />
                        ) : (
                          <>{adminData && adminData.withdraw_limit}</>
                        )}
                      </MDTypography>
                    </Grid>
                    <Grid item md={8} xs={8} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        Two Factor Authentication
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={8} className={classes.grid1}>
                      {twofactor ? (
                        <MDButton
                          variant="gradient"
                          color="dark"
                          onClick={disableTwofactor}
                          fullWidth
                        >
                          Disable
                        </MDButton>
                      ) : (
                        <MDButton
                          variant="gradient"
                          color="info"
                          onClick={enableTwofactor}
                          fullWidth
                        >
                          Enable
                        </MDButton>
                      )}
                    </Grid>
                    <Grid item md={8} xs={8} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        Change Password
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={8} className={classes.grid}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        onClick={changepassword}
                      >
                        Change
                      </MDButton>
                    </Grid>
                    <Grid item md={8} xs={8} className={classes.grid}>
                      <MDTypography variant="h6" className={classes.details}>
                        upload Document
                      </MDTypography>
                    </Grid>
                    <Grid item md={4} xs={8} className={classes.grid}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        onClick={uploadDocument}
                      >
                      upload
                      </MDButton>
                    </Grid>
                  
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Grid container spacing={1} justifyContent="center"></Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default UserView;
