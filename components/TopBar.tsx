import React from "react";
import { Group, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { Avatar } from "@mantine/core";
import { userContext } from "@/context/User";
import axios from "@/config/axios";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TopBar = () => {
	const { user } = React.useContext(userContext);
	const router = useRouter();

	return (
		<header className='p-3 py-2 border-b border-gray-300 bg-blue-500 flex justify-between items-center'>
			<h2 className='font-semibold pb-2 text-white'>Albarka School Wawa</h2>
			<Group className='' justify='space-between'>
				{user?.role == "admin" && (
					<Group justify='space-between' className='text-white'>
						<Link
							className='hover:text-teal-300 transition duration-200'
							href={`/ms/settings`}
						>
							<IconSettings stroke={2} />
						</Link>
					</Group>
				)}
				<Group className='bg-indigo-100 p-1 px-4 rounded-md'>
					<Avatar
						radius='xl'
						src={user?.passport}
						name={user?.username}
						color='initials'
						variant='filled'
					/>

					<Text size='sm' fw={500}>
						{user?.username}
					</Text>
				</Group>

				<button
					className='hidden md:flex cursor-pointer gap-3 items-center transition duration-300 ease-in-out text-sm bg-red-500 text-white p-2 py-1 rounded-sm font-medium hover:bg-red-200 hover:text-red-700'
					onClick={async () => {
						await axios.post("/auth/logout");
						router.push("/login");
					}}
				>
					<IconLogout className='' stroke={1.5} />
					<span>Logout</span>
				</button>
			</Group>
		</header>
	);
};

export default TopBar;
