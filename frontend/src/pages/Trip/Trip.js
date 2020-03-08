import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TimePicker from "react-time-picker";

import TripNavigation from "../../components/TripNavigation.js";
import TourStatus from "../TourStatus/TourStatus";
import { API_Route } from "../../Routes";
import "./Trip.css";

const TourMapImage = "/TourMap.png";
const DepartureTimeOffset = 2; // Time which is added to current time by default
export const TripStatus = ["At port", "Traveling to next port", "Not on tour"];


/**
  *   Render Trip page which is used by tour guides
  */
export default function Trip() {

  // GET Ports and Routes from API
  const [ports, setPorts] = useState([])
  const [routes, setRoutes] = useState([])
  const [departurePort, setDeparturePort] = useState("Hamina");
  const [destinationPort, setDestinationPort] = useState("Helsinki");
  const [currentPort, setCurrentPort] = useState("");

  // Fetch all Ports from API
  async function fetchPorts() {
    const res = await fetch(API_Route + "/ports");
    const content = await res.json();
    setPorts(JSON.parse(content).port);
  }

  useEffect(() => {
    fetchPorts();
  }, []);

  // Fetch all Routes for the selected ports from API
  async function fetchRoutes() {
    const res = await fetch(API_Route + `/route?origin=${departurePort}&destination=${destinationPort}`);
    const content = await res.json();
    setRoutes(JSON.parse(content).routes);
  }

  useEffect(() => {
    fetchRoutes();
    //console.log(routes);
    //if (routes[0] !== undefined) console.log(routes[0].route)
  }, [ports, departurePort, destinationPort]);


  const [status, setStatus] = useState("Not on tour"); // TODO from API
  const [departureTime, setDepartureTime] = useState(getDepartureTime());

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
      setDeparturePort(event.target.value);
    }
  }

  function DestinationPortSelect(event) {
    if (ports.includes(event.target.value)) {
      setDestinationPort(event.target.value);
    }
  }

  function currentPortSelect(event) {
    // TODO Connect to API
    if (ports.includes(event.target.value)) {
      setCurrentPort(event.target.value);
    }
  }

  // Create new trip on the backend
  async function confirmUpdate(event) {
    fetch(API_Route + `/trip/new?route='${routes[0].route}'`,
      {
        method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => {
        if(response.status === 200) setStatus("At port");
        else window.alert("Error: Starting a tour failed");
      });
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
                  if (value !== departurePort) return <option key={index}>{value}</option>
                  return <option key={index} disabled>{value}</option>;
                })}
              </Form.Control>
            </Form.Group>
          </Form>

        {/* TODO Route selection here */}
        { routes !== [] && routes[0] !== undefined &&
          <p>{routes[0].route}</p>
        }
        <Button onClick={confirmUpdate}>Confirm</Button>
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
          <Button onClick={confirmDepartureTime}>Set</Button>
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
