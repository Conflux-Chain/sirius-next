import {
  render as reactRender,
  unmount as reactUnmount,
} from '../../utils/render';
import { Modal } from './Modal';
import type { ModalProps } from './Modal';

type ConfigUpdate = ModalProps | ((prevConfig: ModalProps) => ModalProps);

export function confirm(config: ModalProps) {
  const container = document.createDocumentFragment();
  let currentConfig = {
    maskClosable: false,
    closeOnEsc: false,
    ...config,
    visible: true,
  } as ModalProps;

  function destroy() {
    config.onCancel?.();

    reactUnmount(container);
  }

  function onConfirm() {
    config.onOk?.();

    reactUnmount(container);
  }

  function render({ ...props }: any) {
    setTimeout(() => {
      reactRender(
        <Modal {...props} onCancel={destroy} onOk={onConfirm} />,
        container,
      );
    });
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  return {
    destroy,
    update,
  };
}
