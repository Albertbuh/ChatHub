import Link from 'next/link';

interface SideNavProps {
  width: string;
}

export default function SideNav() {

  return (
    <div className="sidenav">
      <ul>
            <li>
              <Link href="/">HomeLESS</Link>
            </li>
            <li>
              <Link href="/telegram/authorization/login">Telegram Login</Link>
            </li>
            <li>
              <Link href="/telegram/authorization/verification">Telegram Verification</Link>
            </li>

            <li>
              <Link href="/telegram">Telegram Chats</Link>
            </li>
            <li>
              <Link href="/vkontakte">Vkontakte Chats</Link>
            </li>
          </ul>

    </div>
  );

};
