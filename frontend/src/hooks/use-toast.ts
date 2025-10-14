import { useState } from 'react';

type Toast = {
  id: string | number;
  title?: string;
  description?: string;
  action?: any;
  [k: string]: any;
};

export function useToast() {
  const [toasts] = useState<Toast[]>([]);
  return { toasts };
}

export default useToast;
