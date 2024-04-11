import React from 'react';

export const FileUpload = React.forwardRef(
  (
    {
      onChange = () => {},
      onError = () => {},
      accept = '',
      ...others
    }: {
      onChange?: (result: string) => void;
      onError?: (result: unknown) => void;
      accept?: string;
    },
    ref: React.LegacyRef<HTMLInputElement>,
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let reader = new FileReader();
      let file = e.target.files?.[0];

      if (file) {
        reader.onloadend = () => {
          try {
            onChange(reader.result as string);
          } catch (e) {
            onError(e);
          }
        };
        reader.readAsText(file);
      } else {
        const error = new Error('no file');
        onError(error);
      }
    };

    return (
      <input
        type="file"
        name="File"
        style={{ display: 'none' }}
        accept={accept}
        ref={ref}
        onChange={handleInputChange}
        {...others}
      />
    );
  },
);
