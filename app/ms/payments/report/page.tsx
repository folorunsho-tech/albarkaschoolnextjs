"use client";
import Balance from "@/components/paymentsReport/Balance";
import Report from "@/components/paymentsReport/Report";
import { Button, Tabs } from "@mantine/core";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import React from "react";
import { useRouter } from "next/navigation";

const page = () => {
	const router = useRouter();
	return (
		<section className='px-2'>
			<Button
				leftSection={
					<IconArrowNarrowLeft
						size={25}
						onClick={() => {
							router.back();
						}}
					/>
				}
				onClick={() => {
					router.back();
				}}
			>
				Go back
			</Button>

			<Tabs
				defaultValue='report'
				keepMounted={false}
				color='teal'
				className='flex flex-col'
			>
				<Tabs.List>
					<Tabs.Tab value='report'>Report</Tabs.Tab>
					<Tabs.Tab value='deptors'>Deptors</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value='report'>
					<Report />
				</Tabs.Panel>

				<Tabs.Panel value='deptors'>
					<Balance />
				</Tabs.Panel>
			</Tabs>
		</section>
	);
};

export default page;
