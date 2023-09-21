import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { ToastContainer, toast } from 'react-toastify'

import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
import * as yup from 'yup';


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
    email: yup.string().email().required("Email is required"),
    name: yup.string().required("Name is required"),
    password: yup.string().required("Password is required")
        .min(3, "Password is too short - should be 3 chars minimum"),
});

function SubadminCreate(props) {
    const classes = useStyles();
    const Createadmin = props.Createadmin;
    const [passwordshown, setPasswordshown] = useState(false);
    const [userdata, setUserdata] = useState({
        password: '',
        email: '',
        name: '',
    })

    const path = usercalls();
    const navigate = useNavigate();

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
    const onFormsubmit = async (values) => {
        setUserdata(values)
        const url = endpoints.subadmincreate;
        if (userdata) {
            const payload = {
                "email": values.email,
                "password": values.password,
                "name": values.name,
                "roleType": "ADMIN"
            }
            try {
                const data = await path.postCall({ url, payload });
                const result = await data.json();
                if (result.status === true) {
                    toast.success(result.msg, {
                        duration: 3000,
                        textTransaform: 'capitalize',
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored',
                    })
                    Createadmin();
                    navigate("/sub-admin");
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
            <MDBox pt={2} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Grid container spacing={6}>
                            <Grid item md={11} xs={12}>
                                <MDTypography variant="h6" className={classes.title}>
                                    Add Sub Admin
                                </MDTypography>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <MDButton variant="gradient" color="dark" onClick={Createadmin} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={6} mr={3} px={3}>
                                    <Grid item xs={12} md={4} lg={4} mt={3}>
                                        <MDBox mb={2}>
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="name"
                                                label="Name"
                                                variant="outlined"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid1}>
                                        <MDBox mb={2}>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="email"
                                                label="Email"
                                                variant="outlined"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid1}>
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
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} mb={4} alignItems="flex-end">
                                    <MDBox pt={2} px={2} display="flex" justifyContent="space-between">
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <MDButton variant="gradient" color="dark" onClick={Createadmin}>
                                                    Cancel
                                                </MDButton>
                                            </Grid>
                                            <Grid item>
                                                <MDButton variant="gradient" color="info" type="submit">
                                                    Submit
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default SubadminCreate;
