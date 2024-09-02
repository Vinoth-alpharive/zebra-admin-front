import { useState, useEffect } from "react";
import * as React from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import dayjs from 'dayjs';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import MDTypography from "components/MDTypography";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';

import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
import * as yup from 'yup';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Web3 from 'web3';
import routeABI from '../../../web3/ABI/routeABI'
import routerAddress from '../../../web3/contract/routerAddress'
import ethrouterAddress from '../../../web3/contract/ethrouterAddress'
import erc20Abi from '../../../web3/ABI/erc20'
import loader from '../../../assets/images/loader1.gif'

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
    buttonStyle: {
        margin: '20px',
        color: 'white !important',
    },
    txt: {
        '& input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        width: '12.5vw'
    },
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
    var WEB = new Web3(window.ethereum);
    const classes = useStyles();
    const path = usercalls();
    const getUser = props.getUser;
    const ViewUserdetails = props.ViewUserdetails;
    const userviewdetails = props.userdata;
    const detail = props.detail;
    const sts = props.sts
    const selc = props.selc;

    const [loading, setLoading] = useState(false)
    const [userdataa, setUserdataa] = useState({
        token: ''
    });
    const [open, setOpen] = React.useState(false);
    // const Viewdetails = props.Viewdetails;
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        // // setOpen(false);
        // console.log("pres")
        // Viewdetails()
    }
    const [changeMode, setChangeMode] = useState('')

    const tokena = React.useRef()
    const tokenb = React.useRef()
    const [date, setdate] = useState()

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

    const AddLiquidity = async () => {
        try {
            if (tokena.current.value !== undefined && tokenb.current.value !== undefined) {
                setLoading(true)
                const address = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });

                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: WEB.utils.toHex(selc?.network?.chainId) }]
                })
                var routeInstance = new WEB.eth.Contract(
                    JSON.parse(selc?.router_Abi),
                    selc?.router_contract
                );

                console.log(selc?.router_contract, "tokesn")

                var WETHS = await routeInstance.methods.WETH().call()
                console.log("🚀 ~ AddLiquidity ~ WETHS:", WETHS)
                // if (selc?.network?.name === 'Ethereum Mainnet') {
                //     routeInstance = new WEB.eth.Contract(
                //         routeABI,
                //         ethrouterAddress

                //     );
                // } else if (selc?.network?.name === 'WAN') {
                //     routeInstance = new WEB.eth.Contract(
                //         routeABI,
                //         routerAddress
                //     );
                // }

                console.log(selc.address1, selc.address2, selc?.network?.name, "2")
                if (selc?.address1 == '-' && selc?.address2 != '-') {
                    // const token1 = new WEB.eth.Contract(
                    //     erc20Abi,
                    //     selc.address1
                    // );
                    const token2 = new WEB.eth.Contract(
                        erc20Abi,
                        selc.address2
                    );

                    var app1;
                    var app2;

                    // const decimal1 = await token1.methods.decimals().call()
                    const decimal2 = await token2.methods.decimals().call()

                    // var app = await token1.methods.allowance(address[0], selc?.router_contract).call()
                    var app3 = await token2.methods.allowance(address[0], selc?.router_contract).call()
                    console.log("🚀 ~ AddLiquidity ~ app3:", app3)

                    // if (Number(app) === 0) {
                    //     app1 = await token1.methods.approve(selc?.router_contract, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                    //         from: address[0]
                    //     })
                    // } else {
                    app1 = "1"
                    // }

                    if (Number(app3) === 0 || Number(app3) < Number(tokenb.current.value) * 10 ** Number(decimal2)) {
                        app2 = await token2.methods.approve(selc?.router_contract, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString(), (Number(tokena.current.value) * 10 ** Number(18)).toString()).send({
                            from: address[0]
                        })
                    } else {
                        app2 = '2'
                    }

                    if (app1 && app2) {
                        console.log(selc.address2, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString(), 10, 10, address[0], date.getTime(), "asjhifuhsfdiuh")
                        const addliq = await routeInstance.methods.addLiquidityETH(selc.address2, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString(), 10, 10, address[0], date.getTime()).send({
                            from: address[0],
                            value: (Number(tokena.current.value) * 10 ** Number(18)).toString(),
                        })
                        console.log(addliq, "adsfd")
                        // const addliq = await routeInstance.methods.addLiquidity(selc.address1, selc.address2, WEB.utils.toWei(tokena.current.value, 'ether'), WEB.utils.toWei(tokenb.current.value, 'ether'), 10, 10, address[0], date.getTime()).send({
                        //     from: address[0]
                        // })
                        if (addliq) {
                            setLoading(false)
                            toast.success('Liquidity Added Successfully', {
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
                            sts()
                        }

                    }
                } else if (selc?.address1 != '-' && selc?.address2 == '-') {
                    const token1 = new WEB.eth.Contract(
                        erc20Abi,
                        selc.address1
                    );
                    const token2 = new WEB.eth.Contract(
                        erc20Abi,
                        selc.address2
                    );

                    var app1;
                    var app2;

                    const decimal1 = await token1.methods.decimals().call()
                    const decimal2 = await token2.methods.decimals().call()
                    // if (selc?.network?.name === 'Ethereum Mainnet') {
                    //     app1 = await token1.methods.approve(ethrouterAddress, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                    //         from: address[0]
                    //     })
                    //     app2 = await token2.methods.approve(ethrouterAddress, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                    //         from: address[0]
                    //     })
                    // } else if (selc?.network?.name === 'WAN') {
                    //     var app = await token1.methods.allowance(address[0], routerAddress).call()
                    //     var app3 = await token2.methods.allowance(address[0], routerAddress).call()

                    //     if (Number(app) === 0) {
                    //         app1 = await token1.methods.approve(routerAddress, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                    //             from: address[0]
                    //         })
                    //     } else {
                    //         app1 = "1"
                    //     }

                    //     if (Number(app3) === 0) {
                    //         app2 = await token2.methods.approve(routerAddress, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                    //             from: address[0]
                    //         })
                    //     } else {
                    //         app2 = '2'
                    //     }
                    // }

                    var app = await token1.methods.allowance(address[0], selc?.router_contract).call()
                    var app3 = await token2.methods.allowance(address[0], selc?.router_contract).call()

                    if (Number(app) === 0) {
                        app1 = await token1.methods.approve(selc?.router_contract, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                            from: address[0]
                        })
                    } else {
                        app1 = "1"
                    }

                    if (Number(app3) === 0) {
                        app2 = await token2.methods.approve(selc?.router_contract, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                            from: address[0]
                        })
                    } else {
                        app2 = '2'
                    }

                    if (app1 && app2) {
                        const addliq = await routeInstance.methods.addLiquidity(selc.address1, selc.address2, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString(), (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString(), 10, 10, address[0], date.getTime()).send({
                            from: address[0]
                        })

                        // const addliq = await routeInstance.methods.addLiquidity(selc.address1, selc.address2, WEB.utils.toWei(tokena.current.value, 'ether'), WEB.utils.toWei(tokenb.current.value, 'ether'), 10, 10, address[0], date.getTime()).send({
                        //     from: address[0]
                        // })
                        if (addliq) {
                            setLoading(false)
                            toast.success('Liquidity Added Successfully', {
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
                            sts()
                        }

                    }
                } else {
                    const token1 = new WEB.eth.Contract(
                        erc20Abi,
                        selc.address1
                    );
                    const token2 = new WEB.eth.Contract(
                        erc20Abi,
                        selc.address2
                    );

                    var app1;
                    var app2;

                    const decimal1 = await token1.methods.decimals().call()
                    const decimal2 = await token2.methods.decimals().call()
                    // if (selc?.network?.name === 'Ethereum Mainnet') {
                    //     app1 = await token1.methods.approve(ethrouterAddress, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                    //         from: address[0]
                    //     })
                    //     app2 = await token2.methods.approve(ethrouterAddress, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                    //         from: address[0]
                    //     })
                    // } else if (selc?.network?.name === 'WAN') {
                    //     var app = await token1.methods.allowance(address[0], routerAddress).call()
                    //     var app3 = await token2.methods.allowance(address[0], routerAddress).call()

                    //     if (Number(app) === 0) {
                    //         app1 = await token1.methods.approve(routerAddress, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                    //             from: address[0]
                    //         })
                    //     } else {
                    //         app1 = "1"
                    //     }

                    //     if (Number(app3) === 0) {
                    //         app2 = await token2.methods.approve(routerAddress, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                    //             from: address[0]
                    //         })
                    //     } else {
                    //         app2 = '2'
                    //     }
                    // }

                    var app = await token1.methods.allowance(address[0], selc?.router_contract).call()
                    var app3 = await token2.methods.allowance(address[0], selc?.router_contract).call()

                    if (Number(app) === 0) {
                        app1 = await token1.methods.approve(selc?.router_contract, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString()).send({
                            from: address[0]
                        })
                    } else {
                        app1 = "1"
                    }

                    if (Number(app3) === 0) {
                        app2 = await token2.methods.approve(selc?.router_contract, (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString()).send({
                            from: address[0]
                        })
                    } else {
                        app2 = '2'
                    }

                    if (app1 && app2) {
                        const addliq = await routeInstance.methods.addLiquidity(selc.address1, selc.address2, (Number(tokena.current.value) * 10 ** Number(decimal1)).toString(), (Number(tokenb.current.value) * 10 ** Number(decimal2)).toString(), 10, 10, address[0], date.getTime()).send({
                            from: address[0]
                        })

                        // const addliq = await routeInstance.methods.addLiquidity(selc.address1, selc.address2, WEB.utils.toWei(tokena.current.value, 'ether'), WEB.utils.toWei(tokenb.current.value, 'ether'), 10, 10, address[0], date.getTime()).send({
                        //     from: address[0]
                        // })
                        if (addliq) {
                            setLoading(false)
                            toast.success('Liquidity Added Successfully', {
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
                            sts()
                        }

                    }
                }

            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }


    }


    return (
        <>
            {
                loading === true ? <div className='swap-loader'><div className='swap-loader-inner'><img src={loader} className='loadings' /></div></div> : <></>
            }
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
                                <MDButton variant="gradient" color="dark" onClick={ViewUserdetails} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <Grid container spacing={0}>
                                {/* <MDTypography variant="h6" className={classes.details}>
                                    <MDButton variant="gradient" color="primary" onClick={() => addToken("credit")} fullWidth>Credit Token</MDButton>
                                </MDTypography>
                                <MDTypography variant="h6" className={classes.details}>
                                    <MDButton variant="gradient" color="warning" sx={{ marginLeft: "10px" }} onClick={() => addToken("debit")} fullWidth>Debit Token</MDButton>
                                </MDTypography> */}
                            </Grid>
                            <Grid container spacing={6} justifyContent="center">
                                <Grid item md={4} xs={12} >
                                    <MDTypography variant="h6" className={classes.details}>
                                        TokenA
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid1}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {selc?.address1 ? selc?.address1 : ""}
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        TokenB
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        {selc?.address2 ? selc?.address2 : ""}
                                    </MDTypography>
                                </Grid>
                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        TokenA Amount
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        <TextField type="number" className={classes.txt} id="outlined-basic" label="AmountA" variant="outlined" inputRef={tokena} />
                                    </MDTypography>
                                </Grid>

                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        TokenB Amount
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        <TextField type="number" className={classes.txt} id="outlined-basic" label="AmountB" variant="outlined" inputRef={tokenb} />
                                    </MDTypography>
                                </Grid>

                                <Grid item md={4} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        DeadLine
                                    </MDTypography>
                                </Grid>
                                <Grid item md={8} xs={12} className={classes.grid}>
                                    <MDTypography variant="h6" className={classes.details}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker label="Basic date picker" onChange={(e) => { setdate(e?.$d) }} />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </MDTypography>
                                </Grid>
                                {/* <Grid item md={4} xs={12} className={classes.grid}>
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
                    </Grid> */}
                                <Button className={classes.buttonStyle} onClick={AddLiquidity} variant="contained">Contained</Button>
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
