import Link from 'next/link';
import LoginPage from './telegram/authorization/login/page';
import VerificationForm from './telegram/authorization/verification/VerificationForm/VerificationForm';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <ul>
            <li>
              <Link href="/">HomeLESS</Link>
            </li>
            <li>
              <Link href="/telegram/authorization/login">Login</Link>
            </li>
            <li>
              <Link href="/telegram/authorization/verification">Verification</Link>
            </li>
          </ul>
        </nav>
        {children}
        {/* <LoginPage /> */}
      </body>
    </html>
  );
}
