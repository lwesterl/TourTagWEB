import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TimePicker from "react-time-picker";

import TripNavigation from "../../components/TripNavigation.js";
import TourStatus from "../TourStatus/TourStatus";
import "./Trip.css";

const TourMapImage = "/TourMap.png";
const DepartureTimeOffset = 2; // Time which is added to current time by default
export const TripStatus = ["At port", "Traveling to next port", "Not on tour"];


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
  console.log(departureTime)

  function getDepartureTime() {
    // TODO connect this to API
    let date = new Date();
    let minutes = date.getMinutes() >= 10 ? `${date.getMinutes()}` : `0${date.getMinutes()}`
    let hours = date.getHours() + DepartureTimeOffset;
    if (hours > 23) hours = hours - 24;
    return `${hours}:${minutes}`;
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
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={TripStatus}/>
        <img src={process.env.PUBLIC_URL + TourMapImage} alt="Tour map" id="port-img"/>
        <span className="port-select">
          <Form>
            <Form.Group style={{paddingBottom: "3%"}}>
              <Form.Label>Departure port:</Form.Label>
              <Form.Control as="select" defaultValue={departurePort} onChange={DeparturePortSelect} style={{marginBottom: "3%"}}>
                {ports.map((value, index) => {
                  return <option key={index}>{value}</option>
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group style={{paddingBottom: "50px"}}>
              <Form.Label>Destination port:</Form.Label>
              <Form.Control as="select" defaultValue={destinationPort} onChange={DestinationPortSelect} style={{marginBottom: "3%"}}>
                {ports.map((value, index) => {
                  return <option key={index}>{value}</option>
                })}
              </Form.Control>
            </Form.Group>
          </Form>

        {/* TODO Route selection here */}
        <Button onClick={confirmUpdate} className="trip-button">Confirm</Button>
      </span>
      </div>
    );
  }
  else if (status === "At port") {
    return (
      <div>
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={TripStatus}/>
        <img src={process.env.PUBLIC_URL + TourMapImage} alt="Tour map" id="port-img"/>
        <span className="port-select">
          <Form>
            <Form.Group style={{paddingBottom: "3%"}}>
              <Form.Label>Current port:</Form.Label>
              <Form.Control as="select" defaultValue={currentPort} onChange={currentPortSelect}  style={{marginBottom: "3%"}}>
                {ports.map((value, index) => {
                  return <option key={index}>{value}</option>
                })}
              </Form.Control>
            </Form.Group>
          </Form>
          <p>Departure time</p>
          <TimePicker className="timer" value={departureTime} onChange={updateDepartureTime}/>
          <Button onClick={confirmDepartureTime} className="trip-button">Set</Button>
        </span>
      </div>
    );
  }
  else {
    return (
      <div>
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={TripStatus}/>
        <TourStatus/>
      </div>
    );
  }

}
