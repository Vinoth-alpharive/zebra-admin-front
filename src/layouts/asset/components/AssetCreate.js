import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
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
        textTransform: "capitalize",
        fontSize: 25,
        padding: '0px 0 20px',
    },
});

const validationSchema = yup.object().shape({
    assetname: yup.string().required("Required"),
    symbol: yup.string().required("Required"),
    // point_value: yup.string().required("Required"),
    // netfee: yup.string().required("Required"),
    // min_deposit: yup.string().required("Required"),
    // min_withdraw: yup.string().required("Required"),
    // withdraw_type: yup.string().required("Required"),
    // withdraw_commission: yup.string().required("Required"),
    // perday_withdraw: yup.string().required("Required"),
    status: yup.string().required("Required"),
    shown: yup.string().required("Required"),
    price: yup.number().required("Required"),
    // orderlist: yup.string().required("Required"),

});

const editValidationSchema = yup.object().shape({
    assetname: yup.string().required("Required"),
    symbol: yup.string().required("Required"),
    // point_value: yup.string().required("Required"),
    // netfee: yup.string().required("Required"),
    // min_deposit: yup.string().required("Required"),
    // min_withdraw: yup.string().required("Required"),
    // withdraw_type: yup.string().required("Required"),
    // withdraw_commission: yup.string().required("Required"),
    // perday_withdraw: yup.string().required("Required"),
    status: yup.string().required("Required"),
    shown: yup.string().required("Required"),
    price: yup.number().required("Required"),
    // orderlist: yup.string().required("Required"),
});

