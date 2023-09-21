import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'
import { makeStyles } from '@mui/styles'
import { useLocation, Link } from "react-router-dom";
import { Socket } from '../../../socket/useSocket';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import axios from "axios";
import InputDetail from "./InputDetail";

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


const head = ["S.NO", "League Name", "Team", "Bet On", "Amount", "Status"]

const rows = [{ legename: "cricket", team: "india", beton: "cricket", amount: "100", status: "math" }]



const useStyles = makeStyles({
    title: {
        fontSize: 20,
        textTransform: "capitalize",
    },
});



function WithdrawList(props) {
    var WEB = new Web3(window.ethereum);
    const classes = useStyles();
    //  const path = usercalls();
    const collection = props.collection;
    const loading = props.loading;
    const tablename = props.tablename;
    const status = props.status;
    const element = props.element
    const route = useLocation().pathname.split("/").slice(1);

    // const soc = Socket()

    // soc?.on("withdraw", (receiveHistory) => {
    //     // console.log(receiveHistory, "receiveHistory")
    // })

    // soc?.emit('getWithdrawHistory')

    // const[create,setcreate]=useState(flase)

    const settabels = async (dt) => {
        settabel(dt)
        status("1")
    }



    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };

    const [tabel, settabel] = useState(true)
    const [network, setNetwork] = useState();

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
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <h4 style={{ width: "85%" }}>Farming Add Paris </h4>
                                        <Button variant="contained" style={{ color: "white" }} onClick={() => { settabel(false) }}>Create</Button>
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
                                    : <InputDetail settabel={settabels} element={element} />}

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
