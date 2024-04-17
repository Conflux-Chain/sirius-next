import react__default from 'react';

declare const FileUpload: react__default.ForwardRefExoticComponent<{
    onChange?: ((result: string) => void) | undefined;
    onError?: ((result: unknown) => void) | undefined;
    accept?: string | undefined;
} & react__default.RefAttributes<HTMLInputElement>>;

export { FileUpload };
