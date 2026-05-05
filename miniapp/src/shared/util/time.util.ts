
export const getTime = (distance: number): string => {
  const walkingSpeed = 5;
  const timeInHours = distance / walkingSpeed;

  if (timeInHours < 1) {
    const minutes = Math.round(timeInHours * 60);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    if (minutes === 0) {
      return `${hours} h`;
    } else {
      return `${hours} h ${minutes} min`;
    }
  }
};
