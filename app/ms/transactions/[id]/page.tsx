"use client";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useQueries";
import { ArrowLeft, Info, Receipt } from "lucide-react";
import Link from "next/link";
import { Button, Tabs, Text } from "@mantine/core";

import { useParams } from "next/navigation";
import { IconReportMoney } from "@tabler/icons-react";
import InfoC from "@/components/transactions/Info";
import Payments from "@/components/transactions/Payments";
import Receipts from "@/components/transactions/Receipts";
const page = () => {
	const { id } = useParams<{ id: string }>();
	const { fetch } = useFetch();
	const [tnx, setTnx] = useState<any | null>(null);
	const [status, setStatus] = useState<{
		color: string;
		label: string;
	} | null>(null);
	const getStatus = (status: string | any) => {
		if (status == "Fully Paid") {
			setStatus({
				color: "teal",
				label: "Fully Paid",
			});
		} else if (status == "Partly Paid") {
			setStatus({
				color: "orange",
				label: "Partly Paid",
			});
		} else if (status == "Partly Reversed") {
			setStatus({
				color: "pink",
				label: "Partly Reversed",
			});
		} else if (status == "Fully Reversed") {
			setStatus({
				color: "red",
				label: "Fully Reversed",
			});
		}
	};
	useEffect(() => {
		if (tnx) {
			getStatus(tnx?.status);
		}
	}, [tnx]);
	useEffect(() => {
		if (id) {
			const getData = async () => {
				const { data } = await fetch(`/transactions/${id}`);
				setTnx(data);
			};
			getData();
		}
	}, []);

	return (
		<main className='bg-white p-3'>
			<header className='flex justify-between items-center'>
				<Link
					className='bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white flex gap-3'
					href='/ms/transactions'
				>
					<ArrowLeft />
					Go back
				</Link>
				<Text size='xl'>Viewing Tnx {id}</Text>

				<div className='flex flex-col gap-1 w-max pointer-events-none'>
					<label htmlFor='status'>Transaction status</label>
					<Button id='status' color={status?.color}>
						{status?.label}
					</Button>
				</div>
			</header>
			<Tabs defaultValue='info' keepMounted={false}>
				<Tabs.List className='mb-4'>
					<Tabs.Tab value='info' leftSection={<Info />}>
						Info
					</Tabs.Tab>
					<Tabs.Tab value='payments' leftSection={<IconReportMoney />}>
						Payments
					</Tabs.Tab>
					<Tabs.Tab value='reciepts' leftSection={<Receipt />}>
						Receipts
					</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value='info'>
					<InfoC tnx={tnx} />
				</Tabs.Panel>
				<Tabs.Panel value='payments'>
					<Payments id={id} />
				</Tabs.Panel>
				<Tabs.Panel value='reciepts'>
					<Receipts id={id} />
				</Tabs.Panel>
			</Tabs>
		</main>
	);
};

export default page;
