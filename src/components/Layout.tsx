import Head from 'next/head';
import Navbar from './Navbar';
import NextThemeProvider from '~/context/NextThemeProvider';

export default function Layout({ children }) {
  return (
    <NextThemeProvider>
      <Head>
        <title>Bloom</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </NextThemeProvider>
  );
}
