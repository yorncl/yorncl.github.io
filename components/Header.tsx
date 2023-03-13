import Link from "next/link";

function Header() {
  return (
    <header className="w-full flex flex-col bold justify-start align-start">
      <Link href="/">
        <h1 className="text-gray text-2xl m-2 cursor-pointer">yorn.dev</h1>
      </Link>
      <div className="h-3 w-full header-gradient"></div>
    </header>
  );
}

export default Header;
