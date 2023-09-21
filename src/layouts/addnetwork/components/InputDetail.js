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

import axios from "axios";

import VisibilityIcon from '@mui/icons-material/Visibility';

import { CTable } from '@coreui/react';
import { CTableHead } from '@coreui/react';
import { CTableHeaderCell } from '@coreui/react';
import { CTableRow } from '@coreui/react';
import { CTableBody } from '@coreui/react';
import { CTableDataCell } from '@coreui/react';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import { useRef } from "react";


function InputDetail({settabel}) {
    const [name, setname] = useState()
    const [nameerror, setnameError] = useState(null);

    const [email, setEmail] = useState();
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

    const [coin1erro, setCoin1error] = useState("")
    const [coin2erro, setCoin2error] = useState("")
    const [chainerro, setChainerror] = useState("")
    const [age, setAge] = useState('');

    const submit = async () => {
        try {
            if (coin1.current.value === "") {
                setCoin1error("Please Enter Chain Name")
            } else if (coin2.current.value === "") {
                setCoin2error("Please Enter RPC URL")
            } else {
                setCoin1error("")
                setCoin2error("")
                setChainerror("")
                const payload = {
                    "name": coin1.current.value,
                    "rpc_Url": coin2.current.value
                }
                const url = endpoints.addNetwork;
                const data = await path.postCall({ url, payload });
                const result = await data.json();
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
                <TextField id="outlined-basic" label="Chain"
                    inputRef={coin1}  onChange={() => {
                        setCoin1error("")
                        
                    }}
                    variant="outlined" />

                {coin1erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin1erro}</span>
                    :
                    <></>
                }

                <TextField id="outlined-basic" label="Rpc url"
                    inputRef={coin2} onChange={() => {
                        setCoin2error("")
                    }} variant="outlined"   />

                {coin2erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin2erro}</span>
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
                <Button variant="contained" style={{ color: "white", width: "10%", textAlign: "center", padding: "1em" }} onClick={ ()=>{submit()} }>Submit</Button>
            </div>


        </>
    )
}




export default InputDetail;