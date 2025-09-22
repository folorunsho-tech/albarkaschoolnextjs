"use client";
import React, { useEffect, useState } from "react";
import {
	Button,
	TextInput,
	Tabs,
	rem,
	Select,
	LoadingOverlay,
	Text,
	NumberFormatter,
	Table,
	ScrollArea,
	ActionIcon,
	NumberInput,
} from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import {
	IconArrowNarrowLeft,
	IconCashRegister,
	IconHistory,
	IconPencil,
	IconReload,
	IconX,
} from "@tabler/icons-react";
import { useFetch, useEdit } from "@/hooks/useQueries";
import { sessions } from "@/libs/sessions";
import BReciept from "@/components/BalanceReciept";
import TransactionHistory from "@/components/payments/TransactionHistory";

const Edit = () => {
	const { fetch } = useFetch();
	const router = useRouter();
	const { id }: { id: string } = useParams();

	const [status, setStatus] = useState<string | undefined>("Unpaid");
	const [feesList, setFeesList] = useState<any[]>([]);
	const [items, setItems] = useState<any[]>([]);
	const [updated, setUpdated] = useState<any[]>([]);
	const [payment_method, setPayment_method] = useState("Cash");
	const [teller_no, setTeller_no] = useState("");
	const [paid, setPaid] = useState(0);
	const [price, setPrice] = useState(0);
	const [enablePrint, setEnablePrint] = useState(false);
	const { edit, loading } = useEdit();
	const [queryData, setQueryData] = useState<any>(null);
	const [editData, setEditData] = useState<any>(null);
	const [selected, setSelected] = useState<any>(null);
	const getTnx = async () => {
		const { data: trans } = await fetch("/transactions/" + id);
		const { data } = await fetch("/classes/fees/" + trans?.class);
		const sortedItems = trans?.tnx?.items?.map((item: any) => {
			return {
				...item,
				name: item?.item?.name,
				paidToday: 0,
			};
		});
		const sortedFees = data?.map((fee: any) => {
			return {
				value: fee?.id,
				label: fee?.name,
			};
		});
		// console.log(trans);
		setQueryData(trans?.tnx);
		setFeesList(sortedFees);
		setItems(sortedItems);
	};
	useEffect(() => {
		getTnx();
	}, []);
	const total = items?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.amount);
	}, 0);
	const balanced = items?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.amount - curr?.paid);
	}, 0);
	const totalPaid = items?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.paid);
	}, 0);
	const totalPaidToday = items?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.paidToday);
	}, 0);
	const getStatus = (paid: number, total: number) => {
		if (paid == total) {
			return "Paid";
		} else if (paid > 0) {
			return "Partly paid";
		} else if (paid == 0) {
			return "Unpaid";
		}
	};
	useEffect(() => {
		const stat = getStatus(totalPaid, total);
		setStatus(stat);
	}, [balanced]);
	const iconStyle = { width: rem(15), height: rem(15) };

	const getStatusColor = (status: string | undefined) => {
		if (status === "Partly paid") {
			return "orange";
		} else if (status === "Paid") {
			return "green";
		} else {
			return "red";
		}
	};
	const submit = async () => {
		const { data } = await edit("/transactions/balance/" + id, {
			paid: totalPaid,
			total: Number(total),
			status,
			items,
			histItems: updated?.map((item) => {
				return {
					...item,
					paid: item?.paidToday,
				};
			}),
		});
		setPaid(0);
		setItems([]);
		setEditData(data);
		setEnablePrint(true);
		getTnx();
	};
	return (
		<section className='w-full p-3'>
			<div className='flex justify-between pr-12'>
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
				<BReciept enablePrint={enablePrint} hist={editData} />
			</div>
			<section className='bg-white p-3 space-y-3 mt-3 h-[40rem]'>
				<div className='flex items-center gap-2 justify-between'>
					<TextInput
						value={`${queryData?.student?.admission_no} - ${queryData?.student?.last_name} ${queryData?.student?.first_name}`}
						disabled
						className='w-[20rem]'
					/>
					<Button
						leftSection={<IconReload />}
						color='red'
						onClick={() => {
							getTnx();
							setSelected(null);
							setPrice(0);
						}}
					>
						Reset
					</Button>
					<div className='flex gap-2 flex-wrap justify-end'>
						<Text size='sm'>
							Guardian / Parent name: <b>{queryData?.student?.guardian_name}</b>
						</Text>
						<Text size='sm'>
							Guardian / Parent telephone:{" "}
							<b>{queryData?.student?.guardian_telephone}</b>
						</Text>
						<Text size='sm'>
							Class: <b>{queryData?.student?.curr_class?.name}</b>
						</Text>
						<Text size='sm'>
							Sex: <b>{queryData?.student?.sex}</b>
						</Text>
					</div>
				</div>

				<Tabs defaultValue='make_payment' keepMounted={false}>
					<Tabs.List>
						<Tabs.Tab
							value='make_payment'
							leftSection={<IconCashRegister style={iconStyle} />}
						>
							Balance Payment
						</Tabs.Tab>
						<Tabs.Tab
							value='history'
							leftSection={<IconHistory style={iconStyle} />}
						>
							Transaction history
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='make_payment' className='relative'>
						<form
							className='flex justify-between'
							onSubmit={(e) => {
								e.preventDefault();
								submit();
							}}
						>
							<section className='space-y-4'>
								<div className='flex gap-6 mt-3'>
									<Select
										checkIconPosition='right'
										label='Term'
										placeholder='Select term'
										data={["1st term", "2nd term", "3rd term"]}
										allowDeselect={false}
										value={queryData?.term}
										disabled
										nothingFoundMessage='Nothing found...'
										className='w-[8rem]'
									/>
									<Select
										checkIconPosition='right'
										label='Session'
										placeholder='Select session'
										data={sessions}
										disabled
										allowDeselect={false}
										value={queryData?.session}
										nothingFoundMessage='Nothing found...'
										className='w-[9rem]'
									/>
									<Button
										className='pointer-events-none self-end'
										color={getStatusColor(status)}
									>
										{status}
									</Button>
									<Button
										className='self-end'
										leftSection={<IconX />}
										color='red'
										onClick={async () => {
											await edit("/transactions/cancel" + id);
											router.push("/payments");
										}}
									>
										Mark as cancelled
									</Button>
								</div>
								<div className='flex items-end gap-3 flex-wrap'>
									<Select
										checkIconPosition='right'
										label='Add transaction item'
										placeholder='Search for fee by name or school section to add'
										data={feesList}
										disabled
										value={selected?.item_id}
										allowDeselect={true}
										nothingFoundMessage='Nothing found...'
										className='w-[22rem]'
									/>
									<NumberInput
										prefix='N '
										thousandSeparator
										value={price}
										min={0}
										disabled
										hideControls
										allowDecimal={false}
										allowNegative={false}
										onChange={(value: any) => {
											setPrice(Number(value));
										}}
										label='Price'
										className='w-32'
									/>
									<div className='flex gap-4'>
										<NumberInput
											prefix='N '
											thousandSeparator
											value={paid}
											min={0}
											max={Number(selected?.amount) - Number(selected?.paid)}
											hideControls
											allowDecimal={false}
											allowNegative={false}
											error={
												paid > Number(selected?.amount) - Number(selected?.paid)
													? "Amount paid can not be less than or greater than total"
													: false
											}
											onChange={(value: any) => {
												setPaid(Number(value));
											}}
											label='Amount paid'
											className='w-32'
										/>
										<Select
											checkIconPosition='right'
											label='Select payment method'
											placeholder='Select payment method'
											data={[
												"Cash",
												"UBA",
												"BMFB",
												"BMFB (PTA)",
												"Keystone Bank",
											]}
											allowDeselect={false}
											searchable
											value={payment_method}
											nothingFoundMessage='Nothing found...'
											onChange={(value: any) => {
												setPayment_method(value);
												setTeller_no("");
											}}
										/>
									</div>
									{payment_method !== "Cash" && (
										<TextInput
											value={teller_no}
											onChange={(e) => {
												setTeller_no(e.currentTarget.value);
											}}
											label='Teller no'
											placeholder='teller no'
										/>
									)}
									<Button
										color='black'
										disabled={!paid}
										onClick={() => {
											const filtered = items?.filter(
												(item: any) => selected?.item_id !== item?.item_id
											);
											const filteredUp = updated?.filter(
												(item: any) => selected?.item_id !== item?.item_id
											);
											const updatedI = {
												payment_id: selected?.payment_id,
												name: selected?.name,
												amount: price,
												item_id: selected?.item_id,
												item: selected?.item,
												session: selected?.session,
												term: selected?.term,
												paid: selected?.paid + paid,
												status: getStatus(paid, price),
												payment_method,
												teller_no,
												school_section: queryData?.school_section,
												balance: Number(price) - Number(paid),
												paidToday: selected?.paidToday + paid,
											};
											setItems([updatedI, ...filtered]);
											setUpdated([updatedI, ...filteredUp]);
											setSelected(updated);
											setPaid(0);
											setPayment_method("Cash");
											setTeller_no("");
										}}
									>
										Update Item
									</Button>
								</div>

								<div className='flex gap-4 items-center'>
									<Button
										color='black'
										onClick={() => {
											router.back();
										}}
									>
										Cancel
									</Button>
									<Button
										disabled={items?.length < 1}
										color='teal'
										type='submit'
									>
										Complete balance payment
									</Button>
								</div>
							</section>
							<section className='w-4/5'>
								<div className='flex justify-between items-center my-4 pr-12'>
									<Text fw={600}>List</Text>
									<Text fw={600}>Date: {new Date().toLocaleDateString()}</Text>
								</div>
								<ScrollArea h={400}>
									<Table verticalSpacing='sm'>
										<Table.Thead className='bg-gray-300'>
											<Table.Tr>
												<Table.Th>S/N</Table.Th>
												<Table.Th>Name</Table.Th>
												<Table.Th>Price</Table.Th>
												<Table.Th>Curr Paid</Table.Th>
												<Table.Th>Paid Today</Table.Th>
												<Table.Th>Balance</Table.Th>
												<Table.Th>Method</Table.Th>
												<Table.Th>Action</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{items?.map((titem, index) => {
												return (
													<Table.Tr key={titem?.item_id}>
														<Table.Td>{index + 1}</Table.Td>
														<Table.Td>{titem?.name}</Table.Td>
														<Table.Td>
															<NumberFormatter
																prefix='N '
																value={titem?.amount}
																thousandSeparator
															/>
														</Table.Td>
														<Table.Td>
															<NumberFormatter
																prefix='N '
																value={titem?.paid}
																thousandSeparator
															/>
														</Table.Td>
														<Table.Td>
															<NumberFormatter
																prefix='N '
																value={titem?.paidToday}
																thousandSeparator
															/>
														</Table.Td>
														<Table.Td>
															<NumberFormatter
																prefix='N '
																value={
																	Number(titem?.amount) - Number(titem?.paid)
																}
																thousandSeparator
															/>
														</Table.Td>
														<Table.Td>{titem?.payment_method}</Table.Td>
														<Table.Td>
															<ActionIcon
																color='teal'
																disabled={
																	Number(titem?.amount) - Number(titem?.paid) ==
																	0
																}
																onClick={() => {
																	setSelected(titem);
																	setPaid(0);
																	setPrice(titem?.amount);
																}}
															>
																<IconPencil />
															</ActionIcon>
														</Table.Td>
													</Table.Tr>
												);
											})}
										</Table.Tbody>
										<Table.Tfoot className='bg-gray-300 font-bold '>
											<Table.Tr>
												<Table.Td>Total</Table.Td>
												<Table.Td></Table.Td>
												<Table.Td>
													<NumberFormatter
														prefix='N '
														value={total}
														thousandSeparator
													/>
												</Table.Td>
												<Table.Td>
													<NumberFormatter
														prefix='N '
														value={totalPaid}
														thousandSeparator
													/>
												</Table.Td>
												<Table.Td>
													<NumberFormatter
														prefix='N '
														value={totalPaidToday}
														thousandSeparator
													/>
												</Table.Td>
												<Table.Td>
													<NumberFormatter
														prefix='N '
														value={balanced}
														thousandSeparator
													/>
												</Table.Td>
											</Table.Tr>
										</Table.Tfoot>
									</Table>
								</ScrollArea>
							</section>
						</form>
						<LoadingOverlay visible={loading} />
					</Tabs.Panel>

					<Tabs.Panel value='history'>
						<TransactionHistory id={id} />
					</Tabs.Panel>
				</Tabs>
			</section>
		</section>
	);
};

export default Edit;
