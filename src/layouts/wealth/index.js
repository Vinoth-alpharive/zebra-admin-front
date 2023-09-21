import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import { makeStyles } from '@mui/styles'
import { useNavigate } from "react-router-dom";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import UserList from "./components/UserList";
import UserView from "./components/UserView";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";




function Users() {
  const navigate = useNavigate();
  const [viewdetails, setViewdetails] = useState(false)
  const [collection, setCollection] = useState({})
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const ViewUserdetails = () => {
    setViewdetails(!viewdetails);
  }
  useEffect(() => {
    // const auth = sessionStorage.getItem('accesstoken');
    // if (auth) {
    //   navigate('/users')
    // }
    // else {
    //   navigate('/login')
    // }

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
            <MDButton variant="gradient" onClick={ViewUserdetails} color="info" type="submit" sx={{ padding: 0 }} fullWidth>
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
            <MDButton variant="gradient" onClick={ViewUserdetails} color="info" type="submit" sx={{ padding: 0 }} fullWidth>
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
            <MDButton variant="gradient" color="info" onClick={ViewUserdetails} type="submit" sx={{ padding: 0 }} fullWidth>
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
            <MDButton variant="gradient" color="info" onClick={ViewUserdetails} type="submit" sx={{ padding: 0 }} fullWidth>
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
            <MDButton variant="gradient" color="info" onClick={ViewUserdetails} type="submit" sx={{ padding: 0 }} fullWidth>
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
            <MDButton variant="gradient" color="info" onClick={ViewUserdetails} type="submit" sx={{ padding: 0 }} fullWidth>
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
      <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
        <Tab
          label="App"
          icon={
            <Icon fontSize="small" sx={{ mt: -0.25 }}>
              home
            </Icon>
          }
        />
        <Tab
          label="Message"
          icon={
            <Icon fontSize="small" sx={{ mt: -0.25 }}>
              email
            </Icon>
          }
        />
        <Tab
          label="Settings"
          icon={
            <Icon fontSize="small" sx={{ mt: -0.25 }}>
              settings
            </Icon>
          }
        />

      </Tabs>
      {viewdetails ?
        <UserView
          Viewdetails={ViewUserdetails} />
        :
        <UserList
          collection={collection}
          Viewdetails={ViewUserdetails} />
      }

    </DashboardLayout>
  );
}

export default Users;
