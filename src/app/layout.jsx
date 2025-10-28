import './globals.css';

import AppClientShell from './AppClientShell';
import { AppProviders } from './providers';

export const metadata = {
  title: 'Global Gourmet Ecommerce',
  description: 'Premium global gourmet products and curated experiences.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AppProviders>
          <AppClientShell>{children}</AppClientShell>
        </AppProviders>
      </body>
    </html>
  );
}
