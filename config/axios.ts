import axios from "axios";

const api = axios.create({
	baseURL: "/api",
	responseType: "json",
	timeout: 5000,
	withCredentials: true,
	validateStatus: function (status: number) {
		return status < 500; // Resolve only if the status code is less than 500
	},
	//
});
export default api;
