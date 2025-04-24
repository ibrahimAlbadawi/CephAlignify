export const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const period = hour < 12 ? 'AM' : 'PM';
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const m = min.toString().padStart(2, '0');
      times.push(`${hour12}:${m} ${period}`);
    }
  }
  return times;
};