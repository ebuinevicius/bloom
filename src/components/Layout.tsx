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
      <div className="min-h-screen flex flex-col flex-grow min-w-full">
        <Navbar />
        <div>{children}</div>
      </div>
    </NextThemeProvider>
  );
}

export default Layout;
