import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'
import { makeStyles } from '@mui/styles'
import { useLocation, Link } from "react-router-dom";
import { Socket } from '../../../socket/useSocket';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import axios from "axios";

import VisibilityIcon from '@mui/icons-material/Visibility';

import { CTable } from '@coreui/react';
import { CTableHead } from '@coreui/react';
import { CTableHeaderCell } from '@coreui/react';
import { CTableRow } from '@coreui/react';
import { CTableBody } from '@coreui/react';
import { CTableDataCell } from '@coreui/react';

import Web3 from 'web3';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import { useRef } from "react";
import FormControl from '@mui/material/FormControl';
import { useEffect } from "react";
import MenuItem from '@mui/material/MenuItem';


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

function InputDetail({ settabel }) {
    var WEB = new Web3(window.ethereum);
    const [name, setname] = useState()
    const [nameerror, setnameError] = useState(null);

    const [email, setEmail] = useState();
    const classes = useStyles();
    const [emailerror, setemailError] = useState(null);

    // const [pass, setpass] = useState();
    // const [passerr, setpasserr] = useState(null);

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    // function isvalidPass(pass) {
    //     return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(pass);
    // }



    // const [passwordShown, setPasswordShown] = useState(false);
    // const togglePasswordVisiblity = () => {
    //     setPasswordShown(!passwordShown);
    // };



    const path = usercalls();

    const coin1 = useRef()
    const coin2 = useRef()
    const coin3 = useRef()

    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const [coin1erro, setCoin1error] = useState("")
    const [coin2erro, setCoin2error] = useState("")
    const [coin3erro, setCoin3error] = useState("")
    const [coin4erro, setCoin4error] = useState("")
    const [coin5erro, setCoin5error] = useState("")
    const [coin6erro, setCoin6error] = useState("")


    const [chrr, setChrr] = useState([])
    const [chainerro, setChainerror] = useState("")
    const [age, setAge] = useState('');
    const [chaid, setChaiid] = useState("")

    const handleChange = (event) => {
        setCoin6error("")
        setAge(event.target.value);
        setChaiid(event.target.value._id)
    };
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
            if (coin1.current.value === "") {
                setCoin1error("Please Enter Reward Token")
            } else if (coin2.current.value === "") {
                setCoin2error("Please Enter Dev Address")
            } else if (coin3.current.value === "") {
                setCoin3error("Please Enter Rewards per Second")
            } else if (startTime === "") {
                setCoin4error("Please Enter Start Time")
            } else if (endTime === "") {
                setCoin5error("please Enter End Time")
            } else if (chaid === "") {
                setCoin6error("Please Select Network")
            }
            else {
                const url = endpoints.farmingPairs;
                const payload = {
                    Network: chaid
                }
                const data = await path.postCall({ url, payload });
                const result = await data.json();
                const address = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                const contract = new WEB.eth.Contract(result?.result?.abi);
                let defaultAccount = address[0]

                const deployedContract = await contract
                    .deploy({ data: '0x' + result?.result?.bytecode })
                    .send({
                        from: defaultAccount, gas: 3032132
                    })
                    .on('error', function (error) { console.log(error) })
                    .on('transactionHash', function (transactionHash) { })
                    .on('receipt', function (receipt) { // contains the new contract address
                    })
                    .on('confirmation', function (confirmationNumber, receipt) { })
                    .then(function (newContractInstance) {
                        return newContractInstance.options.address // instance with the new contract address
                    });

                if (deployedContract !== undefined) {
                    const contractInstance = await new WEB.eth.Contract(result?.result?.abi, deployedContract)
                    const initialize = await contractInstance.methods.initialize(coin1.current.value, coin2.current.value, WEB.utils.toWei(coin3.current.value, 'ether'), new Date(startTime).getTime() / 1000, new Date(endTime).getTime() / 1000).send({
                        from: address[0]
                    })
                    if (initialize) {
                        const url = endpoints.farmingAddPairs;
                        const payload = {
                            Reward_Token: coin1.current.value,
                            Dev_Address: coin2.current.value,
                            Reward_Per_Sec: WEB.utils.toWei(coin3.current.value, 'ether'),
                            Start_Time: new Date(startTime).getTime() / 1000,
                            End_Time: new Date(endTime).getTime() / 1000,
                            Network: chaid,
                            contractAddress: deployedContract
                        }
                        const datas = await path.postCall({ url, payload });
                        const results = await datas.json();
                        if (result.success === true) {
                            coin1.current.value = ""
                            coin2.current.value = ""
                            setAge("")
                            toast.success("Network Added successfully", {
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
                            settabel(true)
                        } else {
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
            }
        } catch (error) {
            console.log(error, "erro");
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

    return (
        <>
            <Button variant="contained" style={{ color: "white", marginLeft: "31.5%" }} onClick={() => { settabel(true) }}>Back</Button>
            <div style={{ display: "flex", flexDirection: "column", width: "40%", margin: "auto", textAlign: "center", gap: "1em", padding: "1em" }}>
                <TextField id="outlined-basic" label="Reward token"
                    inputRef={coin1} onChange={() => {
                        setCoin1error("")

                    }}
                    variant="outlined" />

                {coin1erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin1erro}</span>
                    :
                    <></>
                }

                <TextField id="outlined-basic" label="Dev Address"
                    inputRef={coin2} onChange={() => {
                        setCoin2error("")
                    }} variant="outlined" />

                {coin2erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin2erro}</span>
                    :
                    <></>
                }

                <TextField id="outlined-basic" label="Rewards Per Second"
                    type="Number"
                    inputRef={coin3} onChange={() => {
                        setCoin3error("")
                    }} variant="outlined" />

                {coin3erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin3erro}</span>
                    :
                    <></>
                }
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        onChange={(e) => {
                            setCoin4error('')
                            setStartTime(e?.$d)
                        }} />
                </LocalizationProvider>

                {coin4erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin4erro}</span>
                    :
                    <></>
                }
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        onChange={(e) => {
                            setCoin5error("")
                            setEndTime(e?.$d)
                        }} />
                </LocalizationProvider>
                {coin5erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin5erro}</span>
                    :
                    <></>
                }

                <Box className={classes.selectboxmui}>
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
                    {chrr.length > 0 ?
                        <span style={{ color: "red", fontSize: "15px" }}>{chainerro}</span>
                        :
                        <></>
                    }
                </Box>
                {coin6erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin6erro}</span>
                    :
                    <></>
                }

            </div>
            {/* <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <TextField style={{ width: "37%", marginLeft: "31.5%", textAlign: "center" }} id="outlined-basic" onChange={(e) => {
                    setpass(e.target.value); setpasserr(null)
                }} type={passwordShown ? "text" : "password"} label="password" variant="outlined" />

                <VisibilityIcon style={{ marginRight: "3.7%", marginTop: "10px" }} onClick={() => { togglePasswordVisiblity() }} />

            </div> */}

            <div style={{ textAlign: "center", margin: "auto", padding: "1rem" }}>
                <Button variant="contained" style={{ color: "white", width: "10%", textAlign: "center", padding: "1em" }} onClick={() => { submit() }}>Submit</Button>
            </div>


        </>
    )
}




export default InputDetail;