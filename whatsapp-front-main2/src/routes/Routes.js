import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Home from "../pages/home/home";
import Dashboard from "../pages/myDashboard/dashboard";
import NotFound from "../pages/notFound/notFound";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/profile/profile";
import RedirectIfAuthentication from "./RedirectIfAuthentication";
import FileManger from "../pages/filesManager/FileManger";
import UploadForm from "../pages/filesManager/UploadForm";
import Account from "../pages/myAccounts/Account";
import Connect from "../pages/myAccounts/Connect";
import ContactsList from "../pages/contactList/ContactsList";
import ContactsForm from "../pages/contactList/ContactForm";
import LinkedPlatforms from "../pages/platforms/LinkedPlatforms";
import Chain from "../pages/platforms/Chain";
import SingleMessaging from "../pages/singleMessaging/SingleMessaging";
import CreateSingleMessaging from "../pages/singleMessaging/CreateSingleMessaging";
import Groupessaging from "../pages/groupMessaging/GroupMessaging";
import GroupMessagingForm from "../pages/groupMessaging/GroupMessagingForm";
import AutoReplay from "../pages/autoReply/AutoReplay";
import Conversation from "../pages/conversation/Conversation";
import Subscription from "./../pages/subscriptionManager/Subscription";
import Reconnect from "../pages/myAccounts/Reconnect";
import AutoReplayForm from "../pages/autoReply/AutoReplayForm";
import SmartBot from "../pages/smartRobot/SmartBot";
import BotResponseCreator from "../pages/smartRobot/CreateSmartBot";
import Employees from "../pages/employees/employees";
import CreateEmployee from "../pages/employees/createEmployee";
import FAQAccordion from "../components/QA/QA";
import EmployeeLogin from "../pages/login/employeeLogin";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfAuthentication>
            <Home />
          </RedirectIfAuthentication>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthentication>
            <Register />
          </RedirectIfAuthentication>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthentication>
            <Login />
          </RedirectIfAuthentication>
        }
      />
      <Route
        path="/employeeLogin"
        element={
          <RedirectIfAuthentication>
            <EmployeeLogin />
          </RedirectIfAuthentication>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiredPermission="dashboard_access">
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute requiredPermission="profile_access">
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/file-management"
        element={
          <PrivateRoute requiredPermission="file_management">
            <FileManger />
          </PrivateRoute>
        }
      />

      <Route
        path="file-management/create"
        element={
          <PrivateRoute requiredPermission="file_management">
            <UploadForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-accounts"
        element={
          <PrivateRoute requiredPermission="my_accounts">
            <Account />
          </PrivateRoute>
        }
      />

      <Route
        path="/auto-reply"
        element={
          <PrivateRoute requiredPermission="auto_reply_and_smart_bot">
            <AutoReplay />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/auto-reply/create"
        element={
          <PrivateRoute requiredPermission="auto_reply_and_smart_bot">
            <AutoReplayForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/smart-bot"
        element={
          <PrivateRoute requiredPermission="auto_reply_and_smart_bot">
            <SmartBot />
          </PrivateRoute>
        }
      />

      <Route
        path="/smart-bot/create"
        element={
          <PrivateRoute requiredPermission="auto_reply_and_smart_bot">
            <BotResponseCreator />
          </PrivateRoute>
        }
      />

      <Route
        path="my-accounts/connect"
        element={
          <PrivateRoute requiredPermission="my_accounts">
            <Connect />
          </PrivateRoute>
        }
      />

      <Route
        path="my-accounts/reconnect"
        element={
          <PrivateRoute requiredPermission="my_accounts">
            <Reconnect />
          </PrivateRoute>
        }
      />

      <Route
        path="/contact-list"
        element={
          <PrivateRoute requiredPermission="contact_phrases">
            <ContactsList />
          </PrivateRoute>
        }
      />

      <Route
        path="contact-list/create"
        element={
          <PrivateRoute requiredPermission="contact_phrases">
            <ContactsForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/linked-platforms"
        element={
          <PrivateRoute requiredPermission="linked_platforms">
            <LinkedPlatforms />
          </PrivateRoute>
        }
      />

      <Route
        path="linked-platforms/chain"
        element={
          <PrivateRoute requiredPermission="linked_platforms">
            <Chain />
          </PrivateRoute>
        }
      />

      <Route
        path="/individual-messaging"
        element={
          <PrivateRoute requiredPermission="individual_messaging">
            <SingleMessaging />
          </PrivateRoute>
        }
      />

      <Route path="/employees" element={<PrivateRoute requiredPermission="developers"><Employees /></PrivateRoute>} />

      <Route path="/employees/create" element={<PrivateRoute requiredPermission="developers"><CreateEmployee /></PrivateRoute>} />

      <Route
        path="/individual-messaging/create"
        element={
          <PrivateRoute requiredPermission="individual_messaging">
            <CreateSingleMessaging />
          </PrivateRoute>
        }
      />

      <Route
        path="/group-messaging"
        element={
          <PrivateRoute requiredPermission="group_messaging">
            <Groupessaging />
          </PrivateRoute>
        }
      />

      <Route
        path="/group-messaging/create"
        element={
          <PrivateRoute requiredPermission="group_messaging">
            <GroupMessagingForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/conversation/:id"
        element={
          <PrivateRoute requiredPermission="group_messaging">
            <Conversation />
          </PrivateRoute>
        }
      />

      <Route path="/faq" element={<FAQAccordion />} />

      <Route
        path="/subscription-manager"
        element={
          <PrivateRoute requiredPermission="subscription_manager">
            <Subscription />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
