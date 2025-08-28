import Image from "next/image";
import { Button } from "../components/ui/button";
import ipoImage from "../public/IPO.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center">
        {/* Content Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8 space-y-8">
          <section className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800">
              Welcome to Meroshare IPO Bot
            </h1>
            <p className="mt-4 text-sm md:text-lg text-gray-600">
              Automate your IPO applications with ease and efficiency.
            </p>
          </section>

          <section className="mt-8 flex flex-col items-center space-y-4">
            <Link href="/login">
              <Button className="w-40 md:w-48 bg-blue-500 hover:bg-blue-600 text-white">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-40 md:w-48 bg-green-500 hover:bg-green-600 text-white">
                Register
              </Button>
            </Link>
          </section>

          <section className="mt-12 text-center max-w-md">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              Meroshare IPO Bot simplifies the process of applying for IPOs,
              saving you time and ensuring accuracy. Join us today and
              experience the convenience.
            </p>
          </section>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0">
          <Image
            src={ipoImage}
            alt="IPO Illustration"
            className="rounded-lg shadow-lg"
            width={300}
            height={300}
          />
        </div>
      </div>
    </main>
  );
}
