import Link from 'next/link';
import LoginPage from './telegram/authorization/login';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        {/* {children} */}
        <LoginPage />
      </body>
    </html>
  );
}
