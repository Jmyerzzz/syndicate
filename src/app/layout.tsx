import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import localFont from "next/font/local";

// const inter = Inter({ subsets: ["latin"] });
// const akiraSB = localFont({
//   src: "../../public/fonts/AkiraSuperBold.woff2",
//   variable: "--font-asb",
// });

export const metadata: Metadata = {
  title: "Wagers",
  description: "Wagers Accounting",
};

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} ${akiraSB.variable}`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   );
// }

export default async function RootLayout() {
  return <div className="text-white">Temporarily Unavailable</div>;
}
