import * as React from 'react';

declare const useAge: (format?: string) => (string | React.Dispatch<React.SetStateAction<string>>)[];

export { useAge };
