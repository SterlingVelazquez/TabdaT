import React from 'react';

export class TabContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      rightClick: this.props.rightClick,
      preferences: this.props.preferences
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      uid: props.uid,
      rightClick: props.rightClick,
      preferences: props.preferences
    }
  }

  render() {
    return (
      <div className="tabContextMenuWrapper" id="tabcontextmenuwrapper">

      </div>
    );
  }
}