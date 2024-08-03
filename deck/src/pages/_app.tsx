import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../app/globals.css';

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
