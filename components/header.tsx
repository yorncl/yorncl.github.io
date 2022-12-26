import Link from "next/link";

function Header() {
  return (
    <header className="navHeader w-full flex flex-col bold justify-start align-start">
      <div className="w-full flex flex-row items-center justify-end md:justify-start h-15">
        <Link href="/">
          <h1 className=" text-gray text-xl md:text-1xl m-2 cursor-pointer  left-4">
            yorn.dev
          </h1>
        </Link>
      </div>
      <div className="h-3 w-full header-gradient"></div>
    </header>
  );
}

export default Header;
