"use client";
import { useEffect, useState, useContext } from "react";
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
import { useRouter } from "next/navigation";
import {
	IconArrowNarrowLeft,
	IconCashRegister,
	IconX,
} from "@tabler/icons-react";
import { useFetch, usePost } from "@/hooks/useQueries";
import { sessions, currSession, currTerm } from "@/libs/sessions";
import Reciept from "@/components/Reciept";
import { userContext } from "@/context/User";

const MakePayments = () => {
	const { user } = useContext(userContext);
	const { fetch } = useFetch();
	const { post, loading } = usePost();
	const router = useRouter();
	const [session, setSession] = useState("");
	const [term, setTerm] = useState<string | undefined>("");
	const [student, setStudent] = useState<any>({});
	const [sclass, setClass] = useState<any>({});
	const [classId, setClassId] = useState<any>("");
	const [students, setStudents] = useState<any[]>([]);
	const [classes, setClasses] = useState<any[]>([]);
	const [status, setStatus] = useState<string | undefined>("Unpaid");
	const [studentsList, setStudentsList] = useState<any[]>([]);
	const [feesList, setFeesList] = useState<any[]>([]);
	const [classList, setClassList] = useState<any[]>([]);
	const [items, setItems] = useState<any[]>([]);
	const [payment_method, setPayment_method] = useState("Cash");
	const [teller_no, setTeller_no] = useState("");
	const [fee, setFee] = useState<{
		id: string;
		amount: string;
		name: string;
	} | null>(null);
	const [paid, setPaid] = useState(0);
	const [price, setPrice] = useState(0);
	const [enablePrint, setEnablePrint] = useState(false);
	const [queryData, setQueryData] = useState<any>(null);
	const getAll = async () => {
		const { data: classes } = await fetch("/classes/fees");

		const sortedClasses = classes?.map((cl: any) => {
			return {
				value: cl?.id,
				label: cl?.name,
			};
		});
		setClasses(classes);
		setClassList(sortedClasses);
	};
	useEffect(() => {
		getAll();
	}, []);
	const getStudents = async () => {
		const { data } = await fetch(`/students/byClass/${classId}`);
		const sortedStudents = data?.map((s: any) => {
			return {
				value: s.admission_no,
				label: `${s.admission_no} - ${s.first_name} ${s.last_name}`,
			};
		});
		setStudents(data);
		setStudentsList(sortedStudents);
	};
	useEffect(() => {
		if (classId !== "") getStudents();
	}, [classId]);
	useEffect(() => {
		const found = classes?.find((cl: any) => classId == cl?.id);
		const sorted = found?.fees?.map((fee: any) => {
			return {
				value: fee?.id,
				label: fee?.name,
			};
		});
		setFeesList(sorted);
		setItems([]);
	}, [student?.admission_no]);

	const total = items.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.amount);
	}, 0);
	const balance = items.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.balance);
	}, 0);
	const totalPaid = items.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.paid);
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
	}, [balance]);
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
		const { data } = await post("/transactions/create", {
			paid: totalPaid,
			total: Number(total),
			status,
			session,
			class: sclass?.name,
			term,
			student_id: student?.id,
			items: items?.map((item) => {
				return {
					item_id: item?.item_id,
					amount: item?.amount,
					term: item?.term,
					session: item?.session,
					paid: item?.paid,
					status: item?.status,
					payment_method: item?.payment_method,
					teller_no: item?.teller_no,
					createdAt: new Date(),
				};
			}),
			updatedById: user?.id,
		});

		setPaid(0);
		setItems([]);
		setQueryData(data);
		setEnablePrint(true);
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
				<Reciept enablePrint={enablePrint} queryData={queryData} />
			</div>
			<section className='bg-white p-3 space-y-3 mt-3 h-[40rem]'>
				<div className='flex items-center gap-1 w-full'>
					<Select
						checkIconPosition='right'
						label="Select student's class"
						placeholder='Search by name'
						value={classId}
						data={classList}
						searchable
						allowDeselect={false}
						nothingFoundMessage='Nothing found...'
						onChange={(value: any) => {
							const found = classes?.find((cl: any) => value == cl?.id);
							setClass(found);
							setClassId(value);
						}}
						className='w-[16rem]'
					/>
					<Select
						checkIconPosition='right'
						label='Select a student'
						placeholder='Search by admission no'
						data={studentsList}
						searchable
						allowDeselect={false}
						nothingFoundMessage='Nothing found...'
						className='w-[28em]'
						onChange={(value: any) => {
							const found: any = students.find(
								(s: any) => s.admission_no == value
							);
							setStudent(found);

							setClass(found?.curr_class);
							setClassId(found?.curr_class_id);
						}}
					/>

					<div className='flex gap-2 w-full flex-wrap justify-end'>
						<Text size='sm'>
							Guardian / Parent name: <b>{student?.guardian_name}</b>
						</Text>
						<Text size='sm'>
							Guardian / Parent telephone: <b>{student?.guardian_telephone}</b>
						</Text>
						<Text size='sm'>
							Class: <b>{student?.curr_class?.name}</b>
						</Text>
						<Text size='sm'>
							Sex: <b>{student?.sex}</b>
						</Text>
					</div>
				</div>
				{student?.admission_no && classId ? (
					<Tabs defaultValue='make_payment' keepMounted={false}>
						<Tabs.List>
							<Tabs.Tab
								value='make_payment'
								leftSection={<IconCashRegister style={iconStyle} />}
							>
								Initiate Transaction
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
											value={term}
											searchable
											nothingFoundMessage='Nothing found...'
											className='w-[8rem]'
											onChange={(value: any) => {
												setTerm(value);
											}}
										/>
										<Select
											checkIconPosition='right'
											label='Session'
											placeholder='Select session'
											data={sessions}
											searchable
											allowDeselect={false}
											value={session}
											nothingFoundMessage='Nothing found...'
											className='w-[9rem]'
											onChange={(value: any) => {
												setSession(value);
											}}
										/>
										<Button
											className='pointer-events-none self-end'
											color={getStatusColor(status)}
										>
											{status}
										</Button>
									</div>
									<div className='flex items-end gap-3 flex-wrap'>
										<Select
											checkIconPosition='right'
											label='Add transaction item'
											placeholder='Search for fee by name'
											data={feesList}
											searchable
											allowDeselect={false}
											nothingFoundMessage='Nothing found...'
											className='w-[16rem]'
											onChange={(value: any) => {
												const found: any = sclass?.fees?.find(
													(fee: any) => fee?.id == value
												);
												setFee(found);
												setPrice(Number(found?.amount));
												setPaid(0);
											}}
										/>
										<NumberInput
											prefix='N '
											thousandSeparator
											value={price}
											min={0}
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
												min={1}
												max={price}
												hideControls
												allowDecimal={false}
												allowNegative={false}
												error={
													paid > Number(price)
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
											disabled={paid < 10}
											onClick={() => {
												const filtered = items.filter(
													(item: any) => fee?.id !== item?.item_id
												);

												setItems([
													{
														name: fee?.name,
														amount: price,
														item_id: fee?.id,
														session,
														term,
														paid,
														status: getStatus(paid, price),
														payment_method,
														teller_no,
														balance: Number(price) - Number(paid),
													},
													...filtered,
												]);

												setPaid(0);
												setPayment_method("Cash");
												setTeller_no("");
											}}
										>
											Add to list
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
											disabled={items.length < 1}
											color='teal'
											type='submit'
										>
											Complete transaction
										</Button>
									</div>
								</section>
								<section className='w-4/5'>
									<div className='flex justify-between items-center my-4 pr-12'>
										<Text fw={600}>List</Text>
										<Text fw={600}>
											Date: {new Date().toLocaleDateString()}
										</Text>
									</div>
									<ScrollArea h={400}>
										<Table verticalSpacing='sm'>
											<Table.Thead className='bg-gray-300'>
												<Table.Tr>
													<Table.Th>S/N</Table.Th>
													<Table.Th>Name</Table.Th>
													<Table.Th>Price</Table.Th>
													<Table.Th>Paid</Table.Th>
													<Table.Th>Balance</Table.Th>
													<Table.Th>Action</Table.Th>
												</Table.Tr>
											</Table.Thead>
											<Table.Tbody>
												{items?.map((titem, index) => (
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
																value={
																	Number(titem?.amount) - Number(titem?.paid)
																}
																thousandSeparator
															/>
														</Table.Td>
														<Table.Td>
															<ActionIcon
																color='red'
																onClick={() => {
																	const filtered = items?.filter((item) => {
																		return titem?.item_id !== item?.item_id;
																	});

																	setItems(filtered);
																}}
															>
																<IconX />
															</ActionIcon>
														</Table.Td>
													</Table.Tr>
												))}
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
															value={balance}
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
					</Tabs>
				) : (
					<h2 className='text-center font-semibold text-xl pt-[100px]'>
						Select a student and his/her class to make payment for
					</h2>
				)}
			</section>
		</section>
	);
};

export default MakePayments;
