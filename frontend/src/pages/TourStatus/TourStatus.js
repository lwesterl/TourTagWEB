import React, { useState, useEffect } from "react";
import { shake } from "react-animations";
import styled, { keyframes } from 'styled-components';

import { TripStatus } from "../Trip/Trip.js";

const Image = "./jact192.png";
const AnimationDiv = styled.div`animation: 10s ${keyframes`${shake}`} infinite; float: left; margin-left: 20%`;

export default function TourStatus() {

  let status = "Traveling to port"; // TODO from API
  let port = "Helsinki"; // TODO from API
  let nextPort = "Turku"; // TODO from API
  let departureTime = "14:45"; // TODO from API
  let estimatedArrivalTime = "14:48"; // TODO from API combination of departure time and travel time
  const [notDisplayTime, setNotDisplayTime] = useState(false);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
    if (hours === 0) return `${minutes} min`
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
  else {
    return (
      <div>
        <h2 className="title">On the way to {nextPort} from {port}</h2>
        <h2 className="title">ETA: {notDisplayTime ? "Right now" : remainingTime(estimatedArrivalTime)}</h2>
        {/* In a real end product gps location should be showed on a map here */}
        <AnimationDiv>
          <img  src={process.env.PUBLIC_URL + Image}/>
        </AnimationDiv>
      </div>
    )
  }

}
