import React from "react";
import { Form, Button } from "react-bootstrap";

export default function Trip() {
  let ports = ["Turku", "Helsinki", "Vaasa", "Oulu", "Ahvenanmaa"]; // TODO from API
  let departurePort = "Helsinki"; // TODO from API
  let destinationPort = "Ahvenanmaa"; // TODO from API

  function DeparturePortSelect(event) {
    departurePort = event.target.value;
  }
  function DestinationPortSelect(event) {
    destinationPort = event.target.value;
  }

  function confirmUpdate(event) {
    // TODO connect to API
    console.log(departurePort);
    console.log(destinationPort);
  }

  return (
    <div>
      <h2>Trip</h2>
      <Form>
        <Form.Group>
          <Form.Label>Departure port</Form.Label>
          <Form.Control as="select" defaultValue={departurePort} onChange={DeparturePortSelect}>
            {ports.map((value, index) => {
              return <option key={index}>{value}</option>
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Destination port</Form.Label>
          <Form.Control as="select" defaultValue={destinationPort} onChange={DestinationPortSelect}>
            {ports.map((value, index) => {
              return <option key={index}>{value}</option>
            })}
          </Form.Control>
        </Form.Group>
      </Form>
      <Button onClick={confirmUpdate}>Confirm</Button>
    </div>
  );
}
