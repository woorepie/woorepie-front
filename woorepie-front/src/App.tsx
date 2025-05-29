import { Routes, Route, Outlet } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import HomePage from "./pages/page"
import PropertiesPage from "./pages/properties/page"
import PropertyDetailPage from "./pages/properties/[id]/page"
import PropertyFilterPage from "./pages/properties/filter/page"
import PropertyDocumentsPage from "./pages/properties/register/documents/page"
import PropertyDocumentsUploadPage from "./pages/properties/register/documents/upload/page"
import AgentPropertyRegisterPage from "./pages/properties/register/agent/page"
import ExchangePage from "./pages/exchange/page"
import DisclosurePage from "./pages/disclosure/page"
import MyPage from "./pages/mypage/page"
import MyProfilePage from "./pages/mypage/profile/page"
import MyAccountPage from "./pages/mypage/account/page"
import MySubscriptionPage from "./pages/mypage/subscription/page"
import MyTransactionsPage from "./pages/mypage/transactions/page"
import ResetPasswordPage from "./pages/auth/reset-password/page"
import ForgotPasswordPage from "./pages/auth/forgot-password/page"
import SignupPage from "./pages/auth/signup/page"
import LoginPage from "./pages/auth/login/page"
import KycPage from "./pages/auth/kyc/page"
import AgentCompanyPage from "./pages/auth/agent/company/page"
import AgentRepresentativePage from "./pages/auth/agent/representative/page"
import AgentKycPage from "./pages/auth/agent/kyc/page"
import QNAPage from "./pages/qna/page"
import SubscriptionPage from "./pages/subscription/page"
import SubscriptionListPage from "./pages/subscription/[id]/page"
import PropertySubscriptionPage from "./pages/subscription/detail/page"
import PropertySubscriptionEndPage from "./pages/subscription/endpage/page"
import AgentMyPage from "./pages/agent-mypage/page"
import AgentMyProfilePage from "./pages/agent-mypage/profile/page"
import AgentMyAccountPage from "./pages/agent-mypage/account/page"


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="properties/filter" element={<PropertyFilterPage />} />
          <Route
            path="properties/register"
            element={
              <ProtectedRoute onlyAgent>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentPropertyRegisterPage />} />
            <Route path="documents/test" element={<PropertyDocumentsPage />} />
            <Route path="documents" element={<PropertyDocumentsUploadPage />} />
          </Route>
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="disclosure" element={<DisclosurePage />} />
          <Route path="customer" element={<QNAPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          <Route path="auth/kyc" element={<KycPage />} />
          <Route path="auth/agent/company" element={<AgentCompanyPage />} />
          <Route path="auth/agent/representative" element={<AgentRepresentativePage />} />
          <Route path="auth/agent/kyc" element={<AgentKycPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="subscription/:id" element={<SubscriptionListPage />} />
          <Route path="subscription/:id/detail" element={<PropertySubscriptionPage />} />
          <Route path="subscription/:id/endpage" element={<PropertySubscriptionEndPage />} />
          
          
          <Route
            path="mypage"
            element={
              <ProtectedRoute onlyCustomer>
                <MyPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyProfilePage />} />
            <Route path="account" element={<MyAccountPage />} />
            <Route path="subscription" element={<MySubscriptionPage />} />
            <Route path="transactions" element={<MyTransactionsPage />} />
          </Route>
          <Route
            path="agent-mypage"
            element={
              <ProtectedRoute onlyAgent>
                <AgentMyPage />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<AgentMyProfilePage />} />
            <Route path="account" element={<AgentMyAccountPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
