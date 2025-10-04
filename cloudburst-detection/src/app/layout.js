// src/app/layout.js
import './globals.css';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Cloudburst Detection System | SIH 2025',
  description: 'Early Warning System for Flash Flood Prevention',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}