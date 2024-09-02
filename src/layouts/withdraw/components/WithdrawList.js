import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'
import { makeStyles } from '@mui/styles'
import { useLocation, Link } from "react-router-dom";
import { Socket } from '../../../socket/useSocket';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import axios from "axios";

import VisibilityIcon from '@mui/icons-material/Visibility';
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";

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
// import { useRef, useState } from "react";

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const head = ["S.NO", "League Name", "Team", "Bet On", "Amount", "Status"]

const rows = [{ legename: "cricket", team: "india", beton: "cricket", amount: "100", status: "math" }]



const useStyles = makeStyles({
    title: {
        fontSize: 20,
        textTransform: "capitalize",
    },
});

function WithdrawList({ collection, loading, chain }) {

    const path = usercalls();

    const [age, setAge] = React.useState('');



    const [network, setNetwork] = useState([])

    useEffect(() => {
        getnetwork();
    }, [])

    const getnetwork = async () => {
        const url = endpoints.admin_Network;
        try {
            const data = await path.postCall({ url });
            const result = await data.json();
            setNetwork(result.result)
        } catch (error) {

        }
    }



    const classes = useStyles();
    //  const path = usercalls();
    // const collection = collection;
    // const loading = loading;
    // const tablename = props.tablename;
    // const status = props.status;
    const route = useLocation().pathname.split("/").slice(1);

    const handleChange = (event) => {
        setAge(event.target.value);
        // chain(event.target.value)
    };

    // const soc = Socket()


    // soc?.on("withdraw", (receiveHistory) => {
    //     // console.log(receiveHistory, "receiveHistory")
    // })

    // soc?.emit('getWithdrawHistory')

    // const[create,setcreate]=useState(flase)

    const [name, setname] = useState()
    const [nameerror, setnameError] = useState(null);

    const [email, setEmail] = useState();
    const [emailerror, setemailError] = useState(null);

    const [pass, setpass] = useState();
    const [passerr, setpasserr] = useState(null);

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    function isvalidPass(pass) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(pass);
    }

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };

    const [tabel, settabel] = useState(true)

    function Createtabel() {
        return (
            <CTable style={{ width: "100%" }}>
                <CTableHead>
                    <CTableRow>
                        {head.map((value, index) => {
                            return <CTableHeaderCell scope="col" key={index}>{value}</CTableHeaderCell>
                        })}
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    {rows.map((value, index) => {
                        return <CTableRow key={index}>
                            <CTableDataCell scope="row" >{index + 1}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.legename}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.team}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.beton}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.amount}</CTableDataCell>
                            <CTableDataCell scope="row" >{value.status}</CTableDataCell>
                        </CTableRow>
                    })}
                </CTableBody>

            </CTable>
        )
    }

    function Inputdetail() {
        const [name, setname] = useState()
        const [nameerror, setnameError] = useState(null);

        const [email, setEmail] = useState();
        const [emailerror, setemailError] = useState(null);

        const [pass, setpass] = useState();
        const [passerr, setpasserr] = useState(null);

        function isValidEmail(email) {
            return /\S+@\S+\.\S+/.test(email);
        }
        function isvalidPass(pass) {
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(pass);
        }

        const [passwordShown, setPasswordShown] = useState(false);
        const togglePasswordVisiblity = () => {
            setPasswordShown(!passwordShown);
        };
        return (
            <>
                <Button variant="contained" style={{ color: "white", marginLeft: "31.5%" }} onClick={() => { settabel(true) }}>Back</Button>
                <div style={{ display: "flex", flexDirection: "column", width: "40%", margin: "auto", textAlign: "center", gap: "1em", padding: "1em" }}>
                    <TextField id="outlined-basic"
                        onChange={(e) => {
                            console.log(e.target.value, "DOw ")
                            setname(e.target.value); setnameError(null)
                        }} label="name" variant="outlined" />

                    {nameerror && <p style={{ color: 'red', fontSize: "12px" }}> {nameerror}</p>}

                    <TextField id="outlined-basic" label="email" onChange={(e) => {
                        //    console.log(e.target.value,"Done ")
                        setEmail(e.target.value); setemailError(null)
                    }} variant="outlined" />

                    {emailerror && <p style={{ color: 'red', fontSize: "12px" }}> {emailerror}</p>}

                </div>
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <TextField style={{ width: "37%", marginLeft: "31.5%", textAlign: "center" }} id="outlined-basic" onChange={(e) => {
                        setpass(e.target.value); setpasserr(null)
                    }} type={passwordShown ? "text" : "password"} label="password" variant="outlined" />

                    <VisibilityIcon style={{ marginRight: "3.7%", marginTop: "10px" }} onClick={() => { togglePasswordVisiblity() }} />

                </div>
                {passerr && <p style={{ color: 'red', fontSize: "12px", textAlign: "center", margin: "auto" }}> {passerr}</p>}
                <div style={{ textAlign: "center", margin: "auto", padding: "1rem" }}>
                    <Button variant="contained" style={{ color: "white", width: "10%", textAlign: "center", padding: "1em" }}>Submit</Button>
                </div>

                {/* <button onClick={

                            ()=>{settabel(true)}
                          }  >back</button> */}
            </>
        )
    }

    return (
        <>
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white" className={classes.title}>
                                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                                        <h4 style={{ width: "85%" }}>Admin Fee</h4>
                                        <Box sx={{ minWidth: 120, }} style={{ paddingRight: "2vh", paddingTop: "4px" }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label" style={{ color: "white", fontSize: '16px', paddingBottom: '1vh' }}>Chain</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={age}
                                                    label="Chain"
                                                    style={{ padding: "10px", display: "flex", color: 'white' }}
                                                    onChange={handleChange}
                                                >

                                                    {network?.map((item) => (
                                                        <MenuItem value={item} onClick={() => { chain(item?._id) }} >{item.name}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                        </Box>
                                        {/* <Button variant="contained" style={{ color: "white" }} onClick={() => { settabel(false) }}>Create</Button> */}
                                    </div>
                                </MDTypography>
                            </MDBox>

                            <MDBox pt={3}>

                                {tabel ?
                                    <>
                                        {loading ?
                                            <>
                                                {collection && collection.rows &&
                                                    <DataTable
                                                        table={collection}
                                                        isSorted={false}
                                                        entriesPerPage={false}
                                                        showTotalEntries={false}
                                                        noEndBorder
                                                        loading={loading} />
                                                }
                                            </> : <>
                                                {collection && collection.rows && collection.rows.length ? (
                                                    <DataTable
                                                        table={collection}
                                                        isSorted={false}
                                                        entriesPerPage={false}
                                                        showTotalEntries={false}
                                                        noEndBorder

                                                    />) :
                                                    (
                                                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                            No Record Found
                                                        </div>
                                                    )
                                                }
                                            </>
                                        }</>
                                    : <Inputdetail />}

                                {/* <div style={{display:"flex",flexDirection:"column",width:"40%",margin:"auto",textAlign:"center",gap:"1em",padding:"1em"}}>
                     <TextField id="outlined-basic" onChange={(e)=>{
                        // console.log(e.target.value,"DOw ")
                        setname(e.target.value) , setnameError(null)
                     }}  label="name" variant="outlined" />
                     
                     {nameerror && <p style={{color: 'red',fontSize:"12px"}}> {nameerror}</p>}
                     
                     <TextField id="outlined-basic" label="email" onChange={(e)=>{
                        //    console.log(e.target.value,"Done ")
                            setEmail(e.target.value),setemailError(null)
                     }} variant="outlined" />
                     
                     {emailerror && <p style={{color: 'red',fontSize:"12px"}}> {emailerror}</p>}
                
                     </div> 
                    <div style={{display: "flex",flexDirection: "row", width :"100%"}}>
                         <TextField style={{ width : "37%", marginLeft: "31.5%",textAlign:"center" }} id="outlined-basic" onChange={(e)=>{
                              setpass(e.target.value),setpasserr(null)
                             }} type={passwordShown ? "text" : "password"} label="password" variant="outlined" />
                     
                         <VisibilityIcon style={{ marginRight: "3.7%", marginTop: "10px"}} onClick={()=>{togglePasswordVisiblity()} }/> 
                        
                        </div>
                         {passerr && <p style={{ color: 'red',fontSize:"12px",textAlign:"center",margin:"auto"}}> {passerr}</p>}
                        <div style={{ textAlign :"center", margin: "auto",padding:"1rem"}}>
                          <Button variant="contained"  style={{color:"white",width :"10%",textAlign:"center",padding: "1em"}} onClick={check}>Submit</Button>
                          </div> */}


                                {/* {loading ?
                                    <>
                                        {collection && collection.rows &&
                                            <DataTable
                                                table={collection}
                                                isSorted={false}
                                                entriesPerPage={false}
                                                showTotalEntries={false}
                                                noEndBorder
                                                loading={loading} />
                                        }
                                    </> : <>
                                        {collection && collection.rows && collection.rows.length ? (
                                            <DataTable
                                                table={collection}
                                                isSorted={false}
                                                entriesPerPage={false}
                                                showTotalEntries={false}
                                                noEndBorder
                                            />) :
                                            (
                                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                    No Record Found
                                                </div>
                                            )
                                        }
                                    </> 
                                }*/}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default WithdrawList;
