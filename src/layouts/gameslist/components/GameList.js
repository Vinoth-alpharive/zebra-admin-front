import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from 'react-toastify'

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";


function UserList(props) {
    const collection = props.collection;
    const loading = props.loading;
    return (
        <>
            <MDBox pt={6} pb={3}>
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
                                    Games List
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
