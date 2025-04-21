import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * LoginLayout - A minimal layout for login/signup pages
 * Removes all distractions to focus on authentication
 */
const LoginLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="py-4 px-6 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
          {t('common.appName')}
        </Link>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Global Gourmet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginLayout;
