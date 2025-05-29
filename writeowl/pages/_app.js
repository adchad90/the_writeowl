// // pages/_app.js
import '../styles/globals.css';
import { Merriweather } from 'next/font/google';

const merri = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'], // optional, depending on what you need
  style: ['normal', 'italic'], // optional
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={merri.className}>
      <Component {...pageProps} />
    </main>
  );
}
