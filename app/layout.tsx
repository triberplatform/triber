import type { Metadata } from "next";
import "./globals.css";
import { Poppins, Noto_Serif } from 'next/font/google';

export const metadata: Metadata = {
  title: "Triber-Landing",
  description: "Triber App",
  icons: {
    icon: '/favicon.svg',  
  }
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${notoSerif.variable} font-sansSerif`}>
        {children}
      </body>
    </html>
  );
}