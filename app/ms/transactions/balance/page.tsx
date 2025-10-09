"use client";
import { useEffect, useRef, useState } from "react";
import {
	ActionIcon,
	Button,
	LoadingOverlay,
	NumberFormatter,
	NumberInput,
	Select,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { ArrowBigRight, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { useEdit, useFetch } from "@/hooks/useQueries";
import { IconPencil, IconReceipt, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import convert from "@/libs/numberConvert";
import TnxSearch from "@/components/TnxSearch";
const page = () => {
	const { fetch, loading: Floading } = useFetch();
	const { edit, loading } = useEdit();
	const [reciept, setReciept] = useState<any | null>(null);
	const [status, setStatus] = useState<{
		color: string;
		label: string;
	} | null>(null);
	const [method, setMethod] = useState<string | null>(null);
	const [paid, setPaid] = useState<string | number>("");
	const [criteria, setCriteria] = useState<
		"Reciept / Tnx No" | "Admission No" | null | string
	>("Admission No");
	const [id, setId] = useState("");
	const [tnx, setTnx] = useState<any | null>(null);
	const [item, setItem] = useState<any | null>(null);
	const [items, setItems] = useState<
		{
			id: string | undefined;
			name: string | undefined;
			price: number | string;
			paid: number | string;
			mpaid: number | string;
			balance: number;
			method: string | null;
		}[]
	>([]);
	const contentRef = useRef<HTMLTableElement>(null);
	const reactToPrintFn = useReactToPrint({
		contentRef,
		bodyClass: "print",
		documentTitle: `reciept no ${Number(reciept?.id)} for tnx no ${Number(
			reciept?.tnxId
		)}`,
	});
	const itemPrice = tnx?.items?.reduce((prev: any, curr: { price: any }) => {
		return Number(prev) + Number(curr.price);
	}, 0);
	const itemPay = tnx?.items?.reduce((prev: any, curr: { paid: any }) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const itemBalance = itemPrice - itemPay;

	const totalPrice = items.reduce((prev, curr) => {
		return Number(prev) + Number(curr.price);
	}, 0);
	const totalPay = items.reduce((prev, curr) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const totalBalance = items.reduce((prev, curr) => {
		return prev + curr.balance;
	}, 0);
	const rPay = reciept?.items?.reduce((prev: any, curr: { paid: number }) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const rAmount = reciept?.items?.reduce(
		(prev: any, curr: { price: number }) => {
			return prev + curr.price;
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
	const loadTnx = async () => {
		setItem(null);
		setReciept(null);
		setItems([]);
		const { data } = await fetch(`/transactions/${id}`);
		setTnx(data);
	};
	useEffect(() => {
		getStatus(tnx?.status);
	}, [tnx]);
	useEffect(() => {
		if (totalPrice > 0 && totalPay < totalPrice) {
			setStatus({
				color: "orange",
				label: "Partly Paid",
			});
		} else if (items.length == 0) {
			getStatus(tnx?.status);
		} else if (totalBalance == 0) {
			setStatus({
				color: "teal",
				label: "Fully Paid",
			});
		}
	}, [items.length, totalBalance]);

	return (
		<main className='space-y-4 p-3 bg-white'>
			{reciept && (
				<section style={{ display: "none" }}>
					<div ref={contentRef} className='printable text-xs'>
						<div className='flex items-start gap-4 mb-1'>
							<Image
								src='/logo.svg'
								height={100}
								width={100}
								alt='Albarka logo'
								loading='eager'
							/>
							<div className='space-y-1 w-full'>
								<div className='flex items-center w-full justify-between'>
									<h2 className='font-extrabold font-serif '>ALBARKA SCHOOL</h2>
									<p>{format(new Date(), "PPPpp")}</p>
								</div>
								<h3 className=''>Rofia Road, Wawa, Niger State</h3>
								<p className=' italic'>E-mail: albarkaschool@yahoo.com</p>
							</div>
						</div>
						<div className='flex flex-wrap gap-2 mb-1'>
							<div className='flex items-center'>
								<h2 className='font-extrabold font-serif '>Receipt No:</h2>
								<p className='underline pl-1.5'>{reciept?.id}</p>
							</div>
							<div className='flex items-center'>
								<h2 className='font-extrabold font-serif '>Tnx Date:</h2>
								<p className='underline pl-1.5'>
									{format(new Date(reciept?.createdAt), "PPPpp")}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='font-extrabold font-serif '>Student name:</h2>
								<p className='underline pl-1.5'>
									{reciept?.transaction?.student?.last_name}{" "}
									{reciept?.transaction?.student?.first_name}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='font-extrabold font-serif '>Adm No:</h2>
								<p className='underline pl-1.5'>
									{reciept?.transaction?.student?.admission_no}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='font-extrabold font-serif '>Address:</h2>
								<p className='underline pl-1.5'>
									Albarka School, Wawa, Niger State
								</p>
							</div>

							<div className='flex items-center '>
								<h2 className='font-extrabold font-serif '>Cashier:</h2>
								<p className='underline pl-1.5'>
									{reciept?.createdBy?.username}
								</p>
							</div>
						</div>
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Item</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Paid</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{reciept?.items?.map((item: any, i: number) => (
									<Table.Tr key={i + 1}>
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.price)}
												thousandSeparator
											/>
										</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.paid)}
												thousandSeparator
											/>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
							<Table.Tfoot className='font-semibold border bg-gray-200'>
								<Table.Tr>
									<Table.Td>Total: </Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={rAmount}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={rPay}
											thousandSeparator
										/>
									</Table.Td>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
						<Text fw={600}>
							Total amount paid in words:
							<i className=' pl-2 capitalize'>{convert(Number(rPay))} Naira</i>
						</Text>
					</div>
				</section>
			)}
			<header className='flex justify-between items-center'>
				<Link
					className='bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white flex gap-3'
					href='/ms/transactions'
				>
					<ArrowLeft />
					Go back
				</Link>
				<Text size='xl'>Pay Balance</Text>

				<div className='flex flex-col gap-1 w-max pointer-events-none'>
					<label htmlFor='status'>Transaction status</label>
					<Button id='status' color={status?.color}>
						{status?.label}
					</Button>
				</div>
			</header>
			<section>
				<div className='flex gap-2 items-end w-full'>
					<Select
						label='Tnx search criteria'
						placeholder='search criteria'
						value={criteria}
						data={["Reciept / Tnx No", "Admission No"]}
						onChange={(value) => {
							setTnx(null);
							setCriteria(value);
						}}
					/>
					{criteria == "Admission No" && <TnxSearch setTnx={setTnx} />}
					{criteria == "Reciept / Tnx No" && (
						<>
							<TextInput
								label='Receipt / Tnx No'
								placeholder='load tnx by reciept no or tnx id'
								className='w-64'
								rightSection={<Search size={20} />}
								value={id}
								onChange={(e) => {
									setId(e.currentTarget.value);
								}}
							/>
							<Button disabled={!id} onClick={loadTnx}>
								load transaction
							</Button>
						</>
					)}
				</div>
				<>
					<form
						className='flex flex-wrap gap-2 items-end'
						onSubmit={async (e) => {
							e.preventDefault();
							const { data } = await edit(`/transactions/${id}/balance`, {
								balance: itemBalance - totalPay,
								status: status?.label,
								items,
								curr_class: tnx?.class,
								session: tnx?.session,
								term: tnx?.term,
							});
							const rec = data?.reciepts[0];

							setReciept({ ...rec, items: JSON.parse(rec?.items) });
							setItems([]);
							const { data: t } = await fetch(`/transactions/${id}`);
							setTnx(t);
						}}
					>
						<TextInput
							placeholder='name'
							label='Item Name'
							value={item?.fee?.name}
							disabled
						/>
						<NumberInput
							label='Amount'
							placeholder='balance amount'
							thousandSeparator
							value={Number(item?.price) - Number(item?.paid)}
							prefix='N '
							disabled
							className='w-32'
						/>
						<NumberInput
							label='To balance'
							placeholder='balance'
							thousandSeparator
							value={paid}
							prefix='N '
							disabled={!item?.price}
							min={0}
							max={Number(item?.price) - Number(item?.paid)}
							className='w-32'
							onChange={(value) => {
								setPaid(value);
							}}
						/>
						<Select
							label='Method'
							placeholder='method'
							disabled={!paid}
							value={method}
							data={["Cash", "Bank TRF", "POS", "MD Collect"]}
							className='w-32'
							onChange={(value) => {
								setMethod(value);
							}}
						/>
						<Button
							disabled={
								!(paid && method) ||
								String(tnx?.status).toLowerCase().includes("reversed")
							}
							onClick={() => {
								const filtered = items.filter((i) => i.id !== item?.id);
								setItems([
									{
										name: item?.fee?.name,
										method,
										price: Number(item?.price) - Number(item?.paid),
										paid,
										mpaid: Number(item?.paid) + Number(paid),
										balance:
											Number(item?.price) - Number(item?.paid) - Number(paid),
										id: item?.id,
									},
									...filtered,
								]);
								setPaid("");
								setMethod(null);
							}}
						>
							Add to List
						</Button>

						<Button type='submit' color='teal' disabled={items.length == 0}>
							Complete Balance payment
						</Button>
						<ActionIcon
							size={35}
							disabled={!reciept}
							onClick={() => {
								reactToPrintFn();
							}}
						>
							<IconReceipt />
						</ActionIcon>
					</form>

					<div className='flex gap-1 items-center'>
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>S/N</Table.Th>
									<Table.Th>Item</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Paid</Table.Th>
									<Table.Th>Balance</Table.Th>
									<Table.Th></Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{tnx?.items?.map((item: any, i: number) => (
									<Table.Tr key={item?.id}>
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
											<ActionIcon
												color='teal'
												disabled={Number(item?.price) - Number(item?.paid) < 1}
												onClick={() => {
													setItem(item);
												}}
											>
												<IconPencil />
											</ActionIcon>
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
											prefix='N '
											value={itemPrice}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={itemPay}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={itemBalance}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Th></Table.Th>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
						<ArrowBigRight size={60} />
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>S/N</Table.Th>
									<Table.Th>Item</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Paid</Table.Th>
									<Table.Th>Balance</Table.Th>
									<Table.Th>Method</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{items.map((item: any, i: number) => (
									<Table.Tr key={i + 1}>
										<Table.Td>{i + 1}</Table.Td>
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.price)}
												thousandSeparator
											/>
										</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.paid)}
												thousandSeparator
											/>
										</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.balance)}
												thousandSeparator
											/>
										</Table.Td>
										<Table.Td>{item?.method}</Table.Td>
										<Table.Td>
											<ActionIcon
												color='red'
												onClick={() => {
													const filtered = items.filter(
														(i) => item.name !== i?.name
													);
													setItems(filtered);
												}}
											>
												<IconX />
											</ActionIcon>
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
											prefix='N '
											value={totalPrice}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={totalPay}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={totalBalance}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td></Table.Td>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
					</div>
				</>
			</section>
			<LoadingOverlay visible={Floading || loading} />
		</main>
	);
};

export default page;
