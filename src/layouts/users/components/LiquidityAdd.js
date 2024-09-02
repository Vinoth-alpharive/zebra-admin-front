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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import MenuItem from '@mui/material/MenuItem';
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import { useFormik } from 'formik';
import * as yup from 'yup';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useRef } from "react";
import FormControl from '@mui/material/FormControl';
import { isAddress } from 'web3-validator';
import Web3 from 'web3';
import loader from '../../../assets/images/loader1.gif'
import axios from "axios";




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
    selectboxmui: {
        height: '46px',
        '& fieldset': {
            height: '46px'
        },
        '& .MuiSelect-select': {
            height: '46px'
        }
    }
});


function LiquidityAdd(props) {
    var WEB = new Web3(window.ethereum);

    const classes = useStyles();
    const path = usercalls();
    const Viewdetails = props.Viewdetails;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [changeMode, setChangeMode] = useState('')
    const [chrr, setChrr] = useState([])
    const [coin1erro, setCoin1error] = useState("")
    const [coin2erro, setCoin2error] = useState("")
    const [coin3erro, setCoin3error] = useState("")
    const [chaid, setChaiid] = useState("")
    const [chainerro, setChainerror] = useState("")
    const [selcChain, setSelcChain] = useState()
    const [selectChainFull, setSelectChainFull] = useState()
    const [loading, setLoading] = useState(false)

    const [show3, setShow3] = useState(false)

    const [age, setAge] = React.useState('');
    const coin1 = useRef()
    const coin2 = useRef()
    const coin3 = useRef()
    const chain = useRef()
    const rpc = useRef()

    const [nativeSelc, setNativeSelc] = useState(true)
    const [co1, setco1] = useState(0)



    const addToken = async (mode) => {
        handleOpen();
        setChangeMode(mode)
    }

    const handleChange = async (event) => {
        setNativeSelc(false)
        setAge(event.target.value);
        setChaiid(event.target.value._id)
        setChainerror('')
    };

    const changeChain = async () => {
        try {
            const browserChainId = await WEB.eth.getChainId()
            console.log("🚀 ~ file: LiquidityAdd.js:111 ~ handleChange ~ browserChainId:", browserChainId)
            console.log(selcChain, "sels")
            if (Number(browserChainId) != Number(selcChain)) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: WEB.utils.toHex(selcChain) }]
                });
            }
        } catch (error) {
            console.log("🚀 ~ file: LiquidityAdd.js:121 ~ changeChain ~ error:", error)

        }

    }

    useEffect(() => {
        if (chaid !== undefined) {
            changeChain()
        }
        console.log(coin1.current.value, "value")

        if (coin1.current.value != 'undefined' && coin1.current.value != "" && co1 == 1) {
            console.log("if")
            selectNativeCurrency()
        } else if (coin2.current.value != 'undefined' && coin2.current.value != "" && co1 == 2) {
            selectNativeCurrency()
        }
    }, [chaid])

    // const validate = () => {
    //     const c1 = isAddress(coin1.current.value)
    //     const c2 = isAddress(coin2.current.value)
    //     if (coin1.current.value === "") {
    //         setCoin1error("Please provide address")
    //     } else {
    //         setCoin1error("")
    //     }
    //     if (coin2.current.value === "") {
    //         setCoin2error("Please provide address")
    //     } else {
    //         setCoin2error("")
    //     }

    //     if (coin1.current.value !== "" && c1 === false) {
    //         console.log(c1, "c1");
    //         setCoin1error("Invalid Address")
    //     } else {
    //         setCoin2error("")
    //     }
    //     if (coin2.current.value !== "" && c2 === false) {
    //         console.log(c2, "c2");
    //         setCoin2error("Invalid Address")
    //     } else {
    //         setCoin2error("")
    //     }

    // }

    const cha = async () => {
        const url = endpoints.getchain;
        try {
            const data = await path.getCall({ url });
            const result = await data.json();
            setChrr(result.result)
        } catch (error) {
            console.log(error, "error");
        }
    }

    useEffect(() => {
        cha();
    }, [])

    const submit = async () => {
        try {

            if (age === "") {
                setChainerror("Please select chain")
            }
            else if (coin1.current.value === "") {
                setCoin1error("Please provide address")
            } else if (coin2.current.value === "") {
                setCoin2error("Please provide address")
            } else if (coin1erro !== "") {
                setCoin1error("Invalid Address")
            } else if (coin2erro !== "") {
                setCoin2error("Invalid Address")
            }
            else {
                setLoading(true)
                setCoin1error("")
                setCoin2error("")
                setChainerror("")

                var url = endpoints.getFactoryContract
                var payload = {
                    'Network': chaid
                }
                var data = await path.postCall({ url, payload })
                var result = await data.json();
                console.log("🚀 ~ file: LiquidityAdd.js:182 ~ submit ~ result:", result)
                if (result.success === true) {
                    const payload = {
                        "token1": coin1.current.value,
                        "token2": coin2.current.value,
                        "chain": chaid,
                        "factory_contract": result?.result?.factory_contract,
                        "factory_Abi": result?.result?.factory_Abi,
                        "router_contract": result?.result?.router_contract,
                        "router_Abi": result?.result?.router_Abi,
                    }

                    const url = endpoints.addasset;
                    const data = await path.postCall({ url, payload });
                    const results = await data.json();
                    if (results.success === true) {
                        coin1.current.value = ""
                        coin2.current.value = ""
                        setAge("")
                        setLoading(false)
                        toast.success("Pair Added successfully", {
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
                        Viewdetails()
                    } else {
                        setLoading(false)
                        toast.error(results.message, {
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
                    }
                }
                else {
                    console.log("logs1")
                    setShow3(true)
                    if (coin3.current.value === "") {
                        setLoading(false)
                        setCoin3error("Please provide address")
                    } else {
                        setCoin3error('')
                        var url = endpoints?.FactoryContract
                        var payload = {
                            'Network': chaid
                        }
                        const address = await window.ethereum.request({
                            method: "eth_requestAccounts"
                        });
                        console.log("🚀 ~ submit ~ address:", address)
                        var data = await path.postCall({ url, payload })
                        var result = await data.json();
                        console.log("🚀 ~ file: LiquidityAdd.js:223 ~ submit ~ result:", result)
                        if (result?.success === true) {
                            const factoryAbi = result?.result?.abi
                            const contract = new WEB.eth.Contract(factoryAbi);
                            var transactionHashes
                            console.log(result?.result?.bytecode, "asdfhsfdiuhiu")
                            const deployedContract = await contract
                                .deploy({ data: '0x' + result?.result?.bytecode, arguments: [address[0]] })
                                .send({
                                    from: address[0]
                                })
                                .on('error', function (error) {
                                    console.log(error)
                                    setLoading(false)
                                    toast.error(error.message, {
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
                                })
                                .on('transactionHash', function (transactionHash) {
                                    transactionHashes = transactionHash

                                })
                                // .on('receipt', function (receipt) { // contains the new contract address
                                //     console.log(receipt, "shfiuashfiushfd")
                                // })
                                // .on('confirmation', function (confirmationNumber, receipt) { })
                                .then(function (newContractInstance) {
                                    console.log(newContractInstance, "asdfhiushfiusahdfiu")
                                    return newContractInstance.options.address // instance with the new contract address
                                });


                            console.log(transactionHashes, "asdf")
                            console.log(deployedContract, "deployed")
                            console.log(coin3.current.value, "value")
                            await WEB.eth.getTransaction(transactionHashes).then(
                                async () => {
                                    console.log("transaction")
                                    setTimeout(async () => {
                                        if (deployedContract !== null) {
                                            const factoryInstance = new WEB.eth.Contract(factoryAbi, deployedContract)
                                            const factoryHash = await factoryInstance.methods.INIT_CODE_HASH().call({ from: address[0] })
                                            // console.log('success')
                                            console.log("🚀 ~ file: LiquidityAdd.js:273 ~ submit ~ factoryHash:", factoryHash)
                                            var urls = endpoints?.RouterContract
                                            var payloads = {
                                                'Network': chaid,
                                                'Factorycontract': factoryHash
                                            }
                                            var datas = await path.postCall({ url: urls, payload: payloads })
                                            var results = await datas.json();
                                            console.log("🚀 ~ file: LiquidityAdd.js:281 ~ submit ~ results:", results)
                                            const routerAbi = results?.result?.abi
                                            console.log("🚀 ~ file: LiquidityAdd.js:289 ~ setTimeout ~ routerAbi:", routerAbi)
                                            const Routercontracts = new WEB.eth.Contract(results?.result?.abi);
                                            const RouterdeployedContract = await Routercontracts
                                                .deploy({ data: '0x' + results?.result?.bytecode, arguments: [deployedContract, coin3.current.value] })
                                                .send({
                                                    from: address[0]
                                                })
                                                .on('error', function (error) {
                                                    console.log(error)
                                                    setLoading(false)
                                                    toast.error(error.message, {
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
                                                })
                                                .on('transactionHash', function (transactionHash) { })
                                                .on('receipt', function (receipt) { // contains the new contract address
                                                })
                                                .on('confirmation', function (confirmationNumber, receipt) { })
                                                .then(function (newContractInstance) {
                                                    return newContractInstance.options.address // instance with the new contract address
                                                });
                                            console.log(RouterdeployedContract, "router")
                                            if (RouterdeployedContract) {
                                                const payload = {
                                                    "token1": coin1.current.value,
                                                    "token2": coin2.current.value,
                                                    "chain": chaid,
                                                    "factory_contract": deployedContract,
                                                    "factory_Abi": JSON.stringify(factoryAbi),
                                                    "router_contract": RouterdeployedContract,
                                                    "router_Abi": JSON.stringify(routerAbi),
                                                }

                                                const url = endpoints.addasset;
                                                const data = await path.postCall({ url, payload });
                                                const result = await data.json();
                                                console.log("🚀 ~ file: LiquidityAdd.js:329 ~ setTimeout ~ result:", result)
                                                if (result?.success === true) {
                                                    coin1.current.value = ""
                                                    coin2.current.value = ""
                                                    setAge("")
                                                    setLoading(false)
                                                    toast.success("Pair Added successfully", {
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
                                                    Viewdetails()
                                                } else {
                                                    setLoading(false)
                                                    toast.error(result.message, {
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
                                                }
                                            }

                                        }
                                    }, 1000)

                                }
                            )

                        } else {
                            setLoading(false)
                            toast.error('SomeThing Went Wrong', {
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
                        }
                    }

                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const selectNativeCurrency = async () => {
        try {
            console.log("if")
            const { data } = await axios.get('https://chainid.network/chains.json')
            var chainSymbol
            for (let i = 0; i < data?.length; i++) {
                const element = data[i];
                if (element?.chainId == selectChainFull?.chainId) {
                    chainSymbol = element
                    setNativeSelc(true)
                    break;
                } else {
                    chainSymbol = null
                }
            }
            if (co1 == 1) {
                coin1.current.value = chainSymbol?.chain
            } else {
                coin2.current.value = chainSymbol?.chain
            }


        } catch (error) {
            console.log("🚀 ~ selectNativeCurrency ~ error:", error)

        }

    }

    useEffect(() => {
        if (co1 != 0) {
            selectNativeCurrency()
        }
    }, [co1])

    // const formik = useFormik({
    //     enableReinitialize: true,
    //     initialValues: userdataa,
    //     validationSchema: validationSchema,
    //     onSubmit: async (values) => {
    //         console.log(values)
    //         onFormsubmit(values)
    //     },
    // });


    // const onFormsubmit = async (values) => {
    //     setUserdataa(values);
    //     console.log(values,"values");
    //     // if (userdataa) {
    //     //     const payload = {
    //     //         "userid": userviewdetails._id,
    //     //         "no_of_token": values.token
    //     //     }
    //     //     if (changeMode === "credit") {
    //     //         const url = endpoints.addtoken;
    //     //         try {
    //     //             const data = await path.postCall({ url, payload });
    //     //             const result = await data.json();
    //     //             if (result.status === true) {
    //     //                 toast.success(result.data, {
    //     //                     duration: 3000,
    //     //                     position: 'top-right',
    //     //                     autoClose: 5000,
    //     //                     hideProgressBar: false,
    //     //                     closeOnClick: true,
    //     //                     pauseOnHover: true,
    //     //                     draggable: true,
    //     //                     progress: undefined,
    //     //                     theme: 'colored',
    //     //                 })
    //     //                 getUser(userviewdetails._id);
    //     //                 handleClose();

    //     //             }
    //     //             else {
    //     //                 toast.error(result.msg, {
    //     //                     position: 'top-right',
    //     //                     autoClose: 5000,
    //     //                     hideProgressBar: false,
    //     //                     closeOnClick: true,
    //     //                     pauseOnHover: true,
    //     //                     draggable: true,
    //     //                     progress: undefined,
    //     //                     theme: 'colored',
    //     //                 })
    //     //                 getUser(userviewdetails._id);
    //     //                 handleClose();
    //     //             }
    //     //         }
    //     //         catch (error) {
    //     //             console.error(error);
    //     //         }
    //     //     }
    //     //     else {
    //     //         const url = endpoints.deletetoken;
    //     //         try {
    //     //             const data = await path.postCall({ url, payload });
    //     //             const result = await data.json();
    //     //             if (result.status === true) {
    //     //                 toast.success(result.data, {
    //     //                     duration: 3000,
    //     //                     position: 'top-right',
    //     //                     autoClose: 5000,
    //     //                     hideProgressBar: false,
    //     //                     closeOnClick: true,
    //     //                     pauseOnHover: true,
    //     //                     draggable: true,
    //     //                     progress: undefined,
    //     //                     theme: 'colored',
    //     //                 })
    //     //                 getUser(userviewdetails._id);
    //     //                 handleClose();

    //     //             }
    //     //             else {
    //     //                 toast.error(result.msg, {
    //     //                     position: 'top-right',
    //     //                     autoClose: 5000,
    //     //                     hideProgressBar: false,
    //     //                     closeOnClick: true,
    //     //                     pauseOnHover: true,
    //     //                     draggable: true,
    //     //                     progress: undefined,
    //     //                     theme: 'colored',
    //     //                 })
    //     //                 getUser(userviewdetails._id);
    //     //                 handleClose();
    //     //             }
    //     //         }
    //     //         catch (error) {
    //     //             console.error(error);
    //     //         }
    //     //     }
    //     // }
    // }
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

            <MDBox pt={2} pb={3}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item md={11} xs={12}>
                                <MDTypography variant="h6" className={classes.title}>
                                    Add Pairs
                                </MDTypography>
                            </Grid>
                            <Grid item md={1} xs={12}>
                                <MDButton variant="gradient" color="dark" onClick={Viewdetails} fullWidth>
                                    Back
                                </MDButton>
                            </Grid>
                        </Grid>
                        <Card>
                            <Grid container spacing={6} justifyContent="start" p={3}>
                                <Grid item xs={12} md={4} lg={4} mt={3}>
                                    {nativeSelc == false ? <div className="native" onClick={() => { setco1(1) }} >Native Token</div> : <></>}

                                    <MDBox  >
                                        <TextField
                                            fullWidth
                                            id="assetname"
                                            name="assetname"
                                            // label="Address 1"
                                            variant="outlined"
                                            inputRef={coin1}
                                            placeholder="Address 1"
                                        // onChange={validate}
                                        />
                                        {coin1erro !== "" ?
                                            <span style={{ color: "red", fontSize: "15px" }}>{coin1erro}</span>
                                            :
                                            <></>
                                        }
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} mt={3}>
                                    {nativeSelc == false ? <div className="native" onClick={() => { setco1(2) }}  >Native Token</div> : <></>}
                                    <MDBox  >
                                        <TextField
                                            fullWidth
                                            id="price"
                                            name="price"
                                            // label="Address 2"
                                            variant="outlined"
                                            inputRef={coin2}
                                            placeholder="Address 2"
                                        // onChange={validate}
                                        />
                                        {coin2erro !== "" ?
                                            <span style={{ color: "red", fontSize: "15px" }}>{coin2erro}</span>
                                            :
                                            <></>
                                        }
                                    </MDBox>
                                </Grid>
                                {
                                    show3 === true ?
                                        <Grid item xs={12} md={4} lg={4} mt={3}>
                                            <MDBox  >
                                                <TextField
                                                    fullWidth
                                                    id="price"
                                                    name="price"
                                                    label="Reward Token Address"
                                                    variant="outlined"
                                                    inputRef={coin3}
                                                // onChange={validate}
                                                />
                                                {coin3erro !== "" ?
                                                    <span style={{ color: "red", fontSize: "15px" }}>{coin3erro}</span>
                                                    :
                                                    <></>
                                                }
                                            </MDBox>
                                        </Grid>
                                        :
                                        <></>
                                }

                                <Grid item xs={12} md={4} lg={4} mt={3} >
                                    <Box sx={{ minWidth: 120 }} className={classes.selectboxmui}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Chain</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Chain"
                                                onChange={handleChange}
                                            >
                                                {chrr?.map((item, index) => (
                                                    <MenuItem value={item} key={index} onClick={() => {
                                                        setSelcChain(item?.chainId); setSelectChainFull(item);
                                                    }} >{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {chrr.length > 0 ?
                                            <span style={{ color: "red", fontSize: "15px" }}>{chainerro}</span>
                                            :
                                            <></>
                                        }
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={12} md={4} lg={4} mt={3} >
                                    <MDBox >
                                        <TextField
                                            fullWidth
                                            id="rpc_url"
                                            name="rpc_url"
                                            label="RPC_URL"
                                            variant="outlined"
                                            inputRef={rpc}
                                            onChange={validate}
                                        />
                                        {rpcerro !== "" ? 
                                        <span style= { {color : "red" , fontSize: "15px" } }>{rpcerro}</span>
                                        :
                                        <></>
                                        }
                                    </MDBox>
                                </Grid> */}
                            </Grid>
                            <Grid item xs={12} mb={4} alignItems="flex-end">
                                <MDBox pt={2} px={2} display="flex" justifyContent="space-between">
                                    <Grid container spacing={2}>
                                        {/* <Grid item>
                                            <MDButton variant="gradient" color="dark" >
                                                Cancel
                                            </MDButton>
                                        </Grid> */}
                                        <Grid item>
                                            <MDButton variant="gradient" color="info" type="submit" onClick={submit}>
                                                Submit
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

export default LiquidityAdd;
