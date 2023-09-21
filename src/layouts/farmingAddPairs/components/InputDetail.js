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
import farmingABI from '../../../web3/ABI/farmingABI.json'

import Web3 from 'web3';
// Material Dashboard 2 React components
import { useRef } from "react";


function InputDetail({ settabel, element }) {
    var WEB = new Web3(window.ethereum);
    const path = usercalls();

    const coin1 = useRef()
    const coin2 = useRef()
    const coin3 = useRef()

    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")

    const [coin1erro, setCoin1error] = useState("")
    const [coin2erro, setCoin2error] = useState("")
    const [coin3erro, setCoin3error] = useState(false)
    const [coin4erro, setCoin4error] = useState("")
    const [coin5erro, setCoin5error] = useState("")

    const [chainerro, setChainerror] = useState("")
    const [age, setAge] = useState('');

    const submit = async () => {
        try {
            if (coin1.current.value === "") {
                setCoin1error("Please Enter Allocation Point")
            } else if (coin2.current.value === "") {
                setCoin2error("Please Enter LP Token")
            } else if (coin3.current.value === "") {
                setCoin3error("Please Enter Pool Update")
            }
            else {

                const address = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                const contract = new WEB.eth.Contract(farmingABI, element?.contractAddress);
                const deployedContract = await contract.methods.add(coin1.current.value, coin2.current.value, Boolean(coin3.current.value)).send({ from: address[0] })

                if (deployedContract) {
                    const url = endpoints.farmingLiquidityPairs;
                    const payload = {
                        Allocation_Point: coin1.current.value,
                        LP_Token: coin2.current.value,
                        Pool_Update: coin3.current.value,
                        contract_Address: element?.contractAddress
                    }
                    const datas = await path.postCall({ url, payload });
                    const results = await datas.json();
                    if (results.success === true) {
                        coin1.current.value = ""
                        coin2.current.value = ""
                        coin3.current.value = ""
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
                <TextField id="outlined-basic" label="Allocation Point"
                    type="Number"
                    inputRef={coin1} onChange={() => {
                        setCoin1error("")
                    }}
                    variant="outlined" />

                {coin1erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin1erro}</span>
                    :
                    <></>
                }

                <TextField id="outlined-basic" label="LP Token"
                    inputRef={coin2} onChange={() => {
                        setCoin2error("")
                    }} variant="outlined" />

                {coin2erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin2erro}</span>
                    :
                    <></>
                }

                <TextField id="outlined-basic" label="Pool Update (true or false)"
                    inputRef={coin3} onChange={() => {
                        setCoin3error("")
                    }} variant="outlined" />

                {coin3erro !== "" ?
                    <span style={{ color: "red", fontSize: "15px" }}>{coin3erro}</span>
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