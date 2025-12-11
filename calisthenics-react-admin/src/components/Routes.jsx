import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AuthWrapper from "./AuthWrapper.jsx";
import LogoutPage from "../pages/LogoutPage.jsx";
import Home from "../pages/Home.jsx";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

// Add your page imports here as you create them
// import UserListing from "../pages/admin-access/UserListing.jsx";
// etc.

function AppRoutes() {
  // Uncomment when you have Redux set up
  // const { t } = useTranslation();
  // const userRole = useSelector((state) => state.token.authState.userRole);
  // const userLoggedInStatus = useSelector(
  //   (state) => state.token.authState.loggedInAs
  // );

  // const indexPath =
  //   userRole === "SA" && userLoggedInStatus
  //     ? "/admin-access"
  //     : "/advisor-access";

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="home" element={<Home />} />
      <Route
        path="/"
        element={
          <AuthWrapper>
            <Layout />
          </AuthWrapper>
        }
      >
        {/* Add your routes here */}
        <Route index element={<Navigate replace to="/home" />} />

        {/* Example routes - add your actual routes as you create pages */}
        {/* 
        {userRole === "SA" && userLoggedInStatus && (
          <>
            <Route path="/admin-access" element={<UserListing />} />
            // Add more routes...
          </>
        )}
        */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Layout from "../layout/Layout.jsx";
// import LoginPage from "../pages/LoginPage.jsx";
// import AuthWrapper from "./AuthWrapper.jsx";
// import LogoutPage from "../pages/LogoutPage.jsx";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import UserListing from "../pages/admin-access/UserListing.jsx";
// import AddChannel from "../pages/channel/AddChannel.jsx";
// import EditChannel from "../pages/channel/EditChannel.jsx";
// import AddUser from "../pages/admin-access/AddUser.jsx";
// import EditUser from "../pages/admin-access/EditUser.jsx";
// import AddDesignation from "../pages/designation/AddDesignation.jsx";
// import EditDesignation from "../pages/designation/EditDesignation.jsx";
// import AddParentAgency from "../pages/parent-agency/AddParentAgency.jsx";
// import EditParentAgency from "../pages/parent-agency/EditParentAgency.jsx";
// import AddSubMenu from "../pages/sub-menu/AddSubMenu.jsx";
// import EditSubMenu from "../pages/sub-menu/EditSubMenu.jsx";
// import AddWidget from "../pages/widget-config/AddWidget.jsx";
// import EditWidget from "../pages/widget-config/EditWidget.jsx";

// import Channel from "../pages/channel/Channel.jsx";
// import Designation from "../pages/designation/Designation.jsx";
// import ParentAgency from "../pages/parent-agency/ParentAgency.jsx";
// import SubMenuListing from "../pages/sub-menu/SubMenuListing.jsx";
// import AdvisorAccessListing from "../pages/advisor-access/AdvisorAccessListing.jsx";
// import WidgetAccessListing from "../pages/widget-access/WidgetAccessListing.jsx";
// import WidgetConfig from "../pages/widget-config/WidgetConfig.jsx";
// import GoogleAccessListing from "../pages/google-workspace-access/GoogleAccessListing.jsx";

// import AddAdvisorAccess from "../pages/advisor-access/AddAdvisorAccess.jsx";
// import EditAdvisorAccess from "../pages/advisor-access/EditAdvisorAccess.jsx";
// import AddWidgetAccess from "../pages/widget-access/AddWidgetAccess.jsx";
// import EditWidgetAccess from "../pages/widget-access/EditWidgetAccess.jsx";
// import ApplicationList from "../pages/application/ApplicationListing.jsx";
// import AddApplication from "../pages/application/AddApplication.jsx";
// import EditApplication from "../pages/application/EditApplication.jsx";
// import NoticeboardListing from "../pages/noticeboard/NoticeboardListing.jsx";
// import AddNoticeboard from "../pages/noticeboard/AddNoticeboard.jsx";
// import EditNoticeboard from "../pages/noticeboard/EditNoticeboard.jsx";
// import NoticeboardAccessListing from "../pages/noticeboard-access/NoticeboardAccessListing.jsx";
// import AddNoticeboardAccess from "../pages/noticeboard-access/AddNoticeboardAccess.jsx";
// import EditNoticeboardAccess from "../pages/noticeboard-access/EditNoticeboardAccess.jsx";

// function AppRoutes() {
//   const { t } = useTranslation();
//   const userRole = useSelector((state) => state.token.authState.userRole);
//   const userLoggedInStatus = useSelector(
//     (state) => state.token.authState.loggedInAs
//   );
//   const indexPath =
//     userRole === "SA" && userLoggedInStatus
//       ? "/admin-access"
//       : "/advisor-access";
//   return (
//     <Routes basename={`${import.meta.env.VITE_PUBLIC_URL}`}>
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/logout" element={<LogoutPage />} />
//       <Route
//         path="/"
//         element={
//           <AuthWrapper>
//             <Layout />
//           </AuthWrapper>
//         }
//       >
//         <Route index element={<Navigate replace to={indexPath} />} />
//         {/* For redirection only */}
//         {!userLoggedInStatus && <Route path="/*" />}
//         {userRole === "SA" && userLoggedInStatus && (
//           <>
//             <Route index element={<Navigate replace to="/admin-access" />} />
//             <Route path="/admin-access" element={<UserListing />} />
//             <Route path="/add-user" element={<AddUser />} />
//             <Route path="/edit-user" element={<EditUser />} />
//             <Route path="/widget-access" element={<WidgetAccessListing />} />
//             <Route path="/add-widget-access" element={<AddWidgetAccess />} />
//             <Route path="/edit-widget-access" element={<EditWidgetAccess />} />
//             <Route path="/channel" element={<Channel />} />
//             <Route path="/add-channel" element={<AddChannel />} />
//             <Route path="/edit-channel" element={<EditChannel />} />
//             <Route path="/designation" element={<Designation />} />
//             <Route path="/add-designation" element={<AddDesignation />} />
//             <Route path="/edit-designation" element={<EditDesignation />} />
//             <Route path="/parent-agency" element={<ParentAgency />} />
//             <Route path="/add-parent-agency" element={<AddParentAgency />} />
//             <Route path="/edit-parent-agency" element={<EditParentAgency />} />
//             <Route
//               path="/sub-menu-configuration"
//               element={<SubMenuListing />}
//             />
//             <Route path="/add-sub-menu" element={<AddSubMenu />} />
//             <Route path="/edit-sub-menu" element={<EditSubMenu />} />
//             <Route path="/widget-configuration" element={<WidgetConfig />} />
//             <Route path="/add-widget-config" element={<AddWidget />} />
//             <Route path="/edit-widget-config" element={<EditWidget />} />
//             <Route path="/noticeboard" element={<NoticeboardListing />} />
//             <Route
//               path="/add-noticeboard"
//               element={
//                 <AddNoticeboard
//                   formType="add"
//                   title={t("noticeboard.addTitle")}
//                 />
//               }
//             />
//             <Route path="/edit-noticeboard" element={<EditNoticeboard />} />
//             <Route
//               path="/noticeboard-access"
//               element={<NoticeboardAccessListing />}
//             />
//             <Route
//               path="/add-noticeboard-access"
//               element={<AddNoticeboardAccess />}
//             />
//             <Route
//               path="/edit-noticeboard-access"
//               element={<EditNoticeboardAccess />}
//             />
//             <Route path="/advisor-access" element={<AdvisorAccessListing />} />
//             <Route path="/add-advisor-access" element={<AddAdvisorAccess />} />
//             <Route
//               path="/edit-advisor-access"
//               element={<EditAdvisorAccess />}
//             />
//             <Route
//               path="/application-configuration"
//               element={<ApplicationList />}
//             />
//             <Route
//               path="/add-application-configuration"
//               element={<AddApplication />}
//             />
//             <Route
//               path="/edit-application-configuration"
//               element={<EditApplication />}
//             />
//             <Route
//               path="/google-workspace-access"
//               element={<GoogleAccessListing />}
//             />
//           </>
//         )}
//         {userRole === "AD" && userLoggedInStatus && (
//           <>
//             <Route path="/advisor-access" element={<AdvisorAccessListing />} />
//             <Route path="/add-advisor-access" element={<AddAdvisorAccess />} />
//             <Route
//               path="/edit-advisor-access"
//               element={<EditAdvisorAccess />}
//             />
//           </>
//         )}
//       </Route>
//     </Routes>
//   );
// }

// export default AppRoutes;
