import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import React from "react";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
import moment from "moment";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions({ transaction, transactionHistory }) {

  // const [transactionbasis, setTransactionbasis] = useState({
  //   credit: [],
  //   debit: [],
  //   sell: [],
  //   buy: []
  // })
  const [credit, setCredit] = useState([])
  const [debit, setDebit] = useState([])
  const [sell, setSell] = useState([])
  const [buy, setBuy] = useState([])

  useEffect(() => {
    const query = "CREDIT"
    const items = []
    transaction.filter(function (item) {
      if (item.type) {
        if (item.type.indexOf(query) > -1) {
          items.push(item)
        }
      }
    })
    setCredit(items)
    // setTransactionbasis({
    //   ...transactionbasis,
    //   credit: items
    // })

    const query1 = "DEBIT"
    const items1 = []
    transaction.filter(function (item) {
      if (item.type) {
        if (item.type.indexOf(query1) > -1) {
          items1.push(item)
        }
      }
    })
    // setTransactionbasis({
    //   ...transactionbasis,
    //   debit: items1
    // })
    setDebit(items1)


    const query2 = "SELL"
    const items2 = []
    transaction.filter(function (item) {
      if (item.type) {
        if (item.type.indexOf(query2) > -1) {
          items2.push(item)
        }
      }
    })
    // setTransactionbasis({
    //   ...transactionbasis,
    //   sell: items2
    // })
    setSell(items2)

    const query3 = "BUY"
    const items3 = []
    transaction.filter(function (item) {
      if (item.type) {
        if (item.type.indexOf(query3) > -1) {
          items3.push(item)
        }
      }
    })
    // setTransactionbasis({
    //   ...transactionbasis,
    //   sell: items2
    // })
    setBuy(items3)
  }, [])

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Transaction&apos;s
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Latest
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Credit & debit
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {credit.length || debit.length ? <>
            {credit.slice(0, 2).map((credit, index) => (
              <Transaction
                color="success"
                icon="expand_more"
                name={credit.type}
                description={moment(credit.updatedAt).format("llll")}
                value={`+$ ${credit.credit}`}
              />
            ))}
            {debit.slice(0, 2).map((debit, index) => (
              <Transaction
                color="error"
                icon="expand_more"
                name={debit.type}
                description={moment(debit.updatedAt).format("llll")}
                value={`-$ ${debit.debit}`}
              />
            ))}
          </> : <>
            <MDTypography variant="h6">No Credit & debit History</MDTypography>
          </>}
        </MDBox>
        <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            Buy & sell
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {sell.length || buy.length ? <>
            {sell.slice(0, 2).map((type, index) => (
              <Transaction
                color="error"
                icon="expand_more"
                name={type.type}
                description={moment(type.updatedAt).format("llll")}
                value={`-$ ${type.debit}`}
              />
            ))}
            {buy.slice(0, 2).map((type, index) => (
              <Transaction
                color="success"
                icon="expand_more"
                name={type.type}
                description={moment(type.updatedAt).format("llll")}
                value={`+$ ${type.credit}`}
              />
            ))}
          </> : <>
            <MDTypography variant="h6">No Credit & debit History</MDTypography>
          </>}

        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
