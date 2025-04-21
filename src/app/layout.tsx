import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useDarkMode } from '../hooks/useDarkMode';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div className="min-h-full">
          <Navbar />
          <main className="h-[calc(100%-4rem)] bg-white dark:bg-gray-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
