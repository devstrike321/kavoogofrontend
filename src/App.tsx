import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import UsersList from "./components/UsersList";
import UserDetails from "./components/UserDetails";
import EditUser from "./components/EditUser";
import PartnersList from "./components/PartnersList";
import PartnerDetails from "./components/PartnerDetails";
import EditPartner from "./components/EditPartner";
import AddPartner from "./components/AddPartner";
import CampaignsList from "./components/CampaignsList";
import CampaignDetails from "./components/CampaignDetails";
import CreateCampaign from "./components/CreateCampaign";
import CreateCampaignSuccess from "./components/CreateCampaignSuccess";
import CreateCampaignFailure from "./components/CreateCampaignFailure";
import TransactionsList from "./components/TransactionsList";
import TransactionDetails from "./components/TransactionDetails";
import TeamMembersList from "./components/TeamMembersList";
import AddTeamMember from "./components/AddTeamMember";
import EditTeamMember from "./components/EditTeamMember";
import MobileProvidersList from "./components/MobileProvidersList";
import AddMobileProvider from "./components/AddMobileProvider";
import RewardsManagement from "./components/RewardsManagement";
import EditCampaign from "./components/EditCampaign";
import { isAuthenticated, getUserRole } from "./utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AuthedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  if (token) {
    return <Navigate to="/" />;
  }
  return children;
};

const AdminOnlyRoute = ({ children }: { children: React.JSX.Element }) => {
  const role = useSelector((state: RootState) => state.auth.role);
  if (role !== "adminUser") return <Navigate to="/dashboard" />;
  return children;
};

const App: React.FC = () => {

  const isAuth = useSelector((state: RootState) => state.auth.token !== null);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="app">
          {isAuth && <Header />}
          <div className="main">
            {isAuth && <Sidebar />}
            <div className="content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<AuthedRoute><Login /></AuthedRoute>} />
                <Route path="/forgot-password" element={<AuthedRoute><ForgotPassword /></AuthedRoute>} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <ProtectedRoute>
                      <UserDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partners"
                  element={
                    <ProtectedRoute>
                      <PartnersList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partners/:id"
                  element={
                    <ProtectedRoute>
                      <PartnerDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partners/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditPartner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-partner"
                  element={
                    <ProtectedRoute>
                      <AddPartner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns"
                  element={
                    <ProtectedRoute>
                      <CampaignsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns/:id"
                  element={
                    <ProtectedRoute>
                      <CampaignDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaigns/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditCampaign />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-campaign"
                  element={
                    <ProtectedRoute>
                      <CreateCampaign />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-campaign-success"
                  element={
                    <ProtectedRoute>
                      <CreateCampaignSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-campaign-failure"
                  element={
                    <ProtectedRoute>
                      <CreateCampaignFailure />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/:id"
                  element={
                    <ProtectedRoute>
                      <TransactionDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team-members"
                  element={
                    <AdminOnlyRoute>
                      <TeamMembersList />
                    </AdminOnlyRoute>
                  }
                />
                <Route
                  path="/add-team-member"
                  element={
                    <AdminOnlyRoute>
                      <AddTeamMember />
                    </AdminOnlyRoute>
                  }
                />
                <Route
                  path="/team-members/edit/:id"
                  element={
                    <AdminOnlyRoute>
                      <EditTeamMember />
                    </AdminOnlyRoute>
                  }
                />
                <Route
                  path="/mobile-providers"
                  element={
                    <AdminOnlyRoute>
                      <MobileProvidersList />
                    </AdminOnlyRoute>
                  }
                />
                <Route
                  path="/add-mobile-provider"
                  element={
                    <AdminOnlyRoute>
                      <AddMobileProvider />
                    </AdminOnlyRoute>
                  }
                />
                <Route
                  path="/rewards"
                  element={
                    <AdminOnlyRoute>
                      <RewardsManagement />
                    </AdminOnlyRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </I18nextProvider>
  );
};

export default App;
