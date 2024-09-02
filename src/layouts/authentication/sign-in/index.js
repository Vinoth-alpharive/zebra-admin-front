import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TextField from '@mui/material/TextField';
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import Icon from "@mui/material/Icon";
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BasicLayout from "layouts/authentication/components/BasicLayout";

import bgImage from "assets/images/banner-bg-img.png";

const validationSchema = yup.object().shape({
  username: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required")
    .min(6, "Password is too short - should be 3 chars minimum"),
});

function Basic() {
  const path = usercalls();
  const navigate = useNavigate();
  const [passwordshown, setPasswordshown] = useState(false);
  const [userdata, setUserdata] = useState({
    password: '',
    username: ''
  })
  useEffect(() => {
    const auth = sessionStorage.getItem('accesstoken');
    if (auth) {
      navigate(`${endpoints.front}/liquidity`)
    }
    else {
      navigate(`${endpoints.front}/login`)
    }


  }, []);

  const onFormsubmit = async (values) => {
    setUserdata(values)
    const url = endpoints.adminlogin;
    if (userdata) {
      const payload = {
        "email": values.username,
        "password": values.password
      }
      try {
        const data = await path.postCallWithoutAuthToken({ url, payload });
        const result = await data.json();
        if (result.success === true) {
          sessionStorage.setItem('accesstoken', result.result.token)
          // sessionStorage.setItem('refreshtoken', result.data.refreshToken)
          // sessionStorage.setItem('enable', result.data.result.f2A_enable)
          // sessionStorage.setItem('log', result.data.result.is_first_log)
          sessionStorage.setItem('id', result.result.admin._id)
          sessionStorage.setItem('roletype', result.result.admin.role)
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
          window.location.reload(true)
          navigate(`${endpoints.front}/liquidity`);
          // if (result.data.result.name === "Super Admin") {
          //   navigate("/dashboard");
          // }
          // else if (result.data.result.is_first_log === "true") {
          //   navigate("/reset");
          // }
          // else {
          //   if (result.data.result.f2A_enable === true) {
          //     navigate("/twofa");
          //   }
          //   else {
          //     navigate("/dashboard");
          //   }
          // }

        }
        else{
          toast.error("password is incorrect", {
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
        // else{
        //   toast.error("password is incorrect", {
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
        console.error(error);
      }
    }
  };

  const togglePassword = () => {
    setPasswordshown(!passwordshown);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userdata,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onFormsubmit(values)
    },
  });



  return (
    <BasicLayout image={bgImage}>
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
      <Card>
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="dark"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"

        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={formik.handleSubmit}>
            <MDBox mb={2}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </MDBox>
            <MDBox mb={2} sx={{ position: 'relative' }}>
              <TextField
                sx={{ width: '100%' }}
                id="password"
                name="password"
                label="Password"
                type={passwordshown ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              {passwordshown ? <Icon fontSize="small" sx={{ position: 'absolute', top: '25%', right: '4%' }} onClick={togglePassword}>visibility</Icon> :
                <Icon fontSize="small" sx={{ position: 'absolute', top: '25%', right: '4%' }} onClick={togglePassword}>visibility_off</Icon>}

            </MDBox>

            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="dark" type="submit" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
