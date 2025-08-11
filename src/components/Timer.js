import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import tick from "../sounds/tick.mp3";

const Timer = ({ setTimeOut, questionNumber, shouldStart, stopSignal }) => {
  const [timer, setTimer] = useState(30);
  const [playTick, { stop: stopTick }] = useSound(tick, { volume: 0.3, interrupt: true });

  useEffect(() => {
    if (timer === 0) return setTimeOut(true);
    if (!shouldStart) return; // Don't start timer until shouldStart is true
    
    console.log('Timer started! shouldStart is true');
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, setTimeOut, shouldStart]);

  useEffect(() => {
    setTimer(30);
  }, [questionNumber]);

  useEffect(() => {
    if (timer > 0 && timer < 31 && shouldStart) {
      playTick();
    }
    // Only play tick when timer is running and shouldStart is true
  }, [timer, playTick, shouldStart]);

  // Stop any ticking sound on external stop signal (Quit/Exit)
  useEffect(() => {
    if (stopTick) {
      stopTick();
    }
  }, [stopSignal, stopTick]);

  return timer;
};

export default Timer;
