import bg from './telegram/assets/background.jpg'
import bg1 from './assets/backgrounds/1.jpg'
import bg2 from './assets/backgrounds/2.jpg'
import bg3 from './assets/backgrounds/3.jpg'
import bg4 from './assets/backgrounds/4.jpg'
import bg5 from './assets/backgrounds/5.jpg'



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
        style={{ backgroundImage: `url(${bg2.src})` }}
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
