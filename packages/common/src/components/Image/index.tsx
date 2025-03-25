import clsx from 'clsx';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Modal } from '../Modal';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  fallback?: string;
  preview?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const Image: React.FC<ImageProps> = ({
  width,
  height,
  src,
  alt,
  fallback,
  wrapperClassName,
  wrapperStyle,
  className,
  preview = true,
  onError,
  ...props
}) => {
  const [innerSrc, setInnerSrc] = useState(src);
  const [previewVisible, setPreviewVisible] = useState(false);
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    fallback && setInnerSrc(fallback);
    onError?.(e);
  };
  const handlePreview = () => {
    setPreviewVisible(true);
  };
  return (
    <div
      className={clsx('sirius-image relative inline-block', wrapperClassName)}
      style={{
        width,
        height,
        ...wrapperStyle,
      }}
    >
      <img
        src={innerSrc}
        alt={alt}
        onError={handleError}
        className={clsx(
          'w-full max-w-full h-auto block vertical-middle border-none',
          className,
        )}
        {...props}
      />
      {preview && (
        <div
          onClick={handlePreview}
          className="image-mask absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-[#fff] bg-[rgba(0,0,0,0.5)] cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <div className="image-mask-info">
            <Eye size={12} />
          </div>
        </div>
      )}
      {previewVisible && (
        <Modal
          visible={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          backdropClassName="!bg-opacity-45"
          containerClassName="!bg-transparent shadow-none"
          contentClassName="!p-0"
          closable={false}
          footer={null}
        >
          {/* TODO: support preview operation ? */}
          <img
            className="max-w-full max-h-full vertical-middle"
            src={innerSrc}
            alt={alt}
          />
        </Modal>
      )}
    </div>
  );
};
