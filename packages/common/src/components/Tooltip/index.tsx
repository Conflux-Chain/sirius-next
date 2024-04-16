import React from 'react';
import Tooltip from '@cfx-kit/ui-components/dist/Tooltip';

export const InfoIconWithTooltip = ({
  info,
  size = 14,
  children = null,
}: {
  info: React.ReactNode;
  size?: number;
  children?: React.ReactNode;
}) => {
  const title =
    typeof info === 'string' ? info.split('\n').map(i => <div>{i}</div>) : info;
  return (
    <div>
      {children ? <span className="infoIcon-text">{children}</span> : null}
      <Tooltip
        trigger={({ triggerProps }) => <div {...triggerProps}>1111</div>}
      >
        {title}
      </Tooltip>
    </div>
  );
};

// const StyledContentWrapper = styled.span`
//   display: inline-flex;
//   align-items: center;

//   .infoIcon-text {
//     margin-right: 0.2857rem;
//   }
// `;
