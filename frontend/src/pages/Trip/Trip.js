import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import TimePicker from "react-time-picker";

import TripNavigation from "../../components/TripNavigation";
import TourStatus, { getDepartureTime } from "../TourStatus/TourStatus";
import { API_Route } from "../../Routes";
import "./Trip.css";
const encodeUrl = require("encodeurl");

const TourMapImage = "/TourMap.png";
// Mapping between database states and client status strings
export const TripStatus = {
                              "FINISHED" : "Not on tour",
                              "ARRIVED" : "At port",
                              "ON-THE-WAY" : "Traveling to next port"
                          };

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


  // Status of the tour from API
  const [status, setStatus] = useState("");

  // Fetch tour status from API
  async function fetchStatus(updateFunc) {
    const res = await fetch(API_Route + "/trip/state");
    const content = await res.json();
    const state = JSON.parse(content);
    if (state.status === "FINISHED") setStatus(TripStatus[state.status]);
    else {
      setStatus(TripStatus[state.stops[0].Status]);
      setCurrentPort(state.remainingroute.split(",")[0]);
    }
  }

  // Use effect to fetch status when page is loaded
  useEffect(() => {
    fetchStatus();
  }, []);


  // Departure time for the tour from API
  const [departureTime, setDepartureTime] = useState("00:00");

  // Fetch departureTime from API
  async function fetchDepartureTime() {
    const res = await fetch(API_Route + "/trip/state");
    const content = await res.json();
    const state = JSON.parse(content);
    if (state.stops[0].DepartureTime === null) setDepartureTime("00:00");
    else {
      const api_time = state.stops[0].DepartureTime.split(" ")[1]; // format: 23.01.2020 12:23:42
      setDepartureTime(getDepartureTime(api_time));
    }
  }

  // Use effect to fetch departureTime when status changes
  useEffect(() => {
    fetchDepartureTime();
  }, [status]);


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
        const url = encodeUrl(API_Route + `/trip/new?route=${selectedRoute}`);
        fetch(url,
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
      // reset the time using API departureTime
      fetchDepartureTime();
    }
  }

  // Update departureTime to API
  // TODO this won't work for setting time for the following days
  function confirmDepartureTime(event) {
    // Transfer to relational time values in relation to current time
    const date = new Date();
    const times = departureTime.split(":");
    let hours = parseInt(times[0]) - date.getHours();
    let mins = parseInt(times[1]) - date.getMinutes();
    let valid = true;
    if (hours < 0) valid = false;
    if (mins < 0) {
      if (hours <= 0) {
        valid = false;
      }
      hours --;
      mins += 60;
    }
    const hours_val = hours > 9 ? hours: `0${hours}`;
    const mins_val = mins > 9 ? mins: `0${mins}`;
    if (valid) {
      fetch(API_Route + `/trip/departure_in?time=${hours_val}:${mins_val}:00`)
      .then(response => {
        if (response.status === 200) window.alert("Departure time updated");
        else window.alert("Error: Setting departure time failed");
      })
    } else {
      window.alert("Cannot set a past departure time");
    }
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
      if (response.status === 200) fetchStatus();
      else window.alert("Error: Arrival failed");
    });
  }

  if (status === "Not on tour") {
    return (
      <div>
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={Object.values(TripStatus)}/>
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
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={Object.values(TripStatus)}/>
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
  else if (status === "Traveling to next port") {
    return (
      <div>
        <h2 className="title">Trip</h2>
        <TripNavigation className="navigation" status={status} onSelect={NavigationSelect} TripStatus={Object.values(TripStatus)}/>
        <TourStatus/>
        <Button id="arrived-btn" onClick={arrived}>Arrived</Button>
      </div>
    );
  }
  return null;

}
