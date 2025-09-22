export const months = [
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
export const curYear = Number(new Date().getFullYear());
export const curMonth = months[new Date().getMonth()];
export const curMonthNo = new Date().getMonth() + 1;
export const mNo = String(curMonthNo).length > 1 ? curMonthNo : `0${curMonthNo}`;
