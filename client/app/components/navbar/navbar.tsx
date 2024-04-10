interface SideNavProps {
  width: string;
}

export default function SideNav() {
  return (
    <div className="sidenav">
      <a href='/telegram'>Telegram</a>
      <a href='/vkontakte'>Vkontakte</a>
      <a href='#section'>Add more...</a>
    </div>
  );
};
