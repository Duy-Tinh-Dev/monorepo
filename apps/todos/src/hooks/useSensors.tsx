import {
  PointerSensor,
  useSensor,
  useSensors as useSensorsDnd,
} from '@dnd-kit/core';

export const useSensors = () => {
  const sensors = useSensorsDnd(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return {
    sensors,
  };
};
