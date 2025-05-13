import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/page"
import PropertiesPage from "./pages/properties/page"
import PropertyDetailPage from "./pages/properties/[id]/page"
import PropertyFilterPage from "./pages/properties/filter/page"
import PropertyRegisterPage from "./pages/properties/register/page"
import PropertyDocumentsPage from "./pages/properties/register/documents/page"
import PropertyDocumentsUploadPage from "./pages/properties/register/documents/upload/page"
import PropertyRegisterAgentPage from "./pages/properties/register/agent/page"
import ExchangePage from "./pages/exchange/page"
import DisclosurePage from "./pages/disclosure/page"
import MyPage from "./pages/mypage/page"
import MyProfilePage from "./pages/mypage/profile/page"
import MyAccountPage from "./pages/mypage/account/page"
import MySubscriptionPage from "./pages/mypage/subscription/page"
import MyTransactionsPage from "./pages/mypage/transactions/page-updated"
import ResetPasswordPage from "./pages/auth/reset-password/page"
import ForgotPasswordPage from "./pages/auth/forgot-password/page"
import SignupPage from "./pages/auth/signup/page"
import KycPage from "./pages/auth/kyc/page"
import AgentCompanyPage from "./pages/auth/agent/company/page"
import AgentRepresentativePage from "./pages/auth/agent/representative/page"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="properties/filter" element={<PropertyFilterPage />} />
        <Route path="properties/register" element={<PropertyRegisterPage />} />
        <Route path="properties/register/documents" element={<PropertyDocumentsPage />} />
        <Route path="properties/register/documents/upload" element={<PropertyDocumentsUploadPage />} />
        <Route path="properties/register/agent" element={<PropertyRegisterAgentPage />} />
        <Route path="exchange" element={<ExchangePage />} />
        <Route path="disclosure" element={<DisclosurePage />} />
        <Route path="mypage" element={<MyPage />}>
          <Route index element={<MyProfilePage />} />
          <Route path="account" element={<MyAccountPage />} />
          <Route path="subscription" element={<MySubscriptionPage />} />
          <Route path="transactions" element={<MyTransactionsPage />} />
        </Route>
        <Route path="auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
        <Route path="auth/kyc" element={<KycPage />} />
        <Route path="auth/agent/company" element={<AgentCompanyPage />} />
        <Route path="auth/agent/representative" element={<AgentRepresentativePage />} />
      </Route>
    </Routes>
  )
}

export default App
