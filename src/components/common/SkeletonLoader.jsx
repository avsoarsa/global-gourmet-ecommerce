import React from 'react';

// Base Skeleton Component
const Skeleton = ({ className = '', style = {} }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={style}
  />
);

// Text Skeleton
export const TextSkeleton = ({ lines = 1, width = '100%', className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index} 
        className="h-4 rounded"
        style={{ 
          width: Array.isArray(width) 
            ? width[index % width.length] 
            : typeof width === 'function'
              ? width(index)
              : width
        }}
      />
    ))}
  </div>
);

// Circle Skeleton
export const CircleSkeleton = ({ size = '3rem', className = '' }) => (
  <Skeleton 
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

// Image Skeleton
export const ImageSkeleton = ({ height = '200px', width = '100%', className = '' }) => (
  <Skeleton 
    className={`${className}`}
    style={{ height, width }}
  />
);

// Card Skeleton
export const CardSkeleton = ({ className = '' }) => (
  <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    <ImageSkeleton height="200px" />
    <div className="p-4 space-y-3">
      <TextSkeleton width="70%" />
      <TextSkeleton lines={2} width={['90%', '80%']} />
      <div className="flex justify-between items-center pt-2">
        <TextSkeleton width="30%" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

// Product Card Skeleton
export const ProductCardSkeleton = ({ className = '' }) => (
  <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    <ImageSkeleton height="180px" />
    <div className="p-4 space-y-3">
      <TextSkeleton width="80%" />
      <TextSkeleton width="60%" />
      <div className="flex justify-between items-center pt-2">
        <TextSkeleton width="40%" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8, columns = 4, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4, className = '' }) => (
  <div className={`flex items-center space-x-4 py-4 ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton 
        key={index} 
        className="h-4 rounded"
        style={{ width: `${100 / columns - 5}%` }}
      />
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    <div className="bg-gray-50 px-6 py-3">
      <div className="flex items-center space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton 
            key={index} 
            className="h-4 rounded"
            style={{ width: `${100 / columns - 5}%` }}
          />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="px-6">
          <TableRowSkeleton columns={columns} />
        </div>
      ))}
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 4, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-10 w-full rounded" />
      </div>
    ))}
    <Skeleton className="h-10 w-full md:w-1/3 rounded mt-8" />
  </div>
);

export default {
  TextSkeleton,
  CircleSkeleton,
  ImageSkeleton,
  CardSkeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  FormSkeleton
};
