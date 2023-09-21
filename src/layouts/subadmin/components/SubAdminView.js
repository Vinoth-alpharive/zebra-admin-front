import { useState, useEffect } from "react";
import * as React from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import moment from "moment";
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';


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
    grid: {
        paddingTop: '0!important',
    },
    grid1: {
        ['@media (max-width:767px)']: {
            paddingTop: '0!important',
        },
    },
    details: {
        padding: 20,
    },
    title: {
        fontSize: 25,
        padding: '20px 0',
    },
});

const validationSchema = yup.object().shape({
    password: yup.string().required("Required"),
});

function UserView(props) {
    const classes = useStyles();
    const path = usercalls();
    const Viewdetails = props.Viewadmin;
    const userviewdetails = props.Admindetails;
    const [user, setUser] = useState({})
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [userdataa, setUserdataa] = useState({
        password: ''
    });

    const resetPassword = async () => {
        handleOpen();
    }

    const onFormsubmit = async (values) => {
        setUserdataa(values);
        const url = endpoints.resetpassword;
        if (userdataa) {
            const payload = {
                "userid": userviewdetails._id,
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
        <>
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
                                <MDButton variant="gradient" color="dark" onClick={handleClose} fullWidth>
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
            <MDBox pt={2} pb={3}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item md={11} xs={12}>
                                <MDTypography variant="h6" className={classes.title}>
                                    Admin Details
                                </MDTypography>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <MDButton variant="gradient" color="dark" onClick={Viewdetails} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <Grid container spacing={6} justifyContent="center">
                                <Grid item md={4} xs={12} >
                                    <MDTypography variant="h6" className={classes.details}>
                                        Email
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid1}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.email}
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Date and Time
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails._id ? moment(new Date(parseInt((userviewdetails._id).substring(0, 8), 16) * 1000)).format('lll') : "---"}
                                    </MDTypography>
                                </Grid>
                                {/* <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Kyc verification
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.kyc_status === "0" ? "Verified" : 'Not Yet'}
                                    </MDTypography>
                                </Grid> */}
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Email verification
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.email_verify === true ? "Verified" : 'Not Yet'}
                                    </MDTypography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} sx={{ marginTop: '10px', marginLeft: '0' }}>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Reset Password
                                    </MDTypography>
                                </Grid>
                                <Grid item md={2} xs={12} className={classes.grid} pl={2}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        <MDButton variant="gradient" color="info" fullWidth onClick={resetPassword}>Reset</MDButton>
                                    </MDTypography>
                                </Grid>
                            </Grid >
                            {/* <Grid item xs={12} mb={4} alignItems="flex-end">
                                <MDBox pt={2} px={2} display="flex" justifyContent="space-between">
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <MDButton variant="gradient" color="error">
                                                Disable
                                            </MDButton>
                                        </Grid>
                                        <Grid item>
                                            <MDButton variant="gradient" color="info" type="submit">
                                                Enable
                                            </MDButton>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Grid> */}
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default UserView;
