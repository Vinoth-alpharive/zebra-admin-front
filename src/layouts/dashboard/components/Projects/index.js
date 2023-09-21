import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React examples


function Projects({ tournament }) {


  useEffect(() => {
    // buildData(tournament);
  }, [])





  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={4}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Tournaments
          </MDTypography>
        </MDBox>

      </MDBox>
      <MDBox>

      </MDBox>
    </Card>
  );
}

export default Projects;
