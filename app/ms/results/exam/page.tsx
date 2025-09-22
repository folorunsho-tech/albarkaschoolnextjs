"use client";
import React, { useState } from "react";
import { sessions, currTerm, currSession } from "@/libs/sessions";
import { useFetch, usePostMany } from "@/hooks/useQueries";
import { useRouter } from "next/navigation";
import {
	Select,
	ScrollArea,
	Text,
	Button,
	NumberInput,
	Table,
	ActionIcon,
	LoadingOverlay,
} from "@mantine/core";
import { IconArrowNarrowLeft, IconX } from "@tabler/icons-react";
import { userContext } from "@/context/User";
import axios from "@/config/axios";

const Exam = () => {
	const { user } = React.useContext(userContext);

	const { fetch } = useFetch();
	const { post, loading } = usePostMany();
	const router = useRouter();
	const [selectedClass, setSelectedClass] = React.useState<any | null>(null);
	const [selectedStudent, setSelectedStudent] = React.useState<any | null>(
		null
	);
	const [selectedSubject, setSelectedSubject] = React.useState<any>("");
	const [selectedStudentId, setSelectedStudentId] = React.useState<any | null>(
		null
	);
	const [session, setSession] = React.useState<any>(null);
	const [term, setTerm] = React.useState<any>(null);
	const [classList, setClassList] = React.useState<any[]>([]);
	const [studentsList, setStudentsList] = React.useState<any[]>([]);
	const [subjectsList, setSubjectsList] = React.useState<any[]>([]);
	const [score, setScore] = useState(0);
	const [selectedStudents, setSelectedStudents] = React.useState<any[]>([]);
	React.useEffect(() => {
		async function getAll() {
			const { data: classes } = await fetch("/classes");

			const sortedClass = classes.map((cl: any) => {
				return {
					value: cl?.id,
					label: cl?.name,
				};
			});
			setClassList(sortedClass);
		}
		getAll();
	}, []);
	React.useEffect(() => {
		const getSubjectsList = async () => {
			const { data } = await fetch(`/accounts/${user?.userId}/subjects`);
			setSubjectsList(data?.subjects);
		};
		getSubjectsList();
	}, [user]);
	React.useEffect(() => {
		const getStudentsList = async () => {
			const { data } = await axios.post("/students/byClassHistory", {
				session,
				class_id: selectedClass,
			});
			setStudentsList(data);
		};
		getStudentsList();
	}, [session, selectedClass]);
	return (
		<section className='p-3 bg-white min-h-72'>
			<form
				className='flex flex-col gap-4'
				onSubmit={async (e) => {
					e.preventDefault();
					const uploads = selectedStudents.map((std: any) => {
						return {
							student_id: std?.student_id,
							class_id: std?.class_id,
							subject_id: std?.subject_id,
							score: std?.score,
							session,
							term,
						};
					});
					await post("exams", uploads);

					setSelectedStudents([]);
					setSelectedStudentId(null);
					// setSelectedSubject(null);
					setScore(0);
				}}
			>
				<div>
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
							router.back();
						}}
					>
						Go back
					</Button>
				</div>
				<section className='flex flex-wrap gap-6'>
					<div className='flex gap-6'>
						<Select
							checkIconPosition='right'
							label='Session'
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
							label='Term'
							placeholder='Select term'
							data={["1st term", "2nd term", "3rd term"]}
							allowDeselect={false}
							value={term}
							searchable
							required
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setTerm(value);
							}}
						/>
					</div>
					<div>
						<Select
							required
							className='w-max'
							checkIconPosition='right'
							label='Student class'
							placeholder='Select a class'
							data={classList}
							searchable
							allowDeselect={false}
							nothingFoundMessage='Nothing found...'
							onChange={(value: any) => {
								setSelectedClass(value);

								setSelectedStudentId(null);
							}}
						/>
					</div>
				</section>

				{selectedClass && session && term ? (
					<section className='w-full'>
						<div className='flex flex-wrap items-center gap-3'>
							<Select
								checkIconPosition='right'
								label='Add result for student'
								placeholder='Select student to add'
								data={studentsList.map(({ student }, index: number) => {
									return {
										value: `${student?.admission_no}-${index}`,
										label: `${student?.last_name} ${student?.first_name} - ${student?.admission_no}`,
									};
								})}
								searchable
								nothingFoundMessage='Nothing found...'
								value={selectedStudentId}
								className='w-[24rem]'
								onChange={(value: any) => {
									setSelectedStudentId(value);
									const splited: any = value?.split("-")[0];
									const found: any = studentsList.find(
										({ student }: any) => student?.admission_no == splited
									)?.student;
									setSelectedStudent(found);
								}}
							/>
							<Select
								checkIconPosition='right'
								label='Select result subject'
								placeholder='Select subject to add'
								data={subjectsList?.map((sub: any) => {
									return {
										value: sub?.id,
										label: sub?.name,
									};
								})}
								searchable
								nothingFoundMessage='Nothing found...'
								className='w-[20rem]'
								onChange={(value: any) => {
									setSelectedSubject(value);
								}}
							/>
							<NumberInput
								label='Score'
								min={0}
								max={70}
								value={score}
								className='w-[5rem]'
								onChange={(value: any) => {
									setScore(value);
								}}
							/>
							<Button
								color='black'
								className='self-end'
								disabled={!(selectedStudent && selectedSubject)}
								onClick={() => {
									const selId = `${selectedStudent?.admission_no}-${selectedSubject}`;
									const filtered: any = selectedStudents.filter(
										(sel: any) => sel?.id != selId
									);
									const subject = subjectsList.find(
										(sub: any) => sub?.id == selectedSubject
									);

									setSelectedStudents([
										{
											id: selId,
											student_id: selectedStudent?.id,
											admission_no: selectedStudent?.admission_no,
											student_name: `${selectedStudent?.last_name} ${selectedStudent?.first_name}`,
											subject_id: selectedSubject,
											subject: subject?.name,
											class_id: selectedClass,
											score,
										},
										...filtered,
									]);
								}}
							>
								Add result
							</Button>
						</div>
						<div className='flex justify-between items-center my-4 pr-12'>
							<Text fw={600}>Students result</Text>
						</div>
						<ScrollArea h={400}>
							<Table verticalSpacing='sm'>
								<Table.Thead className='bg-gray-300'>
									<Table.Tr>
										<Table.Th>Admission No</Table.Th>
										<Table.Th>Student's name</Table.Th>
										<Table.Th>Subject</Table.Th>
										<Table.Th>Score</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{selectedStudents?.map((student, index) => (
										<Table.Tr key={student?.id + index}>
											<Table.Td>{student?.admission_no}</Table.Td>
											<Table.Td>{student?.student_name}</Table.Td>
											<Table.Td>{student?.subject}</Table.Td>
											<Table.Td>{student?.score}</Table.Td>
											<Table.Td>
												<ActionIcon variant='filled' color='red'>
													<IconX
														onClick={() => {
															const filtered = selectedStudents.filter(
																(it: any) => student?.id !== it?.id
															);
															setSelectedStudents(filtered);
														}}
													/>
												</ActionIcon>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</ScrollArea>
						<div className='flex items-end gap-6'>
							<Button
								onClick={() => {
									router.back();
								}}
								color='black'
							>
								Cancel
							</Button>
							<Button
								color='teal'
								disabled={selectedStudents.length < 1}
								type='submit'
							>
								Upload result
							</Button>
						</div>
					</section>
				) : (
					<div className='flex items-center justify-center text-xl font-semibold mt-8'>
						<h2>
							Select current session and term and student's class to add result
						</h2>
					</div>
				)}
			</form>
			<LoadingOverlay visible={loading} />
		</section>
	);
};
export default Exam;
