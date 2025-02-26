import { Button } from "../ui/core/button";
import { Footer } from "../ui/layout/footer";
import { Header } from "../ui/layout/header";

export function Home() {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-pageBg md:justify-between">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

function Content() {
  return (
    <div className="mt-[100px] md:mt-0 pb-[112px] md:pb-0">
      <h1 className="hidden text-center uppercase md:block text-header-text-size leading-header-text-lineheight font-pilotCommandSpaced text-headerText">
        Trade, Earn, Grow
      </h1>
      <div className="space-y-8 md:hidden">
        <h1 className="text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText">
          Trade
        </h1>
        <div className="h-3.5 w-3.5 rounded-full bg-white mx-auto" />
        <h1 className="text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText">
          Earn
        </h1>
        <div className="h-3.5 w-3.5 rounded-full bg-white mx-auto" />
        <h1 className="text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText">
          Grow
        </h1>
      </div>

      <p className="w-10/12 mx-auto mt-4 text-sm font-medium text-center font-bricolageGrotesque md:text-base text-baseWhite">
        Trade smarter, earn bigger, and grow your portfolio with confidence.
      </p>
      <div className="flex justify-center mt-12">
        <Button variant={"outline"} size={"lg"} className="w-[219px]">
          Launch app
        </Button>
      </div>
    </div>
  );
}
