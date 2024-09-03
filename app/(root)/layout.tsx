import Image from "next/image";
import Link from "next/link";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main className="min-h-screen">{children}</main>

      <footer className="w-full bg-white p-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
          <Image
            src="/images/usdt.png"
            alt="logo-ct"
            width={10}
            height={10}
          />
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
            <li>
              <Link
                as="a"
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                as="a"
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                License
              </Link>
            </li>
            <li>
              <Link
                as="a"
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contribute
              </Link>
            </li>
            <li>
              <Link
                as="a"
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-8 border-blue-gray-50" />
        <Link
          as="a"
          href="#"
          color="blue-gray"
          className="text-center font-normal"
        >
          &copy; 2023 Material Tailwind
        </Link>
      </footer>
    </div>
  );
}
