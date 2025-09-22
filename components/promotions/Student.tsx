"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import {
	useFetch,
	usePost,
	useFetchSingle,
	usePostNormal,
} from "@/hooks/useQueries";
import {
	Table,
	Button,
	Drawer,
	Select,
	Checkbox,
	ScrollArea,
	ActionIcon,
} from "@mantine/core";
import { sessions } from "@/libs/sessions";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { IconX } from "@tabler/icons-react";
import { userContext } from "@/context/User";
import DataLoader from "../DataLoader";

const Student = () => {
	const { permissions } = React.useContext(userContext);

	const { handleSubmit } = useForm();
	const { fetch } = useFetch();
	const { fetch: fSingle } = useFetchSingle();
	const { post } = usePost();
	const { post: dPost, loading } = usePostNormal();
	const headers = [
		"Admission No.",
		"Student name",
		"Promoted to Session",
		"promotion from",
		"promotion to",
		"promoted On",
	];
	const [opened, { open, close }] = useDisclosure(false);
	const [selected, setSelected] = useState<any[]>([]);
	const [curr, setCurr] = useState<any>(null);
	const [term, setTerm] = useState<any>(null);

	const [selectedClass, setSelectedClass] = useState(null);
	const [session, setSession] = useState(null);
	const [classList, setClassList] = useState([]);
	const [studentList, setStudentList] = useState([]);
	const [students, setStudents] = useState([]);
	const [toClass, setToClass] = useState("");
	const [checked, setChecked] = useState(false);
	const [queryData, setQueryData] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.first_name} {row?.student?.last_name}
			</Table.Td>
			<Table.Td>
				{row?.session} - {row?.term}
			</Table.Td>
			<Table.Td>{row?.from}</Table.Td>

			<Table.Td>{row?.to?.name}</Table.Td>

			<Table.Td>{moment(row?.promotedOn).format("MMMM Do YYYY")}</Table.Td>
		</Table.Tr>
	));

	useEffect(() => {
		const getAll = async () => {
			const { data: classes } = await fetch("/classes");
			const sortedClass = classes.map((cl: any) => {
				return {
					value: cl?.id,
					label: cl?.name,
				};
			});
			setClassList(sortedClass);
		};
		getAll();
	}, []);
	useEffect(() => {
		if (checked === true) {
			setSelected(students);
		}
	}, [checked]);

	const getStudents = async (id: string) => {
		const { data } = await fSingle(`/students/${id}/byClass`);
		setStudents(data);
		const sortedStudents = data.map((s: any) => {
			return {
				value: s?.admission_no,
				label: `${s?.admission_no} - ${s?.first_name} ${s?.last_name}`,
			};
		});
		setStudentList(sortedStudents);
	};
	const onSubmit = async () => {
		selected.forEach(async (sel: any) => {
			await post(`/promotions/students`, {
				from: sel?.curr_class?.name,
				to_id: toClass,
				student_id: sel?.id,
				session,
			});
		});

		setChecked(false);
		setSelected([]);
		setSelectedClass(null);
		setToClass("");
		close();
	};
	return (
		<section className='flex flex-col gap-4 p-3 bg-white'>
			<div className='flex flex-wrap justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Students Promotions</h2>
				<div className='flex flex-wrap gap-3 items-end '>
					<DataLoader
						link='/promotions/students'
						setQueryData={setQueryData}
						showReload={true}
						post={dPost}
					/>
					<Button
						disabled={!permissions?.studentPromotions}
						onClick={() => {
							open();
						}}
						className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						Make a new promotion
					</Button>
				</div>
			</div>
			<Drawer
				opened={opened}
				onClose={() => {
					setSelected([]);
					setSelectedClass(null);
					setToClass("");
					setChecked(false);
					close();
				}}
				title='Promote student(s)'
			>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex gap-6'>
						<Select
							checkIconPosition='right'
							label='Promoted To Session'
							placeholder='Select session'
							data={sessions}
							allowDeselect={false}
							searchable
							required
							value={session}
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setSession(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							label='Promoted to Term'
							placeholder='Select term'
							data={["1st term", "2nd term", "3rd term"]}
							allowDeselect={false}
							required
							searchable
							value={term}
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setTerm(value);
							}}
						/>
					</div>
					<div className='flex gap-3 items-center'>
						<Select
							required
							checkIconPosition='right'
							label='Student(s) current class'
							placeholder='Select a class'
							data={classList}
							searchable
							allowDeselect={false}
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setSelectedClass(value);
								setChecked(false);
								getStudents(value);
							}}
						/>
						<Checkbox
							disabled={!selectedClass}
							label='All class student'
							checked={checked}
							onChange={(event) => setChecked(event.currentTarget.checked)}
						/>
					</div>
					{selectedClass && (
						<section className='space-y-4'>
							<div className='flex gap-1 items-end'>
								<Select
									checkIconPosition='right'
									label='Select student to promote'
									placeholder='Select a student'
									data={studentList}
									className='w-3/4'
									allowDeselect={false}
									searchable
									nothingFoundMessage='Nothing found...'
									onChange={(value: any) => {
										const found = students?.find(
											(student: any) => student?.admission_no == value
										);
										setCurr(found);
									}}
								/>

								<Button
									onClick={() => {
										const filterd = selected.filter(
											(s: any) => s?.admission_no !== curr?.admission_no
										);
										setSelected([curr, ...filterd]);
									}}
									leftSection='+'
									color='black'
								>
									Add
								</Button>
							</div>

							<ScrollArea h={200}>
								<Table verticalSpacing='sm'>
									<Table.Thead className='bg-gray-300'>
										<Table.Tr>
											<Table.Th>Name</Table.Th>
											<Table.Th>Admission No</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{selected?.map((item: any) => (
											<Table.Tr key={item?.id}>
												<Table.Td>
													{item?.first_name} {item?.last_name}
												</Table.Td>
												<Table.Td>{item?.admission_no}</Table.Td>

												<Table.Td>
													<ActionIcon variant='filled' color='red'>
														<IconX
															onClick={() => {
																const filtered = selected.filter(
																	(it: any) => item?.id !== it?.id
																);
																setSelected(filtered);
															}}
														/>
													</ActionIcon>
												</Table.Td>
											</Table.Tr>
										))}
									</Table.Tbody>
								</Table>
							</ScrollArea>
							<Select
								required
								checkIconPosition='right'
								label='Promoted to class'
								placeholder='Select a class'
								data={classList}
								searchable
								allowDeselect={false}
								nothingFoundMessage='Nothing found...'
								onChange={(value: any) => {
									setToClass(value);
								}}
							/>
						</section>
					)}
					<div className='flex gap-4 self-end'>
						<Button
							onClick={() => {
								setSelected([]);
								setSelectedClass(null);
								setToClass("");
								setChecked(false);
								close();
							}}
							color='black'
						>
							Cancel
						</Button>
						<Button
							disabled={!(selected.length !== 0)}
							type='submit'
							color='teal'
						>
							Promote
						</Button>
					</div>
				</form>
			</Drawer>
			<PaginatedTable
				depth='student'
				showlast={false}
				showSearch
				rows={rows}
				sortedData={sortedData}
				data={queryData}
				headers={headers}
				placeholder='Search by student name or admission no'
				setSortedData={setSortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Student;
