import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import UserView from "./components/UserView";


function Users() {
  const navigate = useNavigate();
  const path = usercalls();
  const [viewdetails, setViewdetails] = useState(false)
  const [userdata, setUserdata] = useState({})
  const [adminData, setAdmindata] = useState({})
  const [loading, setLoading] = useState(true)

  const ViewUserdetails = () => {
    setViewdetails(!viewdetails);
  }
  useEffect(() => {
    getdata();
    getadmin();
  }, [])

  const getdata = async () => {
    setLoading(true)
    const url = endpoints.getusers;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          setUserdata(result.data);
          setLoading(false)
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const getadmin = async () => {
    const url = endpoints.adminwallet;
    try {
      const data = await path.getCall({ url });
      const result = await data.json();
      if (result.status === true) {
        if (result && result.data) {
          setAdmindata(result.data);
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <UserView
        Viewdetails={ViewUserdetails}
        adminData={adminData}
        getadmin={getadmin}
        loading={loading}
      />
    </DashboardLayout>
  );
}

export default Users;
