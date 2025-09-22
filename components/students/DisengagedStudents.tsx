"use client";
import React, { useEffect, useState, useRef } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import {
	usePostNormal,
	useFetch,
	useFetchSingle,
	usePost,
} from "@/hooks/useQueries";
import {
	Table,
	Button,
	Drawer,
	Select,
	TextInput,
	LoadingOverlay,
	ActionIcon,
	ScrollArea,
	Checkbox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { useForm } from "react-hook-form";
import { sessions } from "@/libs/sessions";
import { IconEye, IconPrinter, IconX } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import DStudentsFilter from "../filters/DStudentsFilter";
import Link from "next/link";
import PrintHeader from "../PrintHeader";

import { userContext } from "@/context/User";
import DataLoader from "../DataLoader";
const DisengagedStudents = () => {
	const { permissions } = React.useContext(userContext);

	const permission = permissions?.students;
	const { fetch } = useFetch();
	const { post: dPost, loading } = usePostNormal();

	const { fetch: fSingle } = useFetchSingle();
	const { loading: pLoading, post } = usePost();
	const [opened, { open, close }] = useDisclosure(false);
	const [pOpened, { open: pOpen, close: pClose }] = useDisclosure(false);
	const [selected, setSelected] = useState<any[]>([]);
	const [curr, setCurr] = useState<any>({});
	const [selectedClass, setSelectedClass] = useState("");
	const [method, setMethod] = useState("");
	const [session, setSession] = useState(null);
	const [term, setTerm] = useState<any>(null);
	const [classList, setClassList] = useState([]);
	const [studentList, setStudentList] = useState([]);
	const [students, setStudents] = useState([]);
	const headers = [
		"admission no",
		"name",
		"class",
		"session",
		"term",
		"method",
		"reason",
		"comment",
		"dis date",
	];
	const [checked, setChecked] = useState(false);
	const [queryData, setQueryData] = useState([]);
	const [sortedData, setSortedData] = useState([]);

	const { register, reset, handleSubmit } = useForm();
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.student?.id + index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.first_name} {row?.student?.last_name}
			</Table.Td>
			<Table.Td>{row?.student?.curr_class?.name}</Table.Td>
			<Table.Td>{row?.session}</Table.Td>
			<Table.Td>{row?.term}</Table.Td>
			<Table.Td>{row?.method_of_disengagement}</Table.Td>
			<Table.Td>{row?.reason}</Table.Td>
			<Table.Td>{row?.comment}</Table.Td>
			<Table.Td>
				{moment(row?.date_of_disengagement).format("MMMM Do YYYY")}
			</Table.Td>
			<Table.Td className='flex items-center gap-3 '>
				<ActionIcon variant='outline' aria-label='action menu'>
					<Link
						href={`students/view/${row?.student?.id}`}
						className='flex justify-center'
					>
						<IconEye style={{ width: "70%", height: "70%" }} stroke={2} />
					</Link>
				</ActionIcon>
			</Table.Td>
		</Table.Tr>
	));

	const contentRef = useRef<HTMLTableElement>(null);
	const reactToPrintFn: any = useReactToPrint({ contentRef });
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
	const onSubmit = async (data: any) => {
		selected.forEach(async (sel: any) => {
			await post(`/disengagements/students`, {
				...data,
				method_of_disengagement: method,
				student_id: sel?.id,
				session,
				term,
			});
		});
		setChecked(false);
		setSelected([]);
		setSelectedClass("");
		reset();
	};
	return (
		<section className='flex flex-col gap-4 p-4 bg-white'>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Disengaged Students</h2>
				<div className='flex flex-wrap gap-3 items-center'>
					<DataLoader
						link='/disengagements/students'
						setQueryData={setQueryData}
						showReload={true}
						loadCriteria='Session'
						post={dPost}
					/>
					<Button
						leftSection={<IconPrinter />}
						onClick={() => {
							pOpen();
						}}
						className='bg-indigo-500 text-white hover:bg-indigo-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						Print
					</Button>
					<Button
						disabled={!permission?.create}
						onClick={() => {
							open();
						}}
						color='red'
					>
						Disengage Student(s)
					</Button>
				</div>
			</div>
			<DStudentsFilter
				setQueryData={setQueryData}
				setSortedData={setSortedData}
				sortedData={sortedData}
				queryData={queryData}
			/>
			<Drawer
				opened={opened}
				onClose={() => {
					close();
					setSelected([]);
					setSelectedClass("");
					setMethod("");
					setChecked(false);
					reset();
				}}
				title='Disengage student(s)'
			>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex gap-6'>
						<Select
							checkIconPosition='right'
							label='Current Session'
							placeholder='Select session'
							data={sessions}
							allowDeselect={false}
							required
							withAsterisk
							searchable
							value={session}
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setSession(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							label='Current Term'
							required
							withAsterisk
							searchable
							placeholder='Select term'
							data={["1st term", "2nd term", "3rd term"]}
							allowDeselect={false}
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
							label="Student's current class"
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
							disabled={selectedClass == ""}
							label='All class student'
							checked={checked}
							onChange={(event) => setChecked(event.currentTarget.checked)}
						/>
					</div>
					{selectedClass !== "" && (
						<section className='space-y-4'>
							<div className='flex gap-1 items-end'>
								<Select
									checkIconPosition='right'
									label='Select student to disengage'
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
									disabled={studentList.length == 0}
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

							<section className='space-y-4'>
								<Select
									required
									checkIconPosition='right'
									label='Method of disengagement'
									placeholder='Select a method'
									allowDeselect={false}
									data={[
										"Graduated",
										"Left un-announced",
										"Left for another school",
										"Rustication",
										"Relocation",
									]}
									searchable
									nothingFoundMessage='Nothing found...'
									onChange={(value: any) => {
										setMethod(value);
									}}
								/>
								{method === "Rustication" && (
									<TextInput
										label='Rustication reason'
										{...register("reason")}
									/>
								)}
								<TextInput label='Comment' {...register("comment")} />
							</section>
						</section>
					)}
					<div className='flex gap-4 self-end'>
						<Button
							onClick={() => {
								close();
								setSelected([]);
								setSelectedClass("");
								setMethod("");
								setChecked(false);
								reset();
							}}
							color='black'
						>
							Cancel
						</Button>
						<Button disabled={selected.length === 0} type='submit' color='red'>
							Disengage
						</Button>
					</div>
				</form>
				<LoadingOverlay visible={pLoading} />
			</Drawer>
			<PaginatedTable
				depth='curr_class'
				showlast={true}
				showSearch
				rows={rows}
				data={queryData}
				headers={headers}
				placeholder='Search by admission no or name'
				setSortedData={setSortedData}
				loading={loading}
				sortedData={sortedData}
			/>
			<Drawer
				opened={pOpened}
				onClose={() => {
					pClose();
				}}
				title='Print students'
				size='100%'
			>
				<div className='flex gap-4'>
					<Button
						onClick={reactToPrintFn}
						className=' mb-2 bg-indigo-500 text-white hover:bg-indigo-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						<IconPrinter />
					</Button>
				</div>
				<section ref={contentRef}>
					<PrintHeader />
					<ScrollArea>
						<table className='printable'>
							<thead>
								<tr>
									{[
										"S/N",
										"admission no",
										"name",
										"class",
										"session",
										"term",
										"method",
										"reason",
										"comment",
										"dis date",
									].map((head) => (
										<th key={head}>{head}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{sortedData?.map((row: any, index: number) => (
									<tr key={row?.student?.admission_no + index}>
										<td>{index + 1}</td>
										<td>{row?.student?.admission_no}</td>
										<td>
											{row?.student?.first_name} {row?.student?.last_name}
										</td>

										<td>{row?.student?.curr_class?.name}</td>

										<td>{row?.session}</td>
										<td>{row?.term}</td>
										<td>{row?.method_of_disengagement}</td>
										<td>{row?.reason}</td>
										<td>{row?.comment}</td>
										<td>
											{moment(row?.date_of_disengagement).calendar(
												"MMMM Do YYYY"
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</ScrollArea>
				</section>
			</Drawer>
		</section>
	);
};

export default DisengagedStudents;
