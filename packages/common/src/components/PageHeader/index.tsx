/**
 *
 * PageHeader
 *
 */
import React from 'react';
import clsx from 'clsx';

export const PageHeader = ({
  children,
  subtitle,
}: {
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        'text-1.7143rem font-medium lh-2.2857rem text-#1a1a1a mb-1.1429rem mt-2.2857rem',
        'lt-sm:text-1.2857rem lt-sm:lh-1.8571rem lt-sm:text-#050505',
      )}
    >
      {children}
      <div className="text-1rem mt-0.8571rem lh-1.2857rem text-#74798c">
        {subtitle}
      </div>
    </div>
  );
};
