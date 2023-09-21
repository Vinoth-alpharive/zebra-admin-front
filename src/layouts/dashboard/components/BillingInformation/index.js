/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import { type } from "@testing-library/user-event/dist/type";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Bill from "layouts/dashboard/components/Bill";

function BillingInformation({ transactionHistory }) {
  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Latest Transaction Information
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>

          {transactionHistory.slice(0, 2).map((type, index) => (
            <Bill
              name={type.user_id.name}
              company={type.coin}
              email={type.send_address}
              vat={type.no_of_token}
              status={type.status_text}
              type={type.transaction_type}
            />
          ))}

        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
