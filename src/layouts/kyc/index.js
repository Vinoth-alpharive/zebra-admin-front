// @mui material components
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { makeStyles } from '@mui/styles'
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";

import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import KycList from "./components/KycList";
import KycView from "./components/KycView";

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
    padding: '20px',
  },
});

function Tables() {
  const classes = useStyles();
  // const { columns, rows } = authorsTableData();
  const [viewkycdetails, setViewkycdetails] = useState(false)
  const [collection, setCollection] = useState({})

  const viewkyc = () => {
    setViewkycdetails(!viewkycdetails);
  }

  useEffect(() => {
    setCollection({
      columns: [
        { Header: "author", accessor: "author", width: "45%", align: "left" },
        { Header: "function", accessor: "function", align: "left" },
        { Header: "status", accessor: "status", align: "center" },
        { Header: "employed", accessor: "employed", align: "center" },
        { Header: "action", accessor: "action", align: "center" },
      ],

      rows: [
        {
          author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
          function: <Job title="Manager" description="Organization" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              23/04/18
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" onClick={viewkyc} color="info" type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
        {
          author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
          function: <Job title="Programator" description="Developer" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              11/01/19
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" onClick={viewkyc} color="info" type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
        {
          author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
          function: <Job title="Executive" description="Projects" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              19/09/17
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" color="info" onClick={viewkyc} type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
        {
          author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
          function: <Job title="Programator" description="Developer" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              24/12/08
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" color="info" onClick={viewkyc} type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
        {
          author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
          function: <Job title="Manager" description="Executive" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              04/10/21
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" color="info" onClick={viewkyc} type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
        {
          author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
          function: <Job title="Programator" description="Developer" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              14/09/20
            </MDTypography>
          ),
          action: (
            <MDButton variant="gradient" color="info" onClick={viewkyc} type="submit" sx={{ padding: 0 }} fullWidth>
              View
            </MDButton>
          ),
        },
      ],
    });
  }, [])

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );



  return (

    <DashboardLayout>
      <DashboardNavbar />
      {viewkycdetails ?

        <KycView
          viewkyc={viewkyc}
        />
        :
        // <MDBox pt={6} pb={3}>
        //   <Grid container spacing={6}>
        //     <Grid item xs={12}>
        //       <Card>
        //         <MDBox
        //           mx={2}
        //           mt={-3}
        //           py={3}
        //           px={2}
        //           variant="gradient"
        //           bgColor="info"
        //           borderRadius="lg"
        //           coloredShadow="info"
        //         >
        //           <MDTypography variant="h6" color="white">
        //             Authors Table
        //           </MDTypography>
        //         </MDBox>
        //         <MDBox pt={3}>
        //           {collection && collection.rows &&
        //             < DataTable
        //               table={collection}
        //               isSorted={false}
        //               entriesPerPage={false}
        //               showTotalEntries={false}
        //               noEndBorder
        //             />
        //           }
        //         </MDBox>
        //       </Card>
        //     </Grid>
        //   </Grid>
        // </MDBox>
        <KycList
          collection={collection}
          viewkyc={viewkyc} />
      }

    </DashboardLayout >
  );
}

export default Tables;
