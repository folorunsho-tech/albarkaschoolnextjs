"use client";
import React from "react";
import { userContext } from "@/context/User";
const Dashboard = () => {
	const { user } = React.useContext(userContext);

	return (
		<section className='bg-white p-3 rounded-md flex flex-col items-center h-full pt-16 gap-6'>
			<h2 className='text-5xl text-center'>
				Welcome back {user?.username} !!!
			</h2>

			<p>
				Operation Date:{" "}
				<i className='font-semibold'>{new Date().toLocaleDateString()}</i>
			</p>
		</section>
	);
};

export default Dashboard;
