import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import NextThemeProvider from '../context/NextThemeProvider';

type Props = {
  children?: ReactNode;
  // any props that come into the component
};

function Layout({ children }: Props) {
  return (
    <NextThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex flex-grow justify-center items-center">{children}</main>
      </div>
    </NextThemeProvider>
  );
}

export default Layout;
