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
    console.log(props)
    const classes = useStyles();
    const path = usercalls();
    const Viewdetails = props.Viewdetails;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [changeMode, setChangeMode] = useState('')
    const [chrr , setChrr] = useState([])
    const [ coin1erro, setCoin1error] = useState("")
    const [ coin2erro, setCoin2error] = useState("")
    const [ chainerro, setChainerror] = useState("")
    const [ chaid , setChaiid ] = useState("")
    const [age, setAge] = React.useState('');
    const coin1 = useRef()
    const coin2 = useRef()
    const chain = useRef()
    const rpc = useRef()



    const addToken = async (mode) => {
        handleOpen();
        setChangeMode(mode)
    }

    const handleChange = (event) => {
        
        setAge(event.target.value);
        setChaiid(event.target.value._id)
      };

    const validate = () => {
        const c1 = isAddress(coin1.current.value)
        const c2 = isAddress(coin2.current.value)
         if(coin1.current.value === ""){
            setCoin1error("Please provide address")
         }else{
            setCoin1error("")
         }
          if(coin2.current.value === ""){
            setCoin2error("Please provide address")
         }else{
            setCoin2error("")
         }
        
         if(coin1.current.value !== "" && c1 === false){
            console.log(c1,"c1");
            setCoin1error("Invalid Address")
        }else{
            setCoin2error("")
        }
         if(coin2.current.value !== "" && c2 === false){
            console.log(c2,"c2");
            setCoin2error("Invalid Address")
        }else{
            setCoin2error("")
        }
        
    }

    const cha = async () => {
        const url = endpoints.getchain;
        try {
            const data = await path.getCall({ url });
            const result = await data.json();
            setChrr(result.result)
        } catch (error) {
            console.log(error,"error");
        }
    }

    useEffect(() => {
        cha();
      }, [])

    const submit = async() => {
            try {
                if(coin1.current.value === ""){
                    setCoin1error("Please provide address")
                }else if(coin2.current.value === ""){
                    setCoin2error("Please provide address")
                }
                else if( age === ""){
                    setChainerror("Please select chain")
                 }else{
                    setCoin1error("")
                    setCoin2error("")   
                    setChainerror("")  
                    const payload = {
                        "token1": coin1.current.value,
                        "token2": coin2.current.value,
                        "chain" : chaid
                    }
        const url = endpoints.addasset;
        const data = await path.postCall({ url, payload });
        const result = await data.json();
        if(result.success === true){
            coin1.current.value = ""
            coin2.current.value = ""
            setAge("")
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
        }else{
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
                
            
         } catch (error) {
                console.log(error,"erro");
                toast.error("something went wrong", {
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
                                    Add Pairs12
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
                                    <MDBox  >
                                        <TextField
                                            fullWidth
                                            id="assetname"
                                            name="assetname"
                                            label="Address 1"
                                            variant="outlined"
                                            inputRef={coin1}
                                            onChange={validate}
                                        />
                                        {coin1erro !== "" ? 
                                        <span style= { {color : "red",fontSize: "15px" }}>{coin1erro}</span>
                                            :
                                            <></>
                                        }
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} mt={3}>
                                    <MDBox  >
                                        <TextField
                                            fullWidth
                                            id="price"
                                            name="price"
                                            label="Address 2"
                                            variant="outlined"
                                            inputRef={coin2}
                                            onChange={validate}
                                        />
                                        {coin2erro !== "" ? 
                                        <span style= { {color : "red",fontSize: "15px" }}>{coin2erro}</span>
                                        :
                                        <></>
                                        }
                                    </MDBox>
                                </Grid>
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
                                    {chrr?.map((item) => (
                                        <MenuItem value={item}>{item.name}</MenuItem>
                                      ))}
                                    </Select>
                                </FormControl>
                                {chrr.length > 0  ? 
                                        <span style= { {color : "red",fontSize: "15px" }}>{chainerro}</span>
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
