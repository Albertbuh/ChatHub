import bg from './telegram/assets/background.jpg'

import SideNav from './components/navbar/navbar';
import "./globals.css";
import { AuthStageProvider } from './telegram/contexts/AuthContext';
import { Component } from 'react';


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children, }: RootLayoutProps) {

  return (
    <html lang="en">
      <body
        style={{ backgroundImage: `url(${bg.src})` }}
      >

        <AuthStageProvider>
          <SideNav />
          {children}
        </AuthStageProvider>

      </body>
    </html>
  );
}
