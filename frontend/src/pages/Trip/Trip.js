import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TimePicker from "react-time-picker";

import TripNavigation from "../../components/TripNavigation.js";

const TourMapImage = "/TourMap.png";
const DepartureTimeOffset = 2; // Time which is added to current time by default
const TourStatus = ["At port", "Traveling to next port", "Not on tour"];


/**
  *   Render Trip page which is used by tour guides
  */
export default function Trip() {
  let ports = ["Turku", "Helsinki", "Vaasa", "Oulu", "Ahvenanmaa"]; // TODO from API
  let departurePort = "Helsinki"; // TODO from API
  let destinationPort = "Ahvenanmaa"; // TODO from API
  let currentPort = ""; // TODO from API
  const [status, setStatus] = useState("Not on tour"); // TODO from API
  const [departureTime, setDepartureTime] = useState(getDepartureTime());

  function getDepartureTime() {
    // TODO connect this to API
    let date = new Date();
    let minutes = date.getMinutes() >= 10 ? `${date.getMinutes()}` : `0${date.getMinutes()}`
    return `${date.getHours() + DepartureTimeOffset}:${minutes}`;
  }

  function NavigationSelect(eventKey, event) {
    const res = window.confirm(`Do you want to change trip status to '${eventKey}'`);
    if (res === true) {
      setStatus(eventKey);
    }
  }

  function DeparturePortSelect(event) {
    if (ports.includes(event.target.value)) {
      departurePort = event.target.value;
    }
  }

  function DestinationPortSelect(event) {
    if (ports.includes(event.target.value)) {
      destinationPort = event.target.value;
    }
  }

  function currentPortSelect(event) {
    // TODO Connect to API
    if (ports.includes(event.target.value)) {
      currentPort = event.target.value;
    }
  }

  function confirmUpdate(event) {
    // TODO connect to API
    console.log(departurePort);
    console.log(destinationPort);
  }

  function updateDepartureTime(value) {
    if (value !== null) {
      setDepartureTime(value);
    } else {
      setDepartureTime(getDepartureTime());
    }
  }

  function confirmDepartureTime(event) {
    // TODO connect to API
    console.log(departureTime);
  }

  if (status === "Not on tour") {
    return (
      <div>
        <h2>Current status</h2>
        <TripNavigation status={status} onSelect={NavigationSelect} TourStatus={TourStatus}/>
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

        <img src={process.env.PUBLIC_URL + TourMapImage} alt="Tour map"/>
        {/* TODO Route selection here */}

        <Button onClick={confirmUpdate}>Confirm</Button>
      </div>
    );
  }
  else if (status === "At port") {
    return (
      <div>
        <h2>Current status</h2>
        <TripNavigation status={status} onSelect={NavigationSelect} TourStatus={TourStatus}/>
        <Form>
          <Form.Group>
            <Form.Label>Current port</Form.Label>
            <Form.Control as="select" defaultValue={currentPort} onChange={currentPortSelect}>
              {ports.map((value, index) => {
                return <option key={index}>{value}</option>
              })}
            </Form.Control>
          </Form.Group>
        </Form>
        <h2>Departure time</h2>
        <div>
          <TimePicker value={departureTime} onChange={updateDepartureTime}/>
        </div>
        <Button onClick={confirmDepartureTime}>Set</Button>
      </div>
    );
  }
  else {
    return (
      <div>
        <h2>Current status</h2>
        <TripNavigation status={status} onSelect={NavigationSelect} TourStatus={TourStatus}/>
      </div>
    );
  }

}
