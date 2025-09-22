const getGrade = (total: number, curr_class: string) => {
	if (curr_class.includes("SS")) {
		if (total >= 90) {
			return "Excellent-A1";
		} else if (total >= 80 && total <= 89) {
			return "V.Good-B2";
		} else if (total >= 75 && total <= 79) {
			return "Good-B3";
		} else if (total >= 70 && total <= 74) {
			return "Credit-C4";
		} else if (total >= 60 && total <= 69) {
			return "Credit-C5";
		} else if (total >= 50 && total <= 59) {
			return "Credit-C6";
		} else if (total >= 45 && total <= 49) {
			return "Pass-D7";
		} else if (total >= 40 && total <= 44) {
			return "Pass-E8";
		} else {
			return "Fail-F9";
		}
	}
	return "";
};

export default getGrade;
