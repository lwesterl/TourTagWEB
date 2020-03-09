import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TimePicker from "react-time-picker";

import TripNavigation from "../../components/TripNavigation.js";
import TourStatus from "../TourStatus/TourStatus";
import { API_Route } from "../../Routes";
import "./Trip.css";
const encodeUrl = require("encodeurl");

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
  const [selectedRoute, setSelectedRoute] = useState("");

  // Fetch all Ports from API
  async function fetchPorts() {
    const res = await fetch(API_Route + "/ports");
    const content = await res.json();
    setPorts(JSON.parse(content).port);
  }

  // Use effect to fetch ports when the page is loaded
  useEffect(() => {
    fetchPorts();
  }, []);

  // Fetch all Routes for the selected ports from API
  async function fetchRoutes(departurePort, destinationPort) {
    const res = await fetch(encodeUrl(API_Route + `/route?origin=${departurePort}&destination=${destinationPort}`));
    const content = await res.json();
    setRoutes(JSON.parse(content).routes);
  }

  // Use effect to refetch routes when any of the ports state variables is changed
  useEffect(() => {
    fetchRoutes(departurePort, destinationPort);
  }, [departurePort, destinationPort]);

  // Use effect to select the first route by default when routes are updated
  useEffect(() => {
    if ((routes !== []) && (routes[0] !== undefined)) setSelectedRoute(routes[0].route);
  }, [routes]);


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

  // Change status using navigation, this is only for testing
  function NavigationSelect(eventKey, event) {
    /*
    const res = window.confirm(`Do you want to change trip status to '${eventKey}'`);
    if (res === true) {
      setStatus(eventKey);
    }
    */
  }

  // Set departurePort from select
  function DeparturePortSelect(event) {
    if (ports.includes(event.target.value)) {
      setDeparturePort(event.target.value);
    }
  }

  // Set destinationPort from select
  function DestinationPortSelect(event) {
    if (ports.includes(event.target.value)) {
      setDestinationPort(event.target.value);
    }
  }

  // Set route from select
  function RouteSelect(event) {
    setSelectedRoute(event.target.value);
  }

  // Get estimated travel time for a route
  function getRouteTraveltime() {
    if ((routes !== [])) {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].route === selectedRoute) {
          return `Estimated travel time: ${routes[i].traveltime}`;
        }
      }
    }
    return "";
  }

  // Create new trip on the backend
  async function confirmUpdate(event) {
    if ((routes !== []) && (routes[0] !== undefined) && (() =>
      {
        // Check that the route is valid
        for (let i = 0; i < routes.length; i++) {
          if (routes[i].route === selectedRoute) return true;
        }
        return false;
      })) {
      fetch(API_Route + `/trip/new?route='${routes[0].route}'`,
      {
        method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => {
        if(response.status === 200) {
          setStatus("At port");
          setCurrentPort(selectedRoute.split(",")[0]);
        }
        else window.alert("Error: Starting a tour failed");
      });
    } else {
      window.alert("An invalid route selected");
    }
  }

  // Set departureTime using TimePicker
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

  // Departed from the current port: update backend
  function departed() {
    fetch(API_Route + "/trip/depart")
    .then(response => {
      if (response.status === 200) setStatus("Traveling to next port");
      else window.alert("Error: Departure failed");
    });
  }

  // Arrived to a port: update backend
  function arrived() {
    fetch(API_Route + "/trip/arrive")
    .then(response => {
      if (response.status === 200) setStatus("At port");
      else window.alert("Error: Arrival failed");
    });
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

        { routes !== [] &&
          <Form.Group style={{paddingBottom: "3%"}}>
            <Form.Label>Tour route:</Form.Label>
            <Form.Control as="select" onChange={RouteSelect} style={{marginBottom: "3%"}}>
              {routes.map((value, index) => {
                return <option key={index}>{value.route}</option>;
              })}
            </Form.Control>
          </Form.Group>
        }
        { routes !== [] &&
          <p className="padded-bottom">{getRouteTraveltime()}</p>
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
        <div className="port-select">
          <Form>
            <Form.Group style={{paddingBottom: "3%"}}>
              <Form.Label>Current port: <strong>{currentPort}</strong></Form.Label>
              {/*}<Form.Control as="select" defaultValue={currentPort} onChange={currentPortSelect}  style={{marginBottom: "3%"}}>
                {ports.map((value, index) => {
                  return <option key={index}>{value}</option>
                })}
              </Form.Control>
              */}
            </Form.Group>
          </Form>
          <p>Departure time</p>
          <TimePicker className="timer" value={departureTime} onChange={updateDepartureTime}/>
          <Button onClick={confirmDepartureTime}>Set</Button>
          <span className="after-select">
            <Button onClick={departed}>Departed</Button>
          </span>
        </div>

      </div>
    );
  }
  else {
    return (
      <div>
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={TripStatus}/>
        <TourStatus/>
        <Button id="arrived-btn" onClick={arrived}>Arrived</Button>
      </div>
    );
  }

}
