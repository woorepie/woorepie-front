import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold mb-4">WOORE PIE</h3>
            <p className="text-sm text-gray-600">우리투자증권에서 시작하는 안전한 토큰증권 플랫폼</p>
          </div>

          {[1, 2, 3, 4].map((column) => (
            <div key={column}>
              <h4 className="font-medium mb-3">Column {column}</h4>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-sm text-gray-600 hover:text-blue-600">
                      Link {item + (column - 1) * 5}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
          <p>© 2024 WOORE PIE. All rights reserved.</p>
          <div className="flex gap-4 mt-2">
            <Link to="/privacy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-blue-600">
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
