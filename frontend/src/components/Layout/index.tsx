'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import StyledComponentsRegistry from '../../../libs/registry';
import { GlobalStyles } from './GlobalStyles';
import { Footer, Header, Preloader } from '..';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [complete, setComplete] = useState(!isLanding);

  // Ensure non-landing pages are always in completed state
  useEffect(() => {
    if (!isLanding) {
      setComplete(true);
    }
  }, [isLanding]);

  const showFooter = isLanding;
  return (
    <StyledComponentsRegistry>
      <ReactLenis
        root
        easing={(t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}
      >
        <GlobalStyles />
        {isLanding && <Preloader setComplete={setComplete} />}
        <div className={complete ? 'complete' : 'not_complete'}>
          <Header />
          {children}
          {showFooter && <Footer />}
        </div>
      </ReactLenis>
    </StyledComponentsRegistry>
  );
};

export default Layout;
