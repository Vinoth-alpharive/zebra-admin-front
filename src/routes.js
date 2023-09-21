
import Dashboard from "layouts/dashboard";
// import Tables from "layouts/tables";
import KYC from "layouts/kyc";
// import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
import Bidding from "layouts/bidding";
import FarmHistory from "layouts/farmhistory"
import SwapHistory from "layouts/swaphistory";
import AddNetwork from "layouts/addnetwork"
import FarmingPairs from 'layouts/farmingPairs'
import FarmingAddPairs from 'layouts/farmingAddPairs'
import StakingPairs from 'layouts/stakingPairs'

import Users from "layouts/users";
import SignIn from "layouts/authentication/sign-in";
import SubAdmin from "layouts/subadmin";
import Asset from "layouts/asset";
import Wealth from "layouts/wealth";
import Withdraw from "layouts/withdraw";
import Settings from "layouts/settings";
import Paymenthistory from "layouts/paymenthistory";
import Twofa from "layouts/authentication/twofactor";
import Reset from "layouts/authentication/reset";
import Games from "layouts/games";
import Transaction from "layouts/transaction";
import GamesList from "layouts/gameslist";
import FootBall from "layouts/football"
import Cricket from "layouts/cricket"
import CMS from 'layouts/cms'

import { endpoints } from "auth/url";
// import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Sitemanage from "layouts/sitemanage/Sitemanage";
const type = sessionStorage.getItem('roletype')
var routes;
if (type === "admin") {
  routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/dashboard`,
      component: <Dashboard />,
    },
    {
      type: "collapse",
      name: "Liquidity",
      key: "users",
      icon: <Icon fontSize="small">person</Icon>,
      route: `${endpoints.front}/liquidity`,
      component: <Users />,
    },
    {
      type: "collapse",
      name: "KYC",
      key: "KYC",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: `${endpoints.front} / KYC`,
      component: <KYC />,
    },
    {
      type: "collapse",
      name: "Exchange History",
      key: "betting",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/ExchangeHistory`,
      component: <Bidding />,
    },
    {
      type: "collapse",
      name: "Farm History",
      key: "farm",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/FarmHistory`,
      component: <FarmHistory />,
    },
    {
      type: "collapse",
      name: "Swap History",
      key: "swap",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/SwapHistory`,
      component: <SwapHistory />,
    },
    {
      type: "collapse",
      name: "Admin Fee",
      key: "Afees",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/AdminFee`,
      component: <Withdraw />,
    },
    // {
    //   type: "collapse",
    //   name: "Wallet Management",
    //   key: "wallet",
    //   icon: <Icon fontSize="small">Wallet </Icon>,
    //   route: "/wallet",
    //   component: <Wallet />,
    // },

    // {
    //   type: "collapse",
    //   name: "Sub Agent Management",
    //   key: "subagent",
    //   icon: <Icon fontSize="small">Sub</Icon>,
    //   route: "/subagent",
    //   component: <Subagent />,
    // },

    // {
    //   type: "collapse",
    //   name: "Betting Analytics",
    //   key: "bettinganalytics",
    //   icon: <Icon fontSize="small">Bet</Icon>,
    //   route: "/bettinganalytics",
    //   component: <Bettinganalytics />,
    // },

    // {
    //   type: "collapse",
    //   name: "Support Management",
    //   key: "supportmangement",
    //   icon: <Icon fontSize="small">Sub</Icon>,
    //   route: "/supportmangement",
    //   component: <Supportmangement />,
    // },

    // {
    //   type: "collapse",
    //   name: "Api Management",
    //   key: "apimanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/apimanage",
    //   component: <Apimanage />,
    // },
    // {
    //   type: "collapse",
    //   name: "Line Management",
    //   key: "linemanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/linemanage",
    //   component: <Linemanage />,
    // },
    // {
    //   type: "collapse",
    //   name: "Site Management",
    //   key: "sitemanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/sitemanage",
    //   component: <Sitemanage />,
    // },

    {
      type: "collapse",
      name: "Sub Admin",
      key: "sub-admin",
      icon: <Icon fontSize="small">group_icon</Icon>,
      route: `${endpoints.front} /sub-admin`,
      component: <SubAdmin />,
    },
    // {
    //   type: "collapse",
    //   name: "Wallet",
    //   key: "asset",
    //   icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    //   route: `${endpoints.front}/wallet`,
    //   component: <Asset />,
    // },
    {
      type: "collapse",
      name: "Wealth",
      key: "wealth",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front} /wealth`,
      component: <Wealth />,
    },
    // {
    //   type: "collapse",
    //   name: "Sub Agent Management",
    //   key: "withdraw",
    //   icon: <Icon fontSize="small">account_balance</Icon>,
    //   route: `${endpoints.front}/subagent`,
    //   component: <Withdraw />,
    // },
    // {
    //   type: "collapse",
    //   name: "Betting Analytics",
    //   key: "settings",
    //   icon: <Icon fontSize="small">settings</Icon>,
    //   route: `${endpoints.front}/bettinganalytics`,
    //   component: <Settings />,
    // },
    {
      type: "collapse",
      name: "Payment History",
      key: "payment-history",
      icon: <Icon fontSize="small">receipt_icon</Icon>,
      route: `${endpoints.front}/payment-history`,
      component: <Paymenthistory />,
    },
    // {
    //   type: "collapse",
    //   name: "Tournament",
    //   key: "games",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: `${ endpoints.front } /tournament`,
    //   component: <Games />,
    // },
    // {
    //   type: "collapse",
    //   name: "Support Management",
    //   key: "games",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: "/supportmangement",
    //   component: <Games />,
    // },
    // {
    //   type: "collapse",
    //   name: "Game Management",
    //   key: "football",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: `${endpoints.front}/football`,
    //   component: <FootBall />,
    // },
    // {
    //   type: "collapse",
    //   name: "Line Management",
    //   key: "cricket",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: `${endpoints.front}/linemanage`,
    //   component: <Cricket />,
    // },
    // {
    //   type: "collapse",
    //   name: "Site Management",
    //   key: "cms",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: `${endpoints.front}/sitemanage`,
    //   component: <CMS />,
    // },
    // {
    //   type: "collapse",
    //   name: "Api Management",
    //   key: "gameslist",
    //   icon: <Icon fontSize="small">sports_esports_icon</Icon>,
    //   route: `${endpoints.front}/apimanage`,
    //   component: <GamesList />,
    // },
    {
      type: "collapse",
      name: "Add Chain",
      key: "transaction",
      icon: <Icon fontSize="small">repeat</Icon>,
      route: `${endpoints.front}/addChain`,
      component: <AddNetwork />,
    },
    {
      type: "collapse",
      name: "Farm Pairs",
      key: "farm_pairs",
      icon: <Icon fontSize="small">repeat</Icon>,
      route: `${endpoints.front}/FarmingPairs`,
      component: <FarmingPairs />,
    },
    {
      type: "collapse",
      name: "Staking Pairs",
      key: "stake_pairs",
      icon: <Icon fontSize="small">repeat</Icon>,
      route: `${endpoints.front}/StakingPairs`,
      component: <StakingPairs />,
    },
    {
      type: "",
      name: "",
      key: "farm_add_pairs",
      icon: "",
      route: `${endpoints.front}/FarmingAddPairs`,
      component: <FarmingAddPairs />,
    },
    {
      route: `${endpoints.front}/twofa`,
      key: "login",
      component: <Twofa />,
    },
    {
      route: `${endpoints.front}/reset`,
      key: "reset",
      component: <Reset />,
    },
    // {
    //   type: "collapse",
    //   name: "Tables",
    //   key: "tables",
    //   icon: <Icon fontSize="small">table_view</Icon>,
    //   route: `${ endpoints.front } /tables`,
    //   component: <Tables />,
    // },

    // {
    //   type: "collapse",
    //   name: "Billing",
    //   key: "billing",
    //   icon: <Icon fontSize="small">receipt_long</Icon>,
    //   route: `${endpoints.front}/billing`,
    //   component: <Billing />,
    // },
    // {
    //   type: "collapse",
    //   name: "RTL",
    //   key: "rtl",
    //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    //   route: `${endpoints.front}/rtl`,
    //   component: <RTL />,
    // },
    // {
    //   type: "collapse",
    //   name: "Notifications",
    //   key: "notifications",
    //   icon: <Icon fontSize="small">notifications</Icon>,
    //   route: `${endpoints.front}/notifications`,
    //   component: <Notifications />,
    // },
    // {
    //   type: "collapse",
    //   name: "Profile",
    //   key: "profile",
    //   icon: <Icon fontSize="small">person</Icon>,
    //   route: `${endpoints.front}/profile`,
    //   component: <Profile />,
    // },
    {
      icon: <Icon fontSize="small">login</Icon>,
      route: `${endpoints.front}/login`,
      key: "login",
      component: <SignIn />,
    },
    // {
    //   type: "collapse",
    //   name: "Sign Up",
    //   key: "sign-up",
    //   icon: <Icon fontSize="small">assignment</Icon>,
    //   route: `${ endpoints.front } /authentication/sign - up`,
    //   component: <SignUp />,
    // },

  ];
} else {
  routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/dashboard`,
      component: <Dashboard />,
    },
    {
      type: "collapse",
      name: "Users",
      key: "users",
      icon: <Icon fontSize="small">person</Icon>,
      route: `${endpoints.front}/users`,
      component: <Users />,
    },
    {
      type: "collapse",
      name: "KYC",
      key: "KYC",
      icon: <Icon fontSize="small">table_view</Icon>,
      route: `${endpoints.front} / KYC`,
      component: <KYC />,
    },
    {
      type: "collapse",
      name: "Betting History",
      key: "betting",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/betting`,
      component: <Bidding />,
    },
    // {
    //   type: "collapse",
    //   name: "Wallet Management",
    //   key: "wallet",
    //   icon: <Icon fontSize="small">Wallet </Icon>,
    //   route: "/wallet",
    //   component: <Wallet />,
    // },

    // {
    //   type: "collapse",
    //   name: "Sub Agent Management",
    //   key: "subagent",
    //   icon: <Icon fontSize="small">Sub</Icon>,
    //   route: "/subagent",
    //   component: <Subagent />,
    // },

    // {
    //   type: "collapse",
    //   name: "Betting Analytics",
    //   key: "bettinganalytics",
    //   icon: <Icon fontSize="small">Bet</Icon>,
    //   route: "/bettinganalytics",
    //   component: <Bettinganalytics />,
    // },

    // {
    //   type: "collapse",
    //   name: "Support Management",
    //   key: "supportmangement",
    //   icon: <Icon fontSize="small">Sub</Icon>,
    //   route: "/supportmangement",
    //   component: <Supportmangement />,
    // },

    // {
    //   type: "collapse",
    //   name: "Api Management",
    //   key: "apimanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/apimanage",
    //   component: <Apimanage />,
    // },
    // {
    //   type: "collapse",
    //   name: "Line Management",
    //   key: "linemanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/linemanage",
    //   component: <Linemanage />,
    // },
    // {
    //   type: "collapse",
    //   name: "Site Management",
    //   key: "sitemanage",
    //   icon: <Icon fontSize="small">Api</Icon>,
    //   route: "/sitemanage",
    //   component: <Sitemanage />,
    // },

    {
      type: "collapse",
      name: "Sub Admin",
      key: "sub-admin",
      icon: <Icon fontSize="small">group_icon</Icon>,
      route: `${endpoints.front} /sub-admin`,
      component: <SubAdmin />,
    },
    {
      type: "collapse",
      name: "Wallet",
      key: "asset",
      icon: <Icon fontSize="small">account_balance_wallet</Icon>,
      route: `${endpoints.front}/wallet`,
      component: <Asset />,
    },
    {
      type: "collapse",
      name: "Wealth",
      key: "wealth",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front} /wealth`,
      component: <Wealth />,
    },
    // {
    //   type: "collapse",
    //   name: "Sub Agent Management",
    //   key: "withdraw",
    //   icon: <Icon fontSize="small">account_balance</Icon>,
    //   route: `${endpoints.front}/subagent`,
    //   component: <Withdraw />,
    // },
    {
      type: "collapse",
      name: "Betting Analytics",
      key: "settings",
      icon: <Icon fontSize="small">settings</Icon>,
      route: `${endpoints.front}/bettinganalytics`,
      component: <Settings />,
    },
    {
      type: "collapse",
      name: "Payment History",
      key: "payment-history",
      icon: <Icon fontSize="small">receipt_icon</Icon>,
      route: `${endpoints.front}/payment-history`,
      component: <Paymenthistory />,
    },
    // {
    //   type: "collapse",
    //   name: "Tournament",
    //   key: "games",
    //   icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
    //   route: `${ endpoints.front } /tournament`,
    //   component: <Games />,
    // },
    {
      type: "collapse",
      name: "Support Management",
      key: "games",
      icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
      route: "/supportmangement",
      component: <Games />,
    },
    {
      type: "collapse",
      name: "Game Management",
      key: "football",
      icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
      route: `${endpoints.front}/football`,
      component: <FootBall />,
    },
    {
      type: "collapse",
      name: "Line Management",
      key: "cricket",
      icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
      route: `${endpoints.front}/linemanage`,
      component: <Cricket />,
    },
    {
      type: "collapse",
      name: "Site Management",
      key: "cms",
      icon: <Icon fontSize="small">insert_invitation_icon</Icon>,
      route: `${endpoints.front}/sitemanage`,
      component: <CMS />,
    },
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: `${endpoints.front}/dashboard`,
      component: <Dashboard />,
    },
    {
      type: "collapse",
      name: "Api Management",
      key: "gameslist",
      icon: <Icon fontSize="small">sports_esports_icon</Icon>,
      route: `${endpoints.front}/apimanage`,
      component: <GamesList />,
    },
    {
      type: "collapse",
      name: "Transaction",
      key: "transaction",
      icon: <Icon fontSize="small">repeat</Icon>,
      route: `${endpoints.front}/transaction`,
      component: <Transaction />,
    },
    {
      route: `${endpoints.front}/twofa`,
      key: "login",
      component: <Twofa />,
    },
    {
      route: `${endpoints.front}/reset`,
      key: "reset",
      component: <Reset />,
    },
    // {
    //   type: "collapse",
    //   name: "Tables",
    //   key: "tables",
    //   icon: <Icon fontSize="small">table_view</Icon>,
    //   route: `${ endpoints.front } /tables`,
    //   component: <Tables />,
    // },

    // {
    //   type: "collapse",
    //   name: "Billing",
    //   key: "billing",
    //   icon: <Icon fontSize="small">receipt_long</Icon>,
    //   route: `${endpoints.front}/billing`,
    //   component: <Billing />,
    // },
    // {
    //   type: "collapse",
    //   name: "RTL",
    //   key: "rtl",
    //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    //   route: `${endpoints.front}/rtl`,
    //   component: <RTL />,
    // },
    // {
    //   type: "collapse",
    //   name: "Notifications",
    //   key: "notifications",
    //   icon: <Icon fontSize="small">notifications</Icon>,
    //   route: `${endpoints.front}/notifications`,
    //   component: <Notifications />,
    // },
    // {
    //   type: "collapse",
    //   name: "Profile",
    //   key: "profile",
    //   icon: <Icon fontSize="small">person</Icon>,
    //   route: `${endpoints.front}/profile`,
    //   component: <Profile />,
    // },
    {
      icon: <Icon fontSize="small">login</Icon>,
      route: `${endpoints.front}/login`,
      key: "login",
      component: <SignIn />,
    },
    // {
    //   type: "collapse",
    //   name: "Sign Up",
    //   key: "sign-up",
    //   icon: <Icon fontSize="small">assignment</Icon>,
    //   route: `${ endpoints.front } /authentication/sign - up`,
    //   component: <SignUp />,
    // },

  ];
}


export default routes;
