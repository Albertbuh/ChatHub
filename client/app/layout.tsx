export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Мой заголовок</h1>
        </header>
        {children}
        <footer>
          <p>Мой подвал</p>
        </footer>
      </body>
    </html>
  );
}