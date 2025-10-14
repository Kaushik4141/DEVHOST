'use client';

import React, { useEffect, useState } from 'react';
import LibraryCard from './LibraryCard';
import { Library } from '@/types/Library';

interface LibrariesGridProps {
  libraries: Library[];
}

const LibrariesGrid: React.FC<LibrariesGridProps> = ({ libraries }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // After initial animation, set isInitialLoad to false for future renders
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); // Match this with your animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {libraries.map((library, index) => (
        <LibraryCard
          key={library.id}
          library={library}
          index={index}
          totalCards={libraries.length}
          isInitialLoad={isInitialLoad}
        />
      ))}
    </div>
  );
};

export default LibrariesGrid;