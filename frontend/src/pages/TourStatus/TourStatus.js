import React, { useState, useEffect } from "react";
import { shake } from "react-animations";
import styled, { keyframes } from 'styled-components';
import ReactLoading from "react-loading";

import { TripStatus } from "../Trip/Trip";
import { API_Route } from "../../Routes";

const Image = "./yacht192.png";
const AnimationDiv = styled.div`animation: 10s ${keyframes`${shake}`} infinite; float: left; margin-left: 20%`;
const StatusUpdatePeriod = 5000; // 5 s
const TravelTimeBetweenPort = { "hours" : 1, "mins" : 0 }; // API doesn't provide specific travel time


// Compute departure time from time given by API
export function getDepartureTime(api_time) {
  const date = new Date();
  let minutes = api_time.split(":")[1];
  let hours = parseInt(api_time.split(":")[0]) - date.getTimezoneOffset()/60;
  if (hours > 23) hours -= 24;
  return `${hours}:${minutes}`;
}


/**
  *   Display information to tour members
  */
export default function TourStatus() {

  // State values from API
  const [status, setStatus] = useState("");
  const [port, setPort] = useState("");
  const [nextPort, setNextPort] = useState("");
  const [departureTime, setDepartureTime] = useState("00:00");
  // Time values
  const [notDisplayTime, setNotDisplayTime] = useState(false);
  const [time, setTime] = useState(new Date());
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState("00:00"); // Combination of departure time and travel time

  // Fetch tour state from API
  async function fetchTourState() {
    const res = await fetch(API_Route + "/trip/state");
    const content = await res.json();
    const state = JSON.parse(content);
    if (state.status === "FINISHED") {
      setStatus(TripStatus[state.status]);
      setPort(state.destination);
      setNextPort("");
    }
    else {
      setStatus(TripStatus[state.stops[0].Status]);
      if (state.stops[0].Status === "ARRIVED") {
        setPort(state.stops[0].Stop);
        const routes = state.route.split(",");
        setNextPort(routes[routes.indexOf(state.stops[0].Stop) + 1]);
        setDepartureTime(getDepartureTime(state.stops[0].DepartureTime.split(" ")[1]));
      } else {
        setPort(state.stops[1].Stop);
        setNextPort(state.stops[0].Stop);
        setDepartureTime(getDepartureTime(state.stops[1].DepartureTime.split(" ")[1]));
      }
    }
  }

  // Update state when page is loaded
  useEffect(() => {
    fetchTourState();
  }, []);

  // Update state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch status from API
      fetchTourState();
      }, StatusUpdatePeriod);
      return () => clearInterval(interval);
  }, []);


  // Update estimatedArrivalTime
  function updateEstimatedArrivalTime(departureTime) {
    let mins = parseInt(departureTime.split(":")[1]) + TravelTimeBetweenPort.mins;
    let hours = parseInt(departureTime.split(":")[0]) + TravelTimeBetweenPort.hours;
    if (mins > 59) {
      mins -= 60;
      hours ++;
    }
    if (hours > 23) hours -= 24;
    setEstimatedArrivalTime(`${hours}:${mins}`);
  }

  // Update estimatedArrivalTime after departureTime changes
  useEffect(() => {
    updateEstimatedArrivalTime(departureTime);
  }, [departureTime]);

  // Update time to display a ticking clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Calculate how much time is left to value of timestr
  function remainingTime(timestr) {
    const targetTime = timestr.split(":");
    let hours = parseInt(targetTime[0]) - time.getHours();
    if (hours < 0) hours = 24 + hours;
    let minutes = parseInt(targetTime[1]) - time.getMinutes();
    if (minutes < 0) {
      if (hours === 0) hours = 24;
      hours --;
      minutes += 60;
    }
    if ((hours === 0) && (minutes === 0)) setNotDisplayTime(true);
    else if (hours === 0) return `${minutes} min`
    else if (minutes === 0) return `${hours} h`
    return `${hours} h ${minutes} min`;
  }


  if (status === "Not on tour") {
    return (
      <div>
        <h2 className="title">No ongoing tour</h2>
      </div>
    )
  }
  else if (status === "At port") {
    return (
      <div>
        <h2 className="title">Currently at port of {port}</h2>
        <h2 className="title">Departure time: {departureTime}</h2>
        {/* In a real end product map of the city should be showed here */}
      </div>
    );
  }
  else if (status === "Traveling to next port") {
    return (
      <div>
        <h2 className="title">On the way to {nextPort} from {port}</h2>
        <h2 className="title">ETA: {notDisplayTime ? "Right now" : remainingTime(estimatedArrivalTime)}</h2>
        {/* In a real end product gps location should be showed on a map here */}
        <AnimationDiv>
          <img  src={process.env.PUBLIC_URL + Image} alt="Yacht animation"/>
        </AnimationDiv>
      </div>
    )
  }
  else {
    return (
      <div className="centered">
        <p>Loading</p>
        <ReactLoading  type={"bars"} height={"20%"} witdth={"20%"}/>
      </div>
    );
  }

}
