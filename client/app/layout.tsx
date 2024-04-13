import Link from 'next/link';
import LoginPage from './telegram/authorization/login/page';
import VerificationForm from './telegram/authorization/verification/VerificationForm/VerificationForm';

import bg from './telegram/assets/background.jpg'

import Navbar from "./components/navbar/navbar";
import SideNav from './components/navbarNew/navbar';
import "./components/navbar/navbar.css";
import "./globals.css";



interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {

  return (
    <html lang="en">
      <body 
      style={{
        backgroundImage: `url(${bg.src})`}}
        >
        {/* <Navbar /> */}
        <SideNav />
        {children}
      </body>
    </html>
  );
}
