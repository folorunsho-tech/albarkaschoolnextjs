import React from "react";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Notification, rem } from "@mantine/core";
const NotificationComp = ({
	status,
	successMessage,
}: {
	status: string;
	successMessage: string;
}) => {
	const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
	const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
	return (
		<>
			{status === "failed" && (
				<Notification
					icon={xIcon}
					color='red'
					title='Bummer!'
					withBorder
					closeButtonProps={{ "aria-label": "Hide notification" }}
				>
					Something went wrong
				</Notification>
			)}
			{status === "succeeded" && (
				<Notification
					icon={checkIcon}
					color='teal'
					title='All good!'
					withBorder
					closeButtonProps={{ "aria-label": "Hide notification" }}
				>
					{successMessage}
				</Notification>
			)}
		</>
	);
};

export default NotificationComp;
