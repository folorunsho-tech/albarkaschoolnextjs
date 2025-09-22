"use client";
import {
	TextInput,
	PasswordInput,
	Paper,
	Title,
	Container,
	Button,
	LoadingOverlay,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { usePostNormal } from "@/hooks/useQueries";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconX, IconServerOff } from "@tabler/icons-react";
import { userContext } from "@/context/User";
import React from "react";
export default function Login() {
	const { setUser, setPerm } = React.useContext(userContext);
	const router = useRouter();
	const { handleSubmit, register } = useForm();
	const { post, loading } = usePostNormal();
	const onSubmit = async (values: any) => {
		const res = await post("/auth/login", {
			...values,
		});
		setUser(res.data);
		setPerm(res.data?.menu);
		if (res?.status == 200) {
			notifications.show({
				id: "AuthLogin",
				withCloseButton: false,
				// position: "top-left",
				onClose: () => {
					router.push(`/ms`);
				},
				autoClose: 500,
				withBorder: true,
				className: "w-max absolute top-0",
				title: "Login successful !!!",
				message: "Redirecting you to the homepage...",
				color: "teal",
				loading: true,
			});
		} else if (res?.status === 404) {
			notifications.show({
				id: "AuthInvalid",
				withCloseButton: true,
				// position: "top-left",
				autoClose: 800,
				withBorder: true,
				className: "w-max absolute top-0",
				title: "Login error !!!",
				message:
					"Invalid credentials or account does not exist. Kindly contact the Principal / HM for correction",
				color: "red",
				icon: <IconX />,
			});
		} else if (res?.status === 401) {
			notifications.show({
				id: "Authunauthorized",
				withCloseButton: true,
				// position: "top-left",
				autoClose: 800,
				withBorder: true,
				className: "w-max absolute top-0",
				title: "Unauthorized!!!",
				message:
					"User not currently allowed to login. Kindly contact the Principal / HM for correction",
				color: "red",
				icon: <IconX />,
			});
		} else {
			notifications.show({
				id: "AuthServerError",
				withCloseButton: true,
				// position: "top-left",
				autoClose: 800,
				withBorder: true,
				className: "w-max absolute top-0",
				title: "Server error !!!",
				message:
					"Internal server error. Kindly contact the Principal / HM for correction",
				color: "red",
				icon: <IconServerOff />,
			});
		}
	};
	return (
		<Container className='my-auto  p-4' size={420} my={100}>
			<Title ta='center'>Welcome back!</Title>
			<Paper
				withBorder
				shadow='md'
				p={30}
				mt={30}
				radius='md'
				className='relative'
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						label='Username'
						placeholder='username...'
						{...register("username")}
					/>
					<PasswordInput
						label='Password'
						placeholder='Your password'
						mt='md'
						{...register("password")}
					/>

					<Button type='submit' fullWidth mt='xl'>
						Sign in
					</Button>
				</form>
			</Paper>
			<LoadingOverlay visible={loading} />
		</Container>
	);
}
