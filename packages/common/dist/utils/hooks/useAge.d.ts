import * as react from 'react';

declare const useAge: (format?: string) => (string | react.Dispatch<react.SetStateAction<string>>)[];

export { useAge };
