import Link from "next/link";

export default function SideNav() {
  return (
    <div className="sidenav">
      <Link href='/telegram'>Telegram</Link>
      <Link href='/vkontakte'>Vkontakte</Link>
      <Link href='#section'>Add more...</Link>
    </div>
  );
};
