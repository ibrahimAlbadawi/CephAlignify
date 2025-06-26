export const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const formatted = `${String(hour).padStart(2, "0")}:${String(
                min
            ).padStart(2, "0")}`;
            times.push(formatted); // e.g., "09:00", "13:30"
        }
    }
    return times;
};
