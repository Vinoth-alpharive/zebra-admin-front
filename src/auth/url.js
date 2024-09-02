const BaseUrl = "https://letswinsports.io/service/api/v1";
// const adminBaseUrl = "http://143.244.132.176/zebraApi";
const adminBaseUrl = "https://zebraswap.exchange/zebraApi";

const adminBaseUrlv2 = "https://letswinsports.io/service/api/v2/admin";
const userBaseUrl = "https://letswinsports.io/service/api/v1/users";
const paymentBaseUrl = "https://letswinsports.io/service/api/v1/payment";


// const adminBaseUrl = "http://localhost:3500/zebraApi";
// const BaseUrl = "/api/v1";
// const adminBaseUrl = "/api/v1/admin";
// const paymentBaseUrl = "/api/v1/payment";

export const endpoints = {
    //dashboad
    dashboard: `${adminBaseUrl}/admin-details`,
    //uploadimage
    upload: `${BaseUrl}/upload`,
    update: `${adminBaseUrl}/update`,
    aboutus: `${adminBaseUrl}/update_document`,
    getDoc: `${adminBaseUrl}/get_document`,
    sendNotification: `${adminBaseUrl}/create-notification`,
    //User flow
    adminlogin: `${adminBaseUrl}/auth/login`,
    twofacreate: `${adminBaseUrl}/2fa-create`,
    twofaverify: `${adminBaseUrl}/2fa-verify`,
    twofaenable: `${adminBaseUrl}/2fa-enable`,
    addtoken: `${adminBaseUrl}/addtoken`,
    deletetoken: `${adminBaseUrl}/debit-token`,
    resetpassword: `${adminBaseUrl}/reset`,
    listtournament: `${adminBaseUrl}/tournament`,
    deletetournamet: `${adminBaseUrl}/tournament`,
    bethistory: `${adminBaseUrl}/list-bet`,
    live: `${adminBaseUrl}/get_live_game`,
    update_user: `${adminBaseUrl}/admin/updateAdminFee`,
    update_users: `${adminBaseUrl}/admin/UpdateNetwork`,
    stakingLiq: `${adminBaseUrl}/admin/stakingAddLiquidity`,
    LaunchpadHistory: `${adminBaseUrl}/users/LaunchpadHistory`,

    //Sub Admin
    subadmincreate: `${adminBaseUrl}/create`,
    subadminlist: `${adminBaseUrl}/listadmins`,
    changepassword: `${adminBaseUrl}/change-password`,

    //Users
    getusers: `${adminBaseUrl}/auth/usersList`,
    deposithistory: `${adminBaseUrl}/deposit-history`,

    //Asset
    createasset: `${adminBaseUrl}/auth/walletDeatils`,

    //payment history
    paymenthistory: `${paymentBaseUrl}/listtransactions`,
    paymenthistorytype: `${paymentBaseUrl}/listtransactionstype`,
    withdrawlist: `${adminBaseUrl}/auth/addSubAdmin`,
    withdrawlists: `${adminBaseUrl}/admin/getAdminFee`,
    admin_Network: `${adminBaseUrl}/admin/getNetworkFull`,
    farmingPairs: `${adminBaseUrl}/admin/farmingPairs`,
    delete_user: `${adminBaseUrl}/bet365/deleteSubadminById`,
    withdrawhistory: `${adminBaseUrl}/withdraw-history`,
    withdrawinitiate: `${paymentBaseUrl}/withdraw_from_admin`,
    withdrawedit: `${paymentBaseUrl}/withdraw-edit`,
    removePais: `${adminBaseUrl}/admin/removePair`,
    removeNetwork: `${adminBaseUrl}/admin/removeNetwork`,

    //Transaction
    overalltransaction: `${adminBaseUrl}/auth/transactionHistory`,
    forms: `${adminBaseUrl}/auth/forms`,

    //adminwallet
    adminwallet: `${adminBaseUrl}/adminwallet`,
    footBallBettingHistory: `${adminBaseUrl}/auth/bettingHistory`,
    transactionhis: `${adminBaseUrl}/auth/getAllTransactionHist`,
    getLiquidity: `${adminBaseUrl}/admin/getAssets`,
    getchain: `${adminBaseUrl}/admin/getNetwork`,
    addasset: `${adminBaseUrl}/admin/addAssets`,
    getFactoryContract: `${adminBaseUrl}/admin/getFactoryContract`,
    FactoryContract: `${adminBaseUrl}/admin/FactoryContract`,
    RouterContract: `${adminBaseUrl}/admin/RouterContract`,
    addNetwork: `${adminBaseUrl}/admin/addNetwork`,
    farmingPairs: `${adminBaseUrl}/admin/farmingPairs`,
    farmingAddPairs: `${adminBaseUrl}/admin/farmingAddPairs`,
    farmingLiquidityPairs: `${adminBaseUrl}/admin/farmingAddLiquidity`,
    farmingLiquiPairs: `${adminBaseUrl}/admin/farmingLiquidity`,

    stakingPairs: `${adminBaseUrl}/admin/stakingPairs`,
    getstakingPairs: `${adminBaseUrl}/admin/getstakingPairs`,
    stakingAddPairs: `${adminBaseUrl}/admin/stakingAddPairs`,

    //Cricket Matches
    addgame: `${adminBaseUrl}/game`,
    cricketMatchInfo: `${adminBaseUrl}/cri-matches`,
    cricketTournamentInfo: `${adminBaseUrl}/tournament-info`,
    cricketMatchdetailsInfo: `${adminBaseUrl}/match`,
    getmatch: `${adminBaseUrl}/2day-matches`,
    playerinfo: `${BaseUrl}/users/player-info`,
    launchPad: `${adminBaseUrl}/users/getLaunchPad`,
    launchPadUpdate: `${adminBaseUrl}/users/updatelaunchPad`,
    cricketBettingHistory: `${adminBaseUrlv2}/cricket-user-betting-history-admin`,
    //football matches
    listfootballtournament: `${adminBaseUrl}/football-list-tournament`,
    listfootballmatch: `${adminBaseUrl}/football-list-matches`,
    liveTracker: `${BaseUrl}/users/football-widget?match_key=23xmvkhp6wkyqg8`,
    setBetAmount: `${adminBaseUrl}/football-betting-admin`,
    editBetAmount: `${adminBaseUrl}/football-betting-admin-edit`,
    editCricketBetAmount: `${adminBaseUrl}/cricket-betting-admin-edit`,
    footBallBtAmtMatch: `${adminBaseUrl}/football-betting-admin-list`,
    footBallLiveScore: `${adminBaseUrl}/football-realtime-data`,
    footballPlayersList: `${adminBaseUrl}/football-lineup`,
    footBallTodayMatch: `${adminBaseUrl}/get_today_football_match_admin`,
    cricketTodayMatch: `${adminBaseUrlv2}/get_today_cricket_match_admin`,
    //v2 cricket matches
    listCricketTournament: `${adminBaseUrlv2}/cricket-list-tournament`,
    listcricketmatch: `${adminBaseUrlv2}/cricket-list-matches`,
    setCricketBetAmount: `${adminBaseUrlv2}/cricket-betting-admin`,
    cricketBtAmtMatch: `${adminBaseUrlv2}/cricket-betting-admin-list`,
    cricketLiveScore: `${adminBaseUrlv2}/cricket-real-time-data`,
    cricketPlayersList: `${adminBaseUrlv2}/cricket-list-matches-players`,
    newsUpload: `${adminBaseUrl}/update-news-content`,
    newsContent: `${adminBaseUrl}/get-news-content`,
    deleteNewsContent: `${adminBaseUrl}/delete-news-content`,
    editNewsContent: `${adminBaseUrl}/edit-news-content`,

    leaguelist: `${adminBaseUrl}/bet365/leagueList`,
    showhide: `${adminBaseUrl}/bet365/leagueStatus`,

    // Front End URL
    front: "/zebraadmin"
};
