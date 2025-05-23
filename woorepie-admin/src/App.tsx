import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./component/Layout"
import Dashboard from "./pages/Dashboard"
import SubscriptionApproval from "./pages/Subscription"
import Disclosure from "./pages/Disclosure"
import SaleApproval from "./pages/Sale"
import DividendApproval from "./pages/Dividend"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscription" element={<SubscriptionApproval />} />
          <Route path="/disclosure" element={<Disclosure />} />
          <Route path="/sale-approval" element={<SaleApproval />} />
          <Route path="/dividend" element={<DividendApproval />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
