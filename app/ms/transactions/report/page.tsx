"use client";
import Debtors from "@/components/reports/tnx/Debtors";
import Payments from "@/components/reports/tnx/Payments";
import { Tabs, Text } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const page = () => {
	return (
		<main className='space-y-4 bg-white p-3'>
			<header className='flex justify-between items-center'>
				<Link
					className='bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white flex gap-3'
					href='/ms/transactions'
				>
					<ArrowLeft />
					Go back
				</Link>
				<Text size='xl'>Payments Reports</Text>
			</header>
			<Tabs defaultValue='payments' keepMounted={false} color='teal'>
				<Tabs.List grow justify='space-between'>
					<Tabs.Tab value='payments'>Payments</Tabs.Tab>
					<Tabs.Tab value='debtors'>Debtors</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value='payments' className='py-4'>
					<Payments />
				</Tabs.Panel>
				<Tabs.Panel value='debtors' className='py-4'>
					<Debtors />
				</Tabs.Panel>
			</Tabs>
		</main>
	);
};

export default page;
