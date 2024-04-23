"use client"

import bg from './telegram/assets/background.jpg'



import SideNav from './components/navbar/navbar';
import "./globals.css";
import { AuthStageProvider } from './telegram/contexts/AuthContext';
import { ExpandContextProvider } from './components/navbar/expandContxt'
import { useContext, useEffect, useState } from 'react'
import BackgroundContext, { BackgroundProvider } from './BackGroundContext';


interface RootLayoutProps {
  children: React.ReactNode;
}

const bg2 = "/backgrounds/2.jpg"


function RootLayoutInner({ children }: RootLayoutProps) {
  // const storedBg = localStorage.getItem('selectedBg');
  // const [background, setBackground] = useState(storedBg || bg2);
  // const { background } = useContext(BackgroundContext);

  const { background, updateBackground } = useContext(BackgroundContext);

  const storedBg = localStorage.getItem('selectedBg');
  const [localBackground, setLocalBackground] = useState(storedBg || bg2);

  useEffect(() => {
    setLocalBackground(background);
  }, [background]);

  useEffect(() => {
    if (storedBg) {
      updateBackground(storedBg);
    }
  }, [storedBg, updateBackground]);

  console.log("bckg current: ", background)

  return (
    <html lang="en">
      <body style={{ backgroundImage: `url(${localBackground})` }}>
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

export default function RootLayout(props: RootLayoutProps) {

  const bg1 = '/backgrounds/1.jpg'
  const bg2 = '/backgrounds/2.jpg'
  const bg3 = '/backgrounds/3.jpg'
  const bg4 = '/backgrounds/4.jpg'
  const bg5 = '/backgrounds/5.jpg'

  const { background } = useContext(BackgroundContext);


  console.log("bckg: ", background)
  return (
    <html lang="en">
      <BackgroundProvider>
        <RootLayoutInner {...props} />
      </BackgroundProvider>
    </html>
  );
}
