"use client";
import { useEffect, useState } from "react";
import { useEdit, useFetch } from "@/hooks/useQueries";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import {
	Button,
	Checkbox,
	LoadingOverlay,
	NumberFormatter,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
const page = () => {
	const { fetch, loading: Floading } = useFetch();
	const { edit, loading } = useEdit();
	const [id, setId] = useState("");
	const [tnx, setTnx] = useState<any | null>(null);
	const [status, setStatus] = useState<{
		color: string;
		label: string;
	} | null>(null);
	const [items, setItems] = useState<any[]>([]);
	const [reversed, setReversed] = useState<any[]>([]);
	const totalPrice = tnx?.items?.reduce((prev: any, curr: { price: any }) => {
		return Number(prev) + Number(curr.price);
	}, 0);
	const totalPay = tnx?.items?.reduce((prev: any, curr: { paid: any }) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const totalBalance = tnx?.items?.reduce(
		(prev: any, curr: { balance: any }) => {
			return prev + curr.balance;
		},
		0
	);
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
			const filtered = tnx?.items?.filter((i: any) => i?.active == false);
			setReversed(filtered);
		}
	}, [tnx]);
	useEffect(() => {
		if (reversed.length == tnx?.items?.length) {
			setStatus({
				color: "red",
				label: "Fully Reversed",
			});
		} else if (reversed.length == 0) {
			getStatus(tnx?.status);
		} else {
			setStatus({
				color: "pink",
				label: "Partly Reversed",
			});
		}
	}, [items.length]);

	return (
		<main className='space-y-6 bg-white p-3'>
			<header className='flex justify-between items-center'>
				<Link
					className='bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white flex gap-3'
					href='/ms/transactions'
				>
					<ArrowLeft />
					Go back
				</Link>
				<Text size='xl'>Reverse payment</Text>

				<div className='flex flex-col gap-1 w-max pointer-events-none'>
					<label htmlFor='status'>Transaction status</label>
					<Button id='status' color={status?.color}>
						{status?.label}
					</Button>
				</div>
			</header>
			<div className='flex gap-2 items-end'>
				<TextInput
					label='Receipt No'
					placeholder='load tnx by reciept no'
					className='w-52'
					rightSection={<Search size={20} />}
					value={id}
					onChange={(e) => {
						setId(e.currentTarget.value);
					}}
				/>
				<Button
					disabled={!id}
					onClick={async () => {
						setItems([]);
						const { data } = await fetch(`/transactions/${id}`);
						setTnx(data);
					}}
				>
					load transaction
				</Button>
				<Button
					color='red'
					disabled={items.length == 0}
					onClick={async () => {
						const toReverse = items.map((item) => {
							return {
								id: item?.id,
								active: false,
								paid: -item?.paid,
								name: item?.fee?.name,
							};
						});
						await edit(`/transactions/${id}/reversal`, {
							status: status?.label,
							toReverse,
							curr_class: tnx?.class,
							session: tnx?.session,
							term: tnx?.term,
						});
						setReversed([]);
						setItems([]);
						const { data } = await fetch(`/transactions/${id}`);
						setTnx(data);
					}}
				>
					Complete Reversal
				</Button>
			</div>
			{items.length > 0 && (
				<Text>Reverse {items.length} transaction item(s)</Text>
			)}
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>S/N</Table.Th>
						<Table.Th>Name</Table.Th>
						<Table.Th>Price</Table.Th>
						<Table.Th>Paid</Table.Th>
						<Table.Th>Balance</Table.Th>
						<Table.Th>Selection</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{tnx?.items?.map((item: any, i: number) => (
						<Table.Tr
							key={item?.id}
							className={
								items.find((i) => i?.id == item?.id) || !item?.active
									? "line-through decoration-wavy decoration-red-600"
									: ""
							}
						>
							<Table.Td>{i + 1}</Table.Td>
							<Table.Td>{item?.fee?.name}</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={Number(item?.price)}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={Number(item?.paid)}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={Number(item?.price) - Number(item?.paid)}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<Checkbox
									checked={
										!item?.active || items.find((i) => i?.id == item?.id)
									}
									disabled={!item?.active}
									onChange={(e) => {
										const checked = e.currentTarget.checked;
										const filtered = items.filter((i) => i?.id !== item?.id);
										if (checked) {
											setItems([item, ...items]);
											setReversed([item, ...reversed]);
										} else {
											setItems(filtered);
											setReversed(filtered);
										}
									}}
								/>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
				<Table.Tfoot className='bg-gray-300 font-bold'>
					<Table.Tr>
						<Table.Td></Table.Td>
						<Table.Td>Total: </Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='NGN '
								value={totalPrice}
								thousandSeparator
							/>
						</Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='NGN '
								value={totalPay}
								thousandSeparator
							/>
						</Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='NGN '
								value={totalBalance}
								thousandSeparator
							/>
						</Table.Td>
						<Table.Th></Table.Th>
					</Table.Tr>
				</Table.Tfoot>
			</Table>
			<LoadingOverlay visible={Floading || loading} />
		</main>
	);
};

export default page;
