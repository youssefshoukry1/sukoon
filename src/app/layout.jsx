import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Sukoon — راحة لتركيز يدوم",
  description: "كوشن طبي محمول مصمم خصيصاً لدعم الظهر وزيادة التركيز لطلاب الثانوية العامة.",
  icons: {
    icon: "/Sukoon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
