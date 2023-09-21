import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useLocation } from "react-router-dom";

function UserList(props) {

    const collection = props.collection;
    const username = props.username;
    const button = props.button;
    const userwallets = props.userwallets;
    const bettingHistoryBack = props.bettingHistoryBack;
    const userWalletsss = props.userWalletsss;
    const loading = props.loading;

    const detaile=useLocation();

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
                                }
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default UserList;
