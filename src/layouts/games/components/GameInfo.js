import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import * as React from 'react';
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import { makeStyles } from '@mui/styles';
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Icon from "@mui/material/Icon";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500, borderRadius: '10px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px 0',
};

const useStyles = makeStyles({
    grid: {
        paddingTop: '0!important'
    },
    grid1: {
        ['@media (max-width:767px)']: {
            paddingTop: '0!important',
        },
    },
    details: {
        padding: '20px 10px',
    },
    title: {
        fontSize: 25,
        padding: '20px 0',
    },
});

function UserList(props) {
    const classes = useStyles();
    const matchPlayerA = props.matchPlayerA;
    const getmatchdetailsview = props.getmatchdetailsview;
    const matchPlayerB = props.matchPlayerB;
    const matchInfo = props.matchInfo;
    const loading = props.loading;
    const [collection, setCollection] = useState({})
    const [collection1, setCollection1] = useState({})
    const [playerInfo, setPlayerInfo] = useState({})

    useEffect(() => {
        buildData(matchPlayerA)
        buildData1(matchPlayerB)
    }, [])

    const buildData = (users, index) => {
        const tempArr = [];
        users.forEach((element, index) => {
            var temp = {}
            temp.srno = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {index + 1}
                </MDTypography>
            )
            temp.player = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {element.player?.name}
                </MDTypography>
            )
            temp.action = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    <MDButton color="dark" size="small" sx={{ marginLeft: '10px' }} onClick={() => openModal(element)}>
                        View
                    </MDButton>
                </MDTypography>
            )

            tempArr.push(temp)

        });
        setCollection({
            columns: [
                { Header: "SR.No", accessor: "srno", align: "center" },
                { Header: "Players", accessor: "player", align: "center" },
                { Header: "Action", accessor: "action", align: "center" },

            ],
            rows: tempArr
        })
    }
    const buildData1 = (users, index) => {
        const tempArr = [];
        users.forEach((element, index) => {
            var temp = {}
            temp.srno = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {index + 1}
                </MDTypography>
            )
            temp.player = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {element.player?.name}
                </MDTypography>
            )
            temp.action = (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    <MDButton color="dark" size="small" sx={{ marginLeft: '10px' }} onClick={() => openModal(element)}>
                        View
                    </MDButton>
                </MDTypography>
            )

            tempArr.push(temp)

        });
        setCollection1({
            columns: [
                { Header: "SR.No", accessor: "srno", align: "center" },
                { Header: "Players", accessor: "player", align: "center" },
                { Header: "Action", accessor: "action", align: "center" },

            ],
            rows: tempArr
        })
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const openModal = (element) => {
        setPlayerInfo(element);
        handleOpen();
    }
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ textAlign: 'center' }}>
                    <h3><Icon style={{
                        position: 'relative', top: '7px', left: ' -8px', background: 'green',
                        color: '#fff', height: ' 30px', width: '30px', lineHeight: ' 1', textAlign: 'center', borderRadius: '20px',
                        padding: ' 3px'
                    }} fontSize="medium"> person_icon </Icon>{playerInfo?.player?.name} </h3>
                    <h5 style={{ background: '#d9ad00', display: 'inline', padding: '6px 15px', borderRadius: '6px', color: ' #fff', fontWeight: 500, fontSize: '14px' }}>
                        {playerInfo?.player?.seasonal_role}</h5>                   {playerInfo && playerInfo.score && playerInfo?.score[1] &&
                            <>
                                {playerInfo?.score[1] && playerInfo?.score[1].batting === null ?
                                    <>
                                        {playerInfo?.score[1] && playerInfo?.score[1].bowling === null ?
                                            <>
                                                {playerInfo?.score[1] && playerInfo?.score[1].fielding === null ?
                                                    null :
                                                    <TableContainer >
                                                        <Table aria-label="customized table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Balls</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Run Out</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Stumping</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.catches}balls
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.runouts}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.stumpings}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableContainer>
                                                }
                                            </>
                                            :
                                            <>
                                                <TableContainer component={Paper} style={{ textALign: "center" }}>
                                                    <Table aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Balls</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Runs</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Wickets</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Economy</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                                                    {playerInfo?.score[1]?.bowling?.score?.balls}
                                                                </TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                                                    {playerInfo?.score[1]?.bowling?.score?.runs}
                                                                </TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                                                    {playerInfo?.score[1]?.bowling?.score?.wickets ? playerInfo?.score[1]?.bowling?.score?.wickets : "---"}
                                                                </TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                                                    {playerInfo?.score[1]?.bowling?.score?.economy}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                    </Table>
                                                </TableContainer>
                                                <h5 style={{ marginTop: '20px' }}>Balls Breakup</h5>
                                                {playerInfo?.score[1]?.bowling?.score?.balls_breakup ?
                                                    <TableContainer >
                                                        <Table aria-label="customized table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>Dot Balls</TableCell>
                                                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>Four's</TableCell>
                                                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>No Balls</TableCell>
                                                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>Sixes's</TableCell>
                                                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>Wides</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.bowling?.score?.balls_breakup?.dot_balls}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.bowling?.score?.balls_breakup?.fours}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.bowling?.score?.balls_breakup?.no_balls}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.bowling?.score?.balls_breakup?.sixes}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.bowling?.score?.balls_breakup?.wides}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableContainer> : null}
                                            </>}
                                    </>
                                    :
                                    <>
                                        {playerInfo?.score[1] && playerInfo?.score[1]?.batting === null ?
                                            <>
                                                {playerInfo?.score[1] && playerInfo?.score[1].fielding === null ?
                                                    <>ndata</> :
                                                    <TableContainer >
                                                        <Table aria-label="customized table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Balls</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Run Out</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Stumping</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.catches}balls
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.runouts}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.stumpings}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableContainer>
                                                }
                                            </> :
                                            <>
                                                <TableContainer >
                                                    <Table aria-label="customized table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Balls</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Runs</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Wickets</TableCell>
                                                                <TableCell style={{ width: '30%', textAlign: 'center' }}>Strike </TableCell>
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    {playerInfo?.score[1]?.batting?.score?.balls}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {playerInfo?.score[1]?.batting?.score?.runs}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {playerInfo?.score[1]?.batting?.score?.wickets ? playerInfo?.score[1]?.batting?.score?.wickets : '---'}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {playerInfo?.score[1]?.batting?.score?.strike_rate}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                    </Table>
                                                </TableContainer>
                                                {playerInfo?.score[1] && playerInfo?.score[1].fielding === null ?
                                                    <></> :
                                                    <TableContainer >
                                                        <Table aria-label="customized table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Balls</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Run Out</TableCell>
                                                                    <TableCell style={{ width: '50%', textAlign: 'center' }}>Stumping</TableCell>
                                                                </TableRow>

                                                                <TableRow>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.catches}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.runouts}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {playerInfo?.score[1]?.fielding?.stumpings}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableContainer>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </>
                    }
                    <Grid container spacing={6} mr={3} px={3} sx={{ marginTop: "10px" }}>
                        <Grid item xs={12} md={4} sx={{ paddingTop: "30px!important" }}>
                            <MDButton variant="gradient" color="dark" onClick={handleClose} fullWidth>
                                Back
                            </MDButton>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <MDButton variant="gradient" color="dark" sx={{ marginLeft: '10px', float: 'right' }} onClick={getmatchdetailsview} >
                Back
            </MDButton>
            <MDBox pt={5} pb={3} mt={3}>
                <Card>
                    <Box textAlign="center" py={3}>
                        <h2>Player Info</h2>
                        <h5 style={{ fontSize: '20px' }}>{matchInfo.name}</h5>
                        <p style={{ fontSize: '14px', fontWeight: "500" }}>{matchInfo.sub_title}</p>
                        <h6 style={{ color: "#8d8d8d" }}>{matchInfo.status}</h6>
                        {matchInfo?.winner === null ? null :
                            <h6 style={{ fontSize: '18px', color: "green" }}>WINNER :
                                {matchInfo?.winner === "a" ?
                                    matchInfo?.teams?.a?.name
                                    :
                                    matchInfo?.teams?.b?.name}
                            </h6>}
                        <Grid container spacing={2} mt={5} justifyContent="center">
                            <Grid item md={5} className={classes.grid}>
                                <h2>{matchInfo?.teams?.a?.name}</h2>
                                <MDBox px={3} py={3}>
                                    {collection && collection.rows && collection.rows.length > 0 ? (
                                        <DataTable
                                            table={collection}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                            loading={loading}

                                        />) :
                                        (
                                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                Not updated
                                            </div>
                                        )
                                    }
                                </MDBox>

                            </Grid>
                            <Grid item md={5} className={classes.grid}>
                                <h2>{matchInfo?.teams?.b?.name}</h2>
                                <MDBox px={3} py={3}>
                                    {collection1 && collection1.rows && collection1.rows.length > 0 ? (
                                        <DataTable
                                            table={collection1}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            loading={loading}

                                        />) :
                                        (
                                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                Not updated
                                            </div>
                                        )
                                    }
                                </MDBox>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </MDBox>
        </>
    );
}

export default UserList;
