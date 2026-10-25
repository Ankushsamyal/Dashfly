import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const subscribe = async () => {
      const isPedometerAvailable = await Pedometer.isAvailableAsync();
      setIsAvailable(isPedometerAvailable);

      if (isPedometerAvailable) {
        subscription = Pedometer.watchStepCount((result) => {
          setSteps(result.steps);
        });
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { steps, cadence, isAvailable };
};
