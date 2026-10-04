import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'Admin | Cervejaria Rodada',
  robots: { index: false, follow: false, nocache: true }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
