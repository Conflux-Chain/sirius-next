import { NetworksType } from 'src/store/types';
import { getNetworkIcon } from 'src/utils';

export const NetworkIcon: React.FC<{ network: NetworksType }> = ({
  network,
}) => {
  const src = getNetworkIcon(network);
  return src ? <img src={src} alt={network.name} /> : null;
};
