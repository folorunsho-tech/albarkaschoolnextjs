"use client";
import Reversed from "@/components/payments/Reversed";
import TPayments from "@/components/payments/TPayments";
import { Button, Tabs, rem } from "@mantine/core";
import { IconCashRegister, IconRestore } from "@tabler/icons-react";
import Link from "next/link";

function Payments() {
	const iconStyle = { width: rem(20), height: rem(20) };

	return (
		<section className='flex flex-col'>
			<Button
				href='payments/report'
				component={Link}
				className='self-end w-max mr-4 -mb-9 z-50'
			>
				Payments report
			</Button>
			<Tabs
				defaultValue='active'
				keepMounted={false}
				color='teal'
				className='flex flex-col'
			>
				<Tabs.List>
					<Tabs.Tab
						value='active'
						leftSection={<IconCashRegister style={iconStyle} />}
					>
						Active Transanctions
					</Tabs.Tab>
					<Tabs.Tab
						value='cancelled'
						leftSection={<IconRestore style={iconStyle} />}
					>
						Cancelled Transactions
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value='active'>
					<TPayments />
				</Tabs.Panel>

				<Tabs.Panel value='cancelled'>
					<Reversed />
				</Tabs.Panel>
			</Tabs>
		</section>
	);
}
export default Payments;
