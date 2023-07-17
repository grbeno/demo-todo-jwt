import jwt_decode from "jwt-decode";

// expiration time of token
export const expirationTime = (token) => {
    const expirationTime = localStorage.getItem(token) ? jwt_decode(localStorage.getItem(token)).exp : currentTime;
    return convertTimestampToTime(expirationTime);
}

// convert timestamp to time
const convertTimestampToTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timeString = `${year}-${month}-${day} ${date.toTimeString().split(' ')[0]}`; // Combine date and time strings
    return timeString;
}

// current time
const currentTime = Date.now() / 1000;