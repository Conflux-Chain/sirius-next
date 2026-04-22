import { Trans } from 'react-i18next';
import { Warning } from '../Icons';
import clsx from 'clsx';
import { Link } from '../Link';

export const AbiWarning = ({
  tip,
  className,
}: {
  tip?: string;
  className?: string;
}) => {
  if (!tip) return null;
  return (
    <div
      className={clsx('mt-1.4286rem flex items-center text-#9b9eac', className)}
    >
      <Warning className="w-1rem" />
      <span className="text-1rem ml-0.5714rem">
        <Trans i18nKey={tip}>
          ABI not uploaded. You can help improve the decoding of this
          transaction by
          <Link href="/abi-verification">submitting function signatures</Link>.
        </Trans>
      </span>
    </div>
  );
};
