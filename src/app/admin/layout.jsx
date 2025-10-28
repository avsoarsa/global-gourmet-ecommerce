'use client';

import { AdminProvider } from '../../context/AdminContext';

const AdminRootLayout = ({ children }) => {
  return <AdminProvider>{children}</AdminProvider>;
};

export default AdminRootLayout;
