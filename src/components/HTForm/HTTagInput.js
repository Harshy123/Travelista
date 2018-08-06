// @flow

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import cn from 'classnames';

import styles from './HTTagInput.scss';

import type { ElementRef } from 'react';

export type Tag = { id: string, text: string };

type Props = {
  placeHolder: string,
  tags: Tag[],
  onDelete: (index: number) => void,
  onAddition: (tag: Tag) => void,
  onInputChange?: string => void,
  error: ?string,
};

export default class HTTagInput extends PureComponent<Props> {
  // eslint-disable-next-line flowtype/no-weak-types
  reactTags: ElementRef<any>;

  static defaultProps = {
    placeholder: '',
  };

  // eslint-disable-next-line flowtype/no-weak-types
  setReactTags = (e: ElementRef<any>) => {
    this.reactTags = e;
  };

  scroll = (e: WheelEvent) => {
    if (e.deltaX) {
      return;
    }
    e.preventDefault();

    const tags = ReactDOM.findDOMNode(this.reactTags);
    if (tags instanceof Element) {
      tags.scrollLeft += e.deltaY * 0.1;
    }
  };

  render() {
    const {
      placeHolder,
      tags,
      onDelete,
      onAddition,
      onInputChange,
      error,
    } = this.props;

    return (
      <div
        onWheel={this.scroll}
        className={cn(
          (styles.tagInput,
          {
            [styles.withPaddingBottom]: !error,
          })
        )}
      >
        <ReactTags
          inline={true}
          placeholder={placeHolder}
          tags={tags}
          handleDelete={onDelete}
          handleAddition={onAddition}
          classNames={styles}
          handleInputChange={onInputChange}
          ref={this.setReactTags}
        />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }
}
