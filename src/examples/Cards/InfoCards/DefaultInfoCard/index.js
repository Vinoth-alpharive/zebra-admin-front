import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
// import { endpoints } from "../../../auth/url";
// import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
import * as yup from 'yup';

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
function DefaultInfoCard({ color, icon, title, description, value, button, functionname }) {
  const history = useNavigate();
  const [openwallet, setOpenwallet] = React.useState(false);
  const handleOpenwallet = () => setOpenwallet(true);
  const handleClosewallet = () => setOpenwallet(false);

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: userdataa,
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      // onFormsubmit(values)
    },
  });
  return (
    <>
      <Modal
        open={openwallet}
        onClose={handleClosewallet}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit} style={{ margin: '10px 0' }}>
            <Grid container spacing={1} mr={3} px={3}>
              <Grid item xs={12}>
                <MDBox>
                  <TextField
                    fullWidth
                    id="maximum_withdraw"
                    name="maximum_withdraw"
                    label="Maximum Withdraw"
                    variant="outlined"
                    onChange={formik.handleChange}
                    error={formik.touched.maximum_withdraw && Boolean(formik.errors.maximum_withdraw)}
                    helperText={formik.touched.maximum_withdraw && formik.errors.maximum_withdraw}
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
                    onChange={formik.handleChange}
                    error={formik.touched.minimum_withdraw && Boolean(formik.errors.minimum_withdraw)}
                    helperText={formik.touched.minimum_withdraw && formik.errors.minimum_withdraw}
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
                    onChange={formik.handleChange}
                    error={formik.touched.withdraw_limit && Boolean(formik.errors.withdraw_limit)}
                    helperText={formik.touched.withdraw_limit && formik.errors.withdraw_limit}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
              <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                <MDButton variant="gradient" color="dark" onClick={handleClosewallet} fullWidth>
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
      <Card>
        <MDBox p={2} mx={3} display="flex" justifyContent="center">
          <MDBox
            display="grid"
            justifyContent="center"
            alignItems="center"
            bgColor={color}
            color="white"
            width="4rem"
            height="4rem"
            shadow="md"
            borderRadius="lg"
            variant="gradient"
          >
            <Icon fontSize="large">{icon}</Icon>
          </MDBox>
        </MDBox>
        <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
          <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
          {description && (
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          )}
          {value && (
            <MDTypography variant="h5" fontWeight="medium">
              {value}
            </MDTypography>
          )}
          {description && !value ? null : <Divider />}
          {button && functionname && (
            <MDButton variant="gradient" color="dark" onClick={() => {
              history(`/${functionname}`)
            }}>
              {button}
            </MDButton>
          )}

        </MDBox>
      </Card>
    </>
  );
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
  button: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DefaultInfoCard;
