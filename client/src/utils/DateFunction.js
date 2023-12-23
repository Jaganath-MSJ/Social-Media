import { formatDistanceToNow, parseISO } from "date-fns";

export function formatDateAndTime(dateString) {
  return formatDate(dateString) + " " + formatTime(dateString);
}

export function formatDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateParts = dateString.split("-");
  const day = parseInt(dateParts[2], 10);
  const monthIndex = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[0], 10);

  const monthName = months[monthIndex];

  let formattedDay;
  if (day >= 11 && day <= 13) {
    formattedDay = day + "th";
  } else if (day % 10 === 1) {
    formattedDay = day + "st";
  } else if (day % 10 === 2) {
    formattedDay = day + "nd";
  } else if (day % 10 === 3) {
    formattedDay = day + "rd";
  } else {
    formattedDay = day + "th";
  }

  return formattedDay + " " + monthName + " '" + (year % 100);
}

function formatTime(dateString) {
  const [hours, minutes] = dateString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function calculateTimeAgo(dateString) {
  const parseDate = parseISO(dateString);
  const formatedDate = formatDistanceToNow(parseDate);
  return formatedDate;
}
