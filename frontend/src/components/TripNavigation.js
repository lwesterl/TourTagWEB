import React from "react";
import { Nav } from "react-bootstrap";

/**
  *   TripNavigation
  *   Show navigation menu for Tour/Trip status
  */
export default class TripNavigation extends React.Component {
  render() {
    return (
      <Nav variant="pills">
        {this.props.TripStatus.map((value, index) => {
          return (<Nav.Item key={index}>
                    <Nav.Link
                    key={index} eventKey={value}
                    onSelect={this.props.onSelect} active={value===this.props.status}
                    disabled={value===this.props.status}>
                    {value}
                    </Nav.Link>
                  </Nav.Item>
                  );
          })}
      </Nav>
    );
  }
}
