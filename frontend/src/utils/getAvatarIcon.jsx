import { Avatars } from "./constants";

export const getAvatarIcon = (age, gender) => {
    let group = "";

    if (age <= 2) group = "0to2";
    else if (age <= 7) group = "3to7";
    else if (age <= 12) group = "8to12";
    else if (age <= 18) group = "13to18";
    else if (age <= 25) group = "19to25";
    else if (age <= 35) group = "26to35";
    else if (age <= 45) group = "36to45";
    else if (age <= 55) group = "46to55";
    else group = "56";

    // Normalize gender input
    const normalizedGender =
        gender === "M" || gender === "Male"
            ? "Male"
            : gender === "F" || gender === "Female"
            ? "Female"
            : "";

    const key = `${normalizedGender}${group}SVG`; // e.g. Male26to35SVG
    return Avatars[key] || null;
};