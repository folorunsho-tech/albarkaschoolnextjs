"use client";
import { Button, Tabs } from "@mantine/core";
import {
	IconArrowDown,
	IconArrowNarrowLeft,
	IconHistory,
} from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import TransactionHistory from "@/components/payments/TransactionHistory";
import CurrentTnx from "@/components/payments/CurrentTnx";
const View = () => {
	const { id }: { id: string } = useParams();

	const router = useRouter();

	return (
		<main className=''>
			<section className='flex justify-between p-3'>
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
						router.push("/ms/payments");
					}}
				>
					Go back
				</Button>
				<h3 className='italic'>
					Viewing tnxId: <b>{id}</b>
				</h3>
			</section>
			<section className='bg-white'>
				<Tabs defaultValue='current' keepMounted={false}>
					<Tabs.List>
						<Tabs.Tab value='current' leftSection={<IconArrowDown />}>
							Current State
						</Tabs.Tab>
						<Tabs.Tab value='history' leftSection={<IconHistory />}>
							Transaction History
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='current'>
						<CurrentTnx />
					</Tabs.Panel>

					<Tabs.Panel value='history'>
						<TransactionHistory id={id} />
					</Tabs.Panel>
				</Tabs>
			</section>
		</main>
	);
};

export default View;