function SubadminCreate(props) {
    const enable = props.enable;
    const element = props.data._id;
    const route = useLocation().pathname.split("/").slice(1);
    const classes = useStyles();
    const Createadmin = props.Createadmin;
    const [editmode, setEditmode] = useState(true);
    const [passwordshown, setPasswordshown] = useState(false);
    const [userdata, setUserdata] = useState({
        symbol: '',
        price: '',
        coinname: '',
        status: '',
        shown: ''
    })

    const path = usercalls();
    const navigate = useNavigate();

    const togglePassword = () => {
        setPasswordshown(!passwordshown);
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: userdata,
        validationSchema: editmode ? editValidationSchema : validationSchema,
        onSubmit: async (values) => {
            onFormsubmit(values)
        },
    });

    useEffect(() => {
        if (enable) {
            setEditmode(false);
        }
    }, [])

    const onFormsubmit = async (values) => {
        setUserdata(values)
        if (editmode) {
            const url = endpoints.createasset;
            if (userdata) {
                const imageurl = (values.symbol).toLowerCase()
                const payload = {
                    "symbol": values.symbol,
                    "price": values.price,
                    "coinname": values.assetname,
                    "image": `https://letswinsports.io/service/img/assetimg/${imageurl}.svg`,
                    "status": 0,
                    "shown": 1
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
                        navigate("/asset");
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
        else {
            const url = endpoints.createasset;
            if (userdata) {
                const payload = {
                    "id": element,
                    "coinname": values.assetname,
                }
                try {
                    const data = await path.putCall({ url, payload });
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
                        navigate("/asset");
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
                        <Card>
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={6} mr={3} px={3}>
                                    <Grid item xs={12} md={4} lg={4} mt={3}>
                                        <MDBox  >
                                            <TextField
                                                fullWidth
                                                id="assetname"
                                                name="assetname"
                                                label="Asset Name"
                                                variant="outlined"
                                                value={formik.values.assetname}
                                                onChange={formik.handleChange}
                                                error={formik.touched.assetname && Boolean(formik.errors.assetname)}
                                                helperText={formik.touched.assetname && formik.errors.assetname}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3}>
                                        <MDBox  >
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                label="Price"
                                                variant="outlined"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                error={formik.touched.price && Boolean(formik.errors.price)}
                                                helperText={formik.touched.price && formik.errors.price}
                                            />
                                        </MDBox>
                                    </Grid>
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid1}>
                                        <MDBox  >
                                            <TextField
                                                fullWidth
                                                id="point_value"
                                                name="point_value"
                                                label="Point Value"
                                                variant="outlined"
                                                value={formik.values.point_value}
                                                onChange={formik.handleChange}
                                                error={formik.touched.point_value && Boolean(formik.errors.point_value)}
                                                helperText={formik.touched.point_value && formik.errors.point_value}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid1}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="netfee"
                                                name="netfee"
                                                label="Net Fee"
                                                variant="outlined"
                                                value={formik.values.netfee}
                                                onChange={formik.handleChange}
                                                error={formik.touched.netfee && Boolean(formik.errors.netfee)}
                                                helperText={formik.touched.netfee && formik.errors.netfee}
                                            />
                                        </MDBox>
                                    </Grid> */}
                                    <Grid item xs={12} md={4} lg={4} mt={3} >
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="symbol"
                                                symbol="symbol"
                                                label="Symbol"
                                                variant="outlined"
                                                value={formik.values.symbol}
                                                onChange={formik.handleChange}
                                                error={formik.touched.symbol && Boolean(formik.errors.symbol)}
                                                helperText={formik.touched.symbol && formik.errors.symbol}
                                            />
                                        </MDBox>
                                    </Grid>
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="min_deposit"
                                                name="min_deposit"
                                                label="Min Deposit"
                                                variant="outlined"
                                                value={formik.values.min_deposit}
                                                onChange={formik.handleChange}
                                                error={formik.touched.min_deposit && Boolean(formik.errors.min_deposit)}
                                                helperText={formik.touched.min_deposit && formik.errors.min_deposit}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="min_withdraw"
                                                name="min_withdraw"
                                                label="Min Withdraw"
                                                variant="outlined"
                                                value={formik.values.min_withdraw}
                                                onChange={formik.handleChange}
                                                error={formik.touched.min_withdraw && Boolean(formik.errors.min_withdraw)}
                                                helperText={formik.touched.min_withdraw && formik.errors.min_withdraw}
                                            />
                                        </MDBox>
                                    </Grid> */}
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="withdraw_type"
                                                name="withdraw_type"
                                                label="Withdraw Type"
                                                variant="outlined"
                                                value={formik.values.withdraw_type}
                                                onChange={formik.handleChange}
                                                error={formik.touched.withdraw_type && Boolean(formik.errors.withdraw_type)}
                                                helperText={formik.touched.withdraw_type && formik.errors.withdraw_type}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="withdraw_commission"
                                                name="withdraw_commission"
                                                label="Withdraw Commission"
                                                variant="outlined"
                                                value={formik.values.withdraw_commission}
                                                onChange={formik.handleChange}
                                                error={formik.touched.withdraw_commission && Boolean(formik.errors.withdraw_commission)}
                                                helperText={formik.touched.withdraw_commission && formik.errors.withdraw_commission}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="perday_withdraw"
                                                name="perday_withdraw"
                                                label="Perday Withdraw"
                                                variant="outlined"
                                                value={formik.values.perday_withdraw}
                                                onChange={formik.handleChange}
                                                error={formik.touched.perday_withdraw && Boolean(formik.errors.perday_withdraw)}
                                                helperText={formik.touched.perday_withdraw && formik.errors.perday_withdraw}
                                            />
                                        </MDBox>
                                    </Grid> */}
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="status"
                                                name="status"
                                                label="Status"
                                                variant="outlined"
                                                value={formik.values.status}
                                                onChange={formik.handleChange}
                                                error={formik.touched.status && Boolean(formik.errors.status)}
                                                helperText={formik.touched.status && formik.errors.status}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="shown"
                                                name="shown"
                                                label="Shown"
                                                variant="outlined"
                                                value={formik.values.shown}
                                                onChange={formik.handleChange}
                                                error={formik.touched.shown && Boolean(formik.errors.shown)}
                                                helperText={formik.touched.shown && formik.errors.shown}
                                            />
                                        </MDBox>
                                    </Grid> */}
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="orderlist"
                                                name="orderlist"
                                                label="Order List"
                                                variant="outlined"
                                                value={formik.values.orderlist}
                                                onChange={formik.handleChange}
                                                error={formik.touched.orderlist && Boolean(formik.errors.orderlist)}
                                                helperText={formik.touched.orderlist && formik.errors.orderlist}
                                            />
                                        </MDBox>
                                    </Grid> */}
                                    {/* <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="max_withdraw"
                                                name="max_withdraw"
                                                label="Max Withdraw"
                                                variant="outlined"
                                                value={formik.values.max_withdraw}
                                                onChange={formik.handleChange}
                                                error={formik.touched.max_withdraw && Boolean(formik.errors.max_withdraw)}
                                                helperText={formik.touched.max_withdraw && formik.errors.max_withdraw}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="withdraw_type"
                                                name="withdraw_type"
                                                label="Withdraw Type"
                                                variant="outlined"
                                                value={formik.values.withdraw_type}
                                                onChange={formik.handleChange}
                                                error={formik.touched.withdraw_type && Boolean(formik.errors.withdraw_type)}
                                                helperText={formik.touched.withdraw_type && formik.errors.withdraw_type}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="order_type"
                                                name="order_type"
                                                label="Order Type"
                                                variant="outlined"
                                                value={formik.values.order_type}
                                                onChange={formik.handleChange}
                                                error={formik.touched.order_type && Boolean(formik.errors.order_type)}
                                                helperText={formik.touched.order_type && formik.errors.order_type}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="status"
                                                name="status"
                                                label="Status"
                                                variant="outlined"
                                                value={formik.values.status}
                                                onChange={formik.handleChange}
                                                error={formik.touched.status && Boolean(formik.errors.status)}
                                                helperText={formik.touched.status && formik.errors.status}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="withdraw_limit"
                                                name="withdraw_limit"
                                                label="Withdraw Limit"
                                                variant="outlined"
                                                value={formik.values.withdraw_limit}
                                                onChange={formik.handleChange}
                                                error={formik.touched.withdraw_limit && Boolean(formik.errors.withdraw_limit)}
                                                helperText={formik.touched.withdraw_limit && formik.errors.withdraw_limit}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="withdraw_interval"
                                                name="withdraw_interval"
                                                label="Withdraw Interval"
                                                variant="outlined"
                                                value={formik.values.withdraw_interval}
                                                onChange={formik.handleChange}
                                                error={formik.touched.withdraw_interval && Boolean(formik.errors.withdraw_interval)}
                                                helperText={formik.touched.withdraw_interval && formik.errors.withdraw_interval}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={4} mt={3} className={classes.grid}>
                                        <MDBox sx={{ position: 'relative' }}>
                                            <TextField
                                                fullWidth
                                                id="network_id"
                                                name="network_id"
                                                label="Network Id"
                                                variant="outlined"
                                                value={formik.values.network_id}
                                                onChange={formik.handleChange}
                                                error={formik.touched.network_id && Boolean(formik.errors.network_id)}
                                                helperText={formik.touched.network_id && formik.errors.network_id}
                                            />
                                        </MDBox>
                                    </Grid> */}
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
