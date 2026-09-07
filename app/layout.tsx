import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={poppins.variable}>
      <body className='bg-primary text-secondary font-sans antialiased'>
        {children}
        <Toaster
          toastOptions={{
            classNames: {
              success: "bg-green-50 border-green-200 text-green-700",
              error: "bg-red-50 border-red-200 text-red-700",
            },
          }}
        />
      </body>
    </html>
  );
}
