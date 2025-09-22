"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
	ActionIcon,
	Button,
	Drawer,
	LoadingOverlay,
	NumberFormatter,
	NumberInput,
	ScrollArea,
	Select,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { usePost, useFetch } from "@/hooks/useQueries";
import { IconExternalLink, IconReceipt, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import Image from "next/image";
import StudentSearch from "@/components/StudentSearch";
import { sessions } from "@/libs/sessions";
import convert from "@/libs/numberConvert";
import { useDisclosure } from "@mantine/hooks";
import ReportsTable from "@/components/ReportsTable";
const page = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const { post, loading } = usePost();
	const { fetch } = useFetch();
	const [fee, setFee] = useState<
		{ id: string; name: string; amount: number } | null | undefined
	>(null);
	const [classFees, setClassFees] = useState<
		{ id: string; name: string; amount: number }[]
	>([]);
	const [reciept, setReciept] = useState<any | null>(null);
	const [status, setStatus] = useState<{
		color: string;
		label: string;
	} | null>(null);
	const [feeId, setFeeId] = useState<string | null>(null);
	const [method, setMethod] = useState<string | null>(null);
	const [session, setSession] = useState<string | null>("");
	const [term, setTerm] = useState<string | null>("");
	const [paid, setPaid] = useState<string | number>("");
	const [fees, setFees] = useState<{ value: string; label: string }[]>([]);
	const [studentData, setStudentData] = useState<any>(null);
	const [outstanding, setOutstanding] = useState<any[]>([]);
	const [cleared, setCleared] = useState<boolean>(false);
	const [items, setItems] = useState<
		{
			name: string | undefined;
			price: number | string;
			paid: number | string;
			balance: number;
			method: string | null;
			feeId: string | null;
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
	useEffect(() => {
		if (totalBalance == 0) {
			setStatus({
				color: "teal",
				label: "Fully Paid",
			});
		} else if (totalPrice > 0 && totalPay < totalPrice) {
			setStatus({
				color: "orange",
				label: "Partly Paid",
			});
		}
	}, [totalBalance]);
	const reset = () => {
		setFeeId(null);
		setFee(null);
		setPaid("");
		setMethod(null);
		setItems([]);
	};
	useEffect(() => {
		setPaid("");
		setMethod(null);
	}, [feeId]);
	const setData = async () => {
		const { data } = await fetch(`/students/outstanding/${studentData?.id}`);
		setOutstanding(data);
		const sorted = studentData?.curr_class?.fees?.map(
			(fee: { id: string; name: string }) => {
				return {
					value: fee?.id,
					label: fee?.name,
				};
			}
		);
		setFees(sorted);
		setClassFees(studentData?.curr_class?.fees);
	};
	useEffect(() => {
		if (studentData) {
			setData();
		}
	}, [studentData]);
	return (
		<main className='space-y-4 bg-white p-4'>
			{reciept && (
				<section style={{ display: "none" }}>
					<div ref={contentRef} className='printable text-sm'>
						<div className='flex items-start gap-4 mb-1'>
							<Image
								src='/logo.png'
								height={100}
								width={100}
								alt='Albarka logo'
								loading='eager'
							/>
							<div className='space-y-1 w-full'>
								<div className='flex items-center w-full justify-between'>
									<h2 className='text-xl font-extrabold font-serif '>
										AL-BARKA SCHOOL, WAWA
									</h2>
									<p>{format(new Date(), "PPPpp")}</p>
								</div>
								<h3 className='text-lg '>Rofia Road, Wawa, Niger State</h3>
								<p className='text-md  italic'>
									E-mail: albarkaschool@yahoo.com
								</p>
							</div>
						</div>
						<div className='flex flex-wrap gap-2 mb-1'>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>
									Receipt No:
								</h2>
								<p className='underline pl-1.5'>{reciept?.id}</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>
									Tnx Date:
								</h2>
								<p className='underline pl-1.5'>
									{format(new Date(reciept?.createdAt), "PPPpp")}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>
									Student name:
								</h2>
								<p className='underline pl-1.5'>
									{reciept?.transaction?.student?.last_name}{" "}
									{reciept?.transaction?.student?.first_name}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>Adm No:</h2>
								<p className='underline pl-1.5'>
									{reciept?.transaction?.student?.admission_no}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>Address:</h2>
								<p className='underline pl-1.5'>
									{reciept?.transaction?.student?.address}
								</p>
							</div>

							<div className='flex items-center '>
								<h2 className='text-sm font-extrabold font-serif '>Cashier:</h2>
								<p className='underline pl-1.5'>
									{reciept?.createdBy?.username}
								</p>
							</div>
						</div>
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>S/N</Table.Th>
									<Table.Th>Name</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Paid</Table.Th>
									<Table.Th>Method</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{reciept?.items?.map((item: any, i: number) => (
									<Table.Tr key={i + 1}>
										<Table.Td>{i + 1}</Table.Td>
										<Table.Td>{item?.name}</Table.Td>
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
										<Table.Td>{item?.method}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
							<Table.Tfoot className='font-semibold border bg-gray-200'>
								<Table.Tr>
									<Table.Td></Table.Td>
									<Table.Td>Total: </Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='NGN '
											value={rAmount}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='NGN '
											value={rPay}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td></Table.Td>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
						<Text fw={600}>
							Total amount paid in words:
							<i className='text-sm pl-2 capitalize'>
								{convert(Number(rPay))} Naira
							</i>
						</Text>
					</div>
				</section>
			)}
			<header className='flex justify-between items-end'>
				<Link
					className='bg-blue-500 hover:bg-blue-600 p-1 px-2 rounded-lg text-white flex gap-3'
					href='/ms/transactions'
				>
					<ArrowLeft />
					Go back
				</Link>
				<Text size='xl'>Initiate a transaction</Text>
				<div className='flex gap-3 items-end'>
					<Button color={outstanding.length ? "red" : "green"} onClick={open}>
						{outstanding.length} Outstanding tnx
					</Button>
					<div className='flex flex-col gap-1 w-max pointer-events-none'>
						<label htmlFor='status'>Transaction status</label>
						<Button id='status' color={status?.color}>
							{status?.label}
						</Button>
					</div>
				</div>
			</header>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const { data } = await post("/transactions/create", {
						total: totalPrice,
						balance: totalBalance,
						paid: totalPrice - totalBalance,
						items,
						status: status?.label,
						studentId: studentData?.id,
						curr_class: studentData?.curr_class?.name,
						session,
						term,
					});
					const rec = data?.reciepts[0];
					setReciept({ ...rec, items: JSON.parse(rec?.items) });
					reset();
				}}
				className='flex flex-col gap-3  w-full'
			>
				<div className='flex justify-between'>
					<StudentSearch setStudent={setStudentData} cleared={cleared} />
					<div className='flex gap-2 self-end'>
						<TextInput
							disabled
							label='Class'
							placeholder='class'
							value={studentData?.curr_class?.name}
						/>
						<Select
							label='Term'
							placeholder='Select term'
							data={["1st Term", "2nd Term", "3rd Term"]}
							value={term}
							required
							searchable
							className='w-40'
							onChange={(value) => {
								setTerm(value);
							}}
						/>
						<Select
							label='Session'
							placeholder='Select session'
							data={sessions}
							value={session}
							required
							searchable
							className='w-40'
							onChange={(value) => {
								setSession(value);
							}}
						/>
					</div>
				</div>

				<>
					<section className='flex flex-wrap gap-2 items-end self-start'>
						<Select
							label='Item'
							placeholder='Select an Item'
							data={fees}
							value={feeId}
							clearable
							searchable
							className='w-40'
							onChange={(value) => {
								setFeeId(value);
								const found = classFees.find(
									(f: { id: string; amount: number }) => f?.id == value
								);
								setFee(found);
							}}
						/>
						<NumberInput
							label='Price'
							placeholder='item price'
							thousandSeparator
							value={fee?.amount}
							min={0}
							prefix='NGN '
							disabled
							className='w-32'
						/>
						<NumberInput
							label='Paid'
							placeholder='amount paid'
							thousandSeparator
							value={paid}
							min={0}
							prefix='NGN '
							max={Number(fee?.amount)}
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
							disabled={!(paid && method)}
							onClick={() => {
								const filtered = items.filter(
									(item) => item.name !== fee?.name
								);
								setItems([
									{
										name: fee?.name,
										method,
										price: Number(fee?.amount) ?? 0,
										paid,
										balance: Number(fee?.amount) - Number(paid),
										feeId,
									},
									...filtered,
								]);
								setFeeId(null);
								setFee(null);
								setPaid("");
								setMethod(null);
							}}
						>
							Add to List
						</Button>

						<Button type='submit' color='teal' disabled={items.length == 0}>
							Complete transaction
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
						<Button color='red' onClick={reset}>
							Reset
						</Button>
					</section>

					<ScrollArea h={700}>
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>S/N</Table.Th>
									<Table.Th>Name</Table.Th>
									<Table.Th>Price</Table.Th>
									<Table.Th>Paid</Table.Th>
									<Table.Th>Balance</Table.Th>
									<Table.Th>Method</Table.Th>
									<Table.Th></Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{items.map((item: any, i: number) => (
									<Table.Tr key={i + 1}>
										<Table.Td>{i + 1}</Table.Td>
										<Table.Td>{item?.name}</Table.Td>
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
									<Table.Td></Table.Td>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
					</ScrollArea>
				</>

				<LoadingOverlay visible={loading} />
			</form>
			<Drawer
				opened={opened}
				onClose={close}
				offset={8}
				position='right'
				title={
					<div className='flex items-center gap-2'>
						<Text className='text-lg'>
							Outstanding tnx for {studentData?.admission_no} -{" "}
							{studentData?.last_name} {studentData?.first_name}
						</Text>
					</div>
				}
				size='xl'
			>
				<ReportsTable
					headers={["Date", "Tnx Id", "Fee", "Amount", "Paid", "Balance"]}
					sortedData={outstanding}
					data={outstanding}
					disableBtn={true}
					rows={outstanding?.map((row, i) => (
						<Table.Tr key={row?.id}>
							<Table.Td>
								{new Date(row?.updatedAt).toLocaleDateString()}
							</Table.Td>
							<Table.Td>{row?.transactionId}</Table.Td>
							<Table.Td>{row?.fee?.name}</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={row?.price}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={row?.paid}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<NumberFormatter
									prefix='NGN '
									value={row?.balance}
									thousandSeparator
								/>
							</Table.Td>
							<Table.Td>
								<Button
									color='green'
									component={Link}
									target='_blank'
									rightSection={<IconExternalLink />}
									onClick={() => {
										setCleared(true);
										close();
										setOutstanding([]);
									}}
									href={`/ms/transactions/balance?tnxId=${row?.transactionId}`}
								>
									Pay Balance
								</Button>
							</Table.Td>
						</Table.Tr>
					))}
				/>
			</Drawer>
		</main>
	);
};

export default page;
