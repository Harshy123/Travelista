// @flow

import { PureComponent } from 'react';
import type { Node } from 'react';
import { withRouter } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { mustBe } from '../utils/utils';

type Props = {
  location: Location,
  children?: Node,
  onUpdateLocation: () => void,
};

class ScrollToTop extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.location !== prevProps.location) {
      mustBe(document.getElementById('root')).scrollTop = 0;
      this.props.onUpdateLocation();
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
