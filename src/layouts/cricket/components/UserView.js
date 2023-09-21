import { useState, useEffect } from "react";
import * as React from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';

import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
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
const validationSchema = yup.object().shape({
    token: yup.string().required("Required"),
});
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


function UserView(props) {
    const classes = useStyles();
    const path = usercalls();
    const getUser = props.getUser;
    const Viewdetails = props.Viewdetails;
    const userviewdetails = props.userdata;
    const [userdataa, setUserdataa] = useState({
        token: ''
    });
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [changeMode, setChangeMode] = useState('')

    const addToken = async (mode) => {
        handleOpen();
        setChangeMode(mode)
    }
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: userdataa,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            onFormsubmit(values)
        },
    });


    const onFormsubmit = async (values) => {
        setUserdataa(values);

        if (userdataa) {
            const payload = {
                "userid": userviewdetails._id,
                "no_of_token": values.token
            }
            if (changeMode === "credit") {
                const url = endpoints.addtoken;
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
                        getUser(userviewdetails._id);
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
                        getUser(userviewdetails._id);
                        handleClose();
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                const url = endpoints.deletetoken;
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
                        getUser(userviewdetails._id);
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
                        getUser(userviewdetails._id);
                        handleClose();
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }

    }
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
                    <label style={{ padding: '0 20px 10px' }}>Enter No of Tokens</label>
                    <form onSubmit={formik.handleSubmit} style={{ margin: '10px 0' }}>
                        <Grid container spacing={6} mr={3} px={3}>
                            <Grid item xs={12}>
                                <MDBox>
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
                                </MDBox>
                            </Grid>
                        </Grid>
                        <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
                            <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                                <MDButton variant="gradient" color="dark" onClick={handleClose} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                            {changeMode === "credit" ?
                                <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                                    <MDButton variant="gradient" color="info" type="submit" fullWidth>
                                        Add
                                    </MDButton>
                                </Grid> : <Grid item xs={12} md={6} sx={{ paddingTop: "10px!important" }}>
                                    <MDButton variant="gradient" color="info" type="submit" fullWidth>
                                        Update
                                    </MDButton>
                                </Grid>}
                        </Grid>
                    </form>
                </Box>
            </Modal>

            <MDBox pt={2} pb={3}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item md={11} xs={12}>
                                <MDTypography variant="h6" className={classes.title}>
                                    User Details
                                </MDTypography>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <MDButton variant="gradient" color="dark" onClick={Viewdetails} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <Grid container spacing={0}>
                                <MDTypography variant="h6" className={classes.details}>
                                    <MDButton variant="gradient" color="primary" onClick={() => addToken("credit")} fullWidth>Credit Token</MDButton>
                                </MDTypography>
                                <MDTypography variant="h6" className={classes.details}>
                                    <MDButton variant="gradient" color="warning" sx={{ marginLeft: "10px" }} onClick={() => addToken("debit")} fullWidth>Debit Token</MDButton>
                                </MDTypography>
                            </Grid>
                            <Grid container spacing={6} justifyContent="center">
                                <Grid item md={4} xs={12} >
                                    <MDTypography variant="h6" className={classes.details}>
                                        User Name
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
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Two Factor Authentication
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.f2A_enable === true ? "Verified" : 'Not Yet'}
                                    </MDTypography>
                                </Grid>
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
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Mobile verification
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.mobile_verify === true ? "Verified" : 'Not Yet'}
                                    </MDTypography>
                                </Grid>

                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Balance
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {userviewdetails && userviewdetails.wallet_info && userviewdetails.wallet_info.length ?
                                            userviewdetails.wallet_info[0].balance : "No Token"
                                        }
                                    </MDTypography>
                                </Grid>
                            </Grid>

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
