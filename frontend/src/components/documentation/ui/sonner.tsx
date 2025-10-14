'use client';

import { Toaster as LocalToaster } from './toaster';

// Local passthrough Toaster — uses the project's local Toaster implementation.
const Toaster = (props: any) => {
  return <LocalToaster {...props} />;
};

export { Toaster };
