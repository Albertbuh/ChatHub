import ClientAppWrapper from './ClientWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {<ClientAppWrapper />}
      </body>
    </html>
  );
}
