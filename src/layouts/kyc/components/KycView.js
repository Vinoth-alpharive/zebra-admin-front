import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import MDTypography from "components/MDTypography";
import { useLocation, Link } from "react-router-dom";

import homeDecor3 from "assets/images/home-decor-3.jpg";

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
        fontSize: 20,
        padding: '20px 0',
        textTransform: "capitalize",
    },
});


function UserView(props) {
    const classes = useStyles();
    const viewkyc = props.viewkyc;
    const route = useLocation().pathname.split("/").slice(1);


    return (
        <>
            <MDBox pt={2} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Grid container spacing={6} justifyContent="center">
                            <Grid item md={11} xs={12}>
                                <MDTypography variant="h6" className={classes.title}>
                                    {route} {' '} Details
                                </MDTypography>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <MDButton variant="gradient" color="dark" onClick={viewkyc} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <Grid container spacing={6} justifyContent="center">
                                <Grid item md={4} xs={12} >
                                    <MDTypography variant="h6" className={classes.details}>
                                        First Name
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid1}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        First Name
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Last Name
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Last Name
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Address
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Address
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Type
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Type
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Number
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Number
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Expiry
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Id Expiry
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Front image
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <img src={homeDecor3} width="300" alignItems="center" />
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        Back image
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <img src={homeDecor3} width="300" alignItems="center" />
                                </Grid>

                            </Grid>
                            <Grid item xs={12} mb={4} alignItems="flex-end">
                                <MDBox pt={2} px={2} display="flex" justifyContent="space-between">
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <MDButton variant="gradient" color="info" type="submit">
                                                Approve
                                            </MDButton>
                                        </Grid>
                                        <Grid item>
                                            <MDButton variant="gradient" color="error">
                                                Reject
                                            </MDButton>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default UserView;
