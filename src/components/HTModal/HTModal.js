// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import cn from 'classnames';
import Modal from 'react-modal';
import styles from './HTModal.scss';
import { mustBe } from '../../utils/utils';
type Props = {
  isOpen: boolean,
  className?: string,
  children: ?Node,
  onRequestClose: () => void,
};

class HTModal extends PureComponent<Props> {
  rootElement: HTMLElement;
  scrollTop: number;
  constructor(props: Props) {
    super(props);
    this.rootElement = mustBe(document.getElementById('root'));
    this.scrollTop = 0;
  }

  render() {
    const { isOpen, className, children, onRequestClose } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        className={cn(styles.modal, className)}
        overlayClassName={styles.overlay}
        onRequestClose={onRequestClose}
        ariaHideApp={false}
      >
        {children}
      </Modal>
    );
  }
}

export default HTModal;
