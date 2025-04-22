export const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        times.push(`${h}:${m}`);
      }
    }
    return times;
  };

