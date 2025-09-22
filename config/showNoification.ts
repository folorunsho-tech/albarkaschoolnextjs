import { notifications } from "@mantine/notifications";

const showNotification = (status: number) => {
	// Mapping of status code ranges to notification colors & titles
	const statusCategory = {
		success: { title: "Success !!!", color: "green" },
		clientError: { title: "Error !!!", color: "orange" },
		authError: { title: "Error !!!", color: "red" },
		notFound: { title: "Error !!!", color: "red" },
		serverError: { title: "Server Error !!!", color: "red" },
		default: { title: "Info", color: "blue" },
	};

	// User-friendly HTTP status descriptions
	const statusDescriptions: Record<number, string> = {
		100: "Please wait… continuing request",
		101: "Switching connection protocols",
		102: "Request is still being processed",
		200: "Request completed successfully",
		201: "Your request has been created successfully",
		202: "Your request has been accepted and is being processed",
		204: "Request completed but there’s no content to show",
		301: "The resource has moved permanently",
		302: "The resource was found at a different location",
		304: "Nothing has changed since your last request",
		307: "Temporary redirect – try again at the new location",
		308: "Permanent redirect – use the new location",
		400: "There was a problem with your request",
		401: "You need to log in to continue",
		403: "You don’t have permission to access this",
		404: "We couldn’t find what you’re looking for",
		409: "This request conflicts with the current state of the resource",
		422: "Some fields have errors – please check and try again",
		500: "Something went wrong on our server",
		502: "Server received an invalid response from upstream",
		503: "Service is temporarily unavailable – please try again later",
		504: "The server took too long to respond",
	};

	// Pick color & title based on status range
	let info: { title: string; color: string };
	if (status >= 200 && status < 300) info = statusCategory.success;
	else if (status === 401) info = statusCategory.authError;
	else if (status === 404) info = statusCategory.notFound;
	else if (status >= 400 && status < 500) info = statusCategory.clientError;
	else if (status >= 500) info = statusCategory.serverError;
	else info = statusCategory.default;

	const description =
		statusDescriptions[status] || "Unexpected server response.";

	notifications.show({
		title: info.title,
		message: `${description} (HTTP ${status})`,
		color: info.color,
	});
};
export default showNotification;
