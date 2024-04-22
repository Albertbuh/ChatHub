import SideNav from './components/navbar/navbar';
import "./globals.css";
import { AuthStageProvider } from './telegram/contexts/AuthContext';
import { ExpandContextProvider } from './components/navbar/expandContxt'

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children, }: RootLayoutProps) {

  return (
    <html lang="en">
      <body
        style={{ backgroundImage: `url(/backgrounds/2.jpg)` }}
      >
        <AuthStageProvider>
          <ExpandContextProvider>
            <SideNav />
            {children}
          </ExpandContextProvider>
        </AuthStageProvider>

      </body>
    </html>
  );
}
