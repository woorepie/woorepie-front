import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/page"
import PropertiesPage from "./pages/properties/page"
import PropertyDetailPage from "./pages/properties/[id]/page"
import PropertyFilterPage from "./pages/properties/filter/page"
import PropertyRegisterPage from "./pages/properties/register/page"
import PropertyDocumentsPage from "./pages/properties/register/documents/page"
import ExchangePage from "./pages/exchange/page"
import DisclosurePage from "./pages/disclosure/page"
import MyPage from "./pages/mypage/page"
import MyProfilePage from "./pages/mypage/profile/page"
import MyAccountPage from "./pages/mypage/account/page"
import MySubscriptionPage from "./pages/mypage/subscription/page"
import MyTransactionsPage from "./pages/mypage/transactions/page"

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
        <Route path="exchange" element={<ExchangePage />} />
        <Route path="disclosure" element={<DisclosurePage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="mypage/profile" element={<MyProfilePage />} />
        <Route path="mypage/account" element={<MyAccountPage />} />
        <Route path="mypage/subscription" element={<MySubscriptionPage />} />
        <Route path="mypage/transactions" element={<MyTransactionsPage />} />
      </Route>
    </Routes>
  )
}

export default App
