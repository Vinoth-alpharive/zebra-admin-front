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

import bgImage from "assets/images/bg-sign-in-basic.jpeg";

const validationSchema = yup.object().shape({
  password: yup.string().required("Enter Code")
});

function Basic() {
  const path = usercalls();
  const navigate = useNavigate();
  const [passwordshown, setPasswordshown] = useState(false);
  const [userdata, setUserdata] = useState({
    password: ''
  })


  const onFormsubmit = async (values) => {
    setUserdata(values)
    const id = sessionStorage.getItem('id');
    const url = endpoints.changepassword;
    if (userdata) {
      const payload = {
        "userid": id,
        "password": values.password
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
          navigate("/liquidity");
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
        }
      }
      catch (error) {
        console.error(error);
      }
    }
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
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>

        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={formik.handleSubmit}>
            <MDBox mb={2}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Enter New Password"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" type="submit" fullWidth>
                Submit
              </MDButton>
            </MDBox>

          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
