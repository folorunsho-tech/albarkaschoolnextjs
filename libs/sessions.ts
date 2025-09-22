const generateSessions = (start: number, end: number) => {
	const sessions: string[] = [];
	for (let sess = start; sess <= end; sess++) {
		sessions.push(`${sess}/${sess + 1}`);
	}
	return sessions;
};
const currYr = new Date().getFullYear();
const currMonth = new Date().getMonth();
export const sessions = generateSessions(2010, currYr);

const getCurrSession = () => {
	const filteredSession = sessions.filter((sess) =>
		sess.includes(String(currYr))
	);
	if (currMonth > 7) {
		return filteredSession[0];
	} else if (currMonth >= 0 && currMonth <= 7) {
		return filteredSession[0];
	} else {
		return filteredSession[1];
	}
};
const getCurrTerm = () => {
	const terms = ["1st term", "2nd term", "3rd term"];
	if (currMonth >= 0 && currMonth <= 3) {
		return terms[1];
	} else if (currMonth > 3 && currMonth <= 7) {
		return terms[2];
	} else if (currMonth > 7 && currMonth <= 11) {
		return terms[0];
	}
};
export const currSession = getCurrSession();
export const currTerm = getCurrTerm();
