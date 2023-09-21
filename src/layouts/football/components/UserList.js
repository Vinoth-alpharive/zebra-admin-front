import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TextField from '@mui/material/TextField';
//import MenuItem from '@mui/material/MenuItem';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useState, useEffect } from "react";
import { endpoints } from "../../../auth/url";
import usercalls from "../../../auth/endpoints";


import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


function UserList(props) {
    const collection = props.collection;
    const username = props.username;
    const button = props.button;
    const userwallets = props.userwallets;
    const bettingHistoryBack = props.bettingHistoryBack;
    const userWalletsss = props.userWalletsss;
    const loading = props.loading;
    const path = usercalls();
    const [list, setList] = useState('1')
    const [res, setRes] = useState()

    function league(e) {
        console.log(e.target.value, "asdf")
        if (e.target.value === "SOCCER") {
            setList("1")
        } else {
            setList("2")
        }
    }


    const match = [
        {
            value: 'SOCCER',
            label: 'SOCCER',
        },
        {
            value: 'CRICKET',
            label: 'CRICKET',
        },]


    const showhide = async (value) => {
        let payload = { id: value }

        const url = endpoints.showhide;
        try {
            const data = await path.postCall({ url, payload });
            const result = await data.json();
            console.log(result, "league status");
            if (result.success === true) {
                setRes(result.result);
                getdata();
                toast.success(result.message, {
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
        catch (error) {
            console.error(error);
            toast.error(error.result.message, {
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


    const getdata = async (value) => {
        // setLoading(true);
        let payload = { id: list }
        // console.log(payload,"paylod")
        const url = endpoints.leaguelist;
        try {
            const data = await path.postCall({ url, payload });
            const result = await data.json();
            // console.log(result,"league list");
            if (result.success === true) {
                setRes(result.result);
            }
            //   if (result.status === true) {
            //     if (result && result.data) {
            //    buildData(result.data);
            //     //   setLoading(false);
            //       setUser(result.data)
            //     }
            //   }
        }
        catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getdata();
    }, [list])




    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'hsla(0,0%,46%,.2)',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    return (
        <>
            <MDBox pt={6} pb={3}>
                {button ?
                    <Grid container spacing={1} justifyContent="end" mb={5}>
                        <Grid item md={11} xs={12}>
                        </Grid>
                        <Grid item md={1} xs={12}>
                            {userwallets ?
                                <MDButton variant="gradient" color="dark" onClick={userWalletsss} fullWidth>
                                    {button}
                                </MDButton> :
                                <MDButton variant="gradient" color="dark" onClick={bettingHistoryBack} fullWidth>
                                    {button}
                                </MDButton>
                            }
                        </Grid>
                    </Grid> : null}
                <Grid container spacing={1}>
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
                                <MDTypography variant="h6" color="white">
                                    {username}
                                </MDTypography>
                            </MDBox>

                            <MDBox pt={3}>

                                <TextField style={{ padding: " 0 22px", width: "25%" }}
                                    id="outlined-select-currency-native"
                                    select
                                    //  label="Native select" 
                                    defaultValue="SOCCER"
                                    onChange={(e) => { league(e) }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                //  helperText="Please select your currency"
                                >

                                    {match.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}

                                </TextField>

                                <Box sx={{ flexGrow: 1, padding: "16px" }} >
                                    <Grid container spacing={2} >
                                        {res?.map((item, index) => {
                                            return <Grid item xs={12} sm={12} md={8} xl={4} lg={4} key={index}>
                                                <Item><div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", marginBottom: "25px", boxSizing: "border-box" }}>

                                                    <h6 style={{ fontSize: "11.7341px", marginTop: "2rem" }}>{item?.name}</h6>
                                                </div>
                                                    {item?.status == 'true' ? <Button style={{ marginLeft: "13px", textAlign: "center", width: "90%", color: "white", backgroundColor: "#c92c4b" }} variant="contained"
                                                        onClick={() => {
                                                            showhide(item.id)
                                                        }}>
                                                        {/* {console.log(item?.id , "leauge status")}  */}
                                                        HIDE</Button> : <Button style={{ marginLeft: "13px", textAlign: "center", width: "90%", color: "white", backgroundColor: "#c92c4b" }} variant="contained"
                                                            onClick={() => {
                                                                showhide(item.id)
                                                            }}>
                                                        SHOW</Button>}
                                                </Item>
                                            </Grid>

                                        })}
                                    </Grid>
                                </Box>
                                {/*<Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} xl={4} lg={4}>
                                  <Item><div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-evenly",marginBottom:"25px",boxSizing:"border-box"}}>
                                    
                                  <h6 style={{fontSize:"11.7341px",marginTop:"2rem"}}>Anatoly Malykhi</h6>
                                     <div >
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>Anatoly Malykhi</h6>
                                    </div>
                                    <div >
                                        <h2 style={{color: "#fff", fontSize: "47.3772px",fontStyle: "normal",fontWeight: "600"}}>VS</h2>
                                        <h4>19:30</h4>
                                    </div>
                                    <div>
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>jhon</h6>
                                    </div> 
                                    </div>
                                    <Button style={{marginLeft:"13px",textAlign:"center",width:"90%",color:"white",backgroundColor:"#c92c4b"}} variant="contained">
                                            SHOW</Button>
                                    </Item>
                                </Grid>
                                
                                <Grid item xs={12} sm={12} md={8} xl={4} lg={4}>
                                  <Item><div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-evenly",marginBottom:"25px",boxSizing:"border-box"}}>
                                    
                                  <h6 style={{fontSize:"11.7341px",marginTop:"2rem"}}>Anatoly Malykhi</h6>
                                    {/* <div >
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>Anatoly Malykhi</h6>
                                    </div>
                                    <div >
                                        <h2 style={{color: "#fff", fontSize: "47.3772px",fontStyle: "normal",fontWeight: "600"}}>VS</h2>
                                        <h4>19:30</h4>
                                    </div>
                                    <div>
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>jhon</h6>
                                    </div> 
                                </div>
                                <Button style={{marginLeft:"13px",textAlign:"center",width:"90%",color:"white",backgroundColor:"#c92c4b"}} variant="contained">
                                            SHOW</Button>
                                </Item>
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} xl={4} lg={4}>
                                  <Item><div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-evenly",marginBottom:"25px",boxSizing:"border-box"}}>
                                    
                                  <h6 style={{fontSize:"11.7341px",marginTop:"2rem"}}>Anatoly Malykhi</h6>
                                    {/* <div >
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>Anatoly Malykhi</h6>
                                    </div>
                                    <div >
                                        <h2 style={{color: "#fff", fontSize: "47.3772px",fontStyle: "normal",fontWeight: "600"}}>VS</h2>
                                        <h4>19:30</h4>
                                    </div>
                                    <div>
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>jhon</h6>
                                    </div> 
                                </div>
                                <Button style={{marginLeft:"13px",textAlign:"center",width:"90%",color:"white",backgroundColor:"#c92c4b"}} variant="contained">
                                        SHOW</Button>
                                
                                </Item>
                                </Grid>
                              </Grid>*/}


                                {/* <TextField style={{padding:" 0 22px",width:"19%"}}
                                 id="outlined-select-currency-native"
                                 select
                                //  label="Native select"
                                 defaultValue="SOCCER"
                                 SelectProps={{
                                   native: true,
                                 }}
                                //  helperText="Please select your currency"
                            >
                              {match.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                       
                        <div style={{display:"grid",gridTemplateColumns:"auto auto auto"}}>
                            <Box className="gridboxes"
                            sx={{
                            width: 359,
                            height: 205,
                            margin:'20px',
                            borderRadius: '14.8054px',
                            backgroundColor: 'hsla(0,0%,46%,.2)',
                                }}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",marginBottom:"25px",boxSizing:"border-box"}}>
                                    <div >
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>Anatoly Malykhi</h6>
                                    </div>
                                    <div >
                                        <h2 style={{color: "#fff", fontSize: "47.3772px",fontStyle: "normal",fontWeight: "600"}}>VS</h2>
                                        <h4>19:30</h4>
                                    </div>
                                    <div>
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>jhon</h6>
                                    </div>
                                </div>
                                <Button style={{marginLeft:"13px",textAlign:"center",width:"90%",color:"white",backgroundColor:"#c92c4b"}} variant="contained">
                                            SHOW</Button>

                                </Box>
                            
                                <Box className="gridboxes"
                            sx={{
                            width: 359,
                            height: 205,
                            margin:'20px',
                            borderRadius: '14.8054px',
                            backgroundColor: 'hsla(0,0%,46%,.2)',
                                }}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-evenly",marginBottom:"25px",boxSizing:"border-box"}}>
                                    <div >
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>Anatoly Malykhi</h6>
                                    </div>
                                    <div >
                                        <h2 style={{color: "#fff", fontSize: "47.3772px",fontStyle: "normal",fontWeight: "600"}}>VS</h2>
                                        <h4>19:30</h4>
                                    </div>
                                    <div>
                                    <img src="" alt="jhose_Tylor"/>
                                    <h6 style={{fontSize:"11.7341px"}}>jhon</h6>
                                    </div>
                                </div>
                                <Button style={{marginLeft:"13px",textAlign:"center",width:"90%",color:"white",backgroundColor:"#c92c4b"}} variant="contained">
                                            SHOW</Button>

                                </Box>
                                
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
                                } */}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default UserList;
