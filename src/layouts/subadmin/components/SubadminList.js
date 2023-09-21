import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import SubAdminView from "./SubAdminView";


function AssetList(props) {
    const Createadmin = props.Createadmin;
    const collection = props.Collection;
    const loading = props.loading;
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

            <MDBox pt={2} pb={3} mt={3}>
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
                                <MDTypography variant="h6" color="white">
                                    Sub Admin
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
                                        {collection && collection.rows && collection.rows.length ?
                                            (<DataTable
                                                table={collection}
                                                isSorted={false}
                                                entriesPerPage={false}
                                                showTotalEntries={false}
                                                noEndBorder
                                            />)
                                            :
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

export default AssetList;
