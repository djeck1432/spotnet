const socials = [
  {
    icon: "src/assets/img/DiscordLogo.png",
    link: "https://discord.com/",
    title: "Discord",
  },
  {
    icon: "src/assets/img/XLogo.png",
    link: "https://twitter.com/SpotNet_123",
    title: "X",
  },
  {
    icon: "src/assets/img/TelegramLogo.png",
    link: "https://t.me/djeck_vorobey1",
    title: "Telegram",
  },
];
export function Footer() {
  return (
    <div className="hidden md:w-11/12 xl:w-[1280px] px-10 rounded-t-4xl lg:bg-navbg pb-10 pt-6 mx-auto h-[88px] md:flex  justify-between">
      <h4 className="font-bold uppercase font-instrumentsans text-baseWhite text-logo leading-logo">
        Margin
      </h4>
      <div className="flex items-center h-6 gap-6">
        {socials.map((social, index) => (
          <a href={social.link} key={index}>
            <img src={social.icon} alt="" className="size-6" />
          </a>
        ))}
      </div>
    </div>
  );
}
