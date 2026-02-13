import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Smart Farm - Rural Sustainability',
  description: 'AI-powered platform for rural India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mobile-container">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
