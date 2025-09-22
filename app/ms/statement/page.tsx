"use client";
import React from "react";
import { useFetch, usePostNormal } from "@/hooks/useQueries";
import { sessions } from "@/libs/sessions";
import { Select, Button, LoadingOverlay } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import Result from "@/components/statements/Result";
// import Outstanding from "@/components/statements/Outstanding";
import getGrade from "@/libs/getGrade";

const Statement = () => {
	const { fetch } = useFetch();
	const { post, loading } = usePostNormal();
	const [perc, setPerc] = React.useState<number>(0);
	const [statement, setStatement] = React.useState<any>("");
	const [selectedClass, setSelectedClass] = React.useState<string>("");
	const [currClass, setCurrClass] = React.useState<{
		id: string;
		name: string;
		school_section: string;
	} | null>(null);
	const [resumption, setResumption] = React.useState<any | null>(null);
	const [selectedStudent, setSelectedStudent] = React.useState<string | null>(
		null
	);
	const [student, setStudent] = React.useState<{
		id: string;
		admission_no: string;
		first_name: string;
		last_name: string;
	} | null>(null);
	const [classList, setClasslist] = React.useState<
		{ value: string; label: string }[]
	>([]);
	const [classes, setClasses] = React.useState<
		{ id: string; name: string; school_section: string }[]
	>([]);
	const [classHistory, setClassHistory] = React.useState([]);
	const [classHist, setClassHist] = React.useState([]);
	const [session, setSession] = React.useState<string>("");
	const [term, setTerm] = React.useState<string>("");
	const [docName, setDocName] = React.useState<string>("");
	const [shown, setShown] = React.useState<"init" | "result" | "outstanding">(
		"init"
	);
	React.useEffect(() => {
		async function getData() {
			const { data } = await fetch("/classes/list");

			const sortedClass: any = data?.map((cl: any) => {
				return {
					value: cl?.id,
					label: cl?.name,
				};
			});
			const sortedClassess: any = data?.map((cl: any) => {
				return {
					id: cl?.id,
					name: cl?.name,
					school_section: cl?.school_section,
				};
			});
			setClasses(sortedClassess);
			setClasslist(sortedClass);
		}
		getData();
	}, []);

	React.useEffect(() => {
		if (selectedStudent) {
			const found: any = classHist?.find(
				(hist: { student_id: string }) =>
					hist?.student_id == selectedStudent?.split("?")[0].trim()
			);
			if (found) {
				setStudent(found?.student);
			}
		}
	}, [selectedStudent]);
	const getStudent = async () => {
		const { data } = await post(
			`/statements/${selectedStudent?.split("?")[0]}/byStudent`,
			{
				session,
				term,
				classId: currClass?.id,
			}
		);
		``;
		const subs: any[] = data?.subjects;
		const results = data?.results;
		const generated: any[] = [];
		subs?.forEach((sub: any) => {
			const fca = results?.FCAResults?.find(
				(result: any) => result?.subject?.name == sub?.name
			);
			const sca = results?.SCAResults?.find(
				(result: any) => result?.subject?.name == sub?.name
			);
			const exam = results?.ExamResults?.find(
				(result: any) => result?.subject?.name == sub?.name
			);
			generated.push({
				id: sub?.id,
				name: sub?.name,
				fca: fca?.score || "-",
				sca: sca?.score || "-",
				exam: exam?.score || "-",
				total:
					Number(fca?.score) + Number(sca?.score) + Number(exam?.score) || "-",
				grade: getGrade(
					Number(fca?.score) + Number(sca?.score) + Number(exam?.score),
					currClass?.name || ""
				),
			});
		});
		setStatement({
			name: `${student?.last_name} ${student?.first_name}`,

			admission_no: student?.admission_no,
			generated: generated.sort((a, b) =>
				a?.name?.toLowerCase() < b?.name?.toLowerCase() ? -1 : 1
			),
		});
		const total = generated?.reduce((prev: number, curr: { total: number }) => {
			return Number(prev) + Number(curr.total);
		}, 0);
		const calculated = ((total / (subs.length * 100)) * 100).toFixed(2);
		setPerc(calculated !== "NaN" ? parseFloat(calculated) : 0);
		setDocName(data?.admission_no);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		getStudent();
		setShown("result");
	};
	const getClassHistory = async (classId: string | null) => {
		const { data } = await post(`/classes/${classId}/history`, { session });
		const sortedHistory: any = data?.map(({ student }: any, index: number) => {
			return {
				value: `${student?.id}?${index}`,
				label: `${student?.admission_no} - ${student?.first_name} ${student?.last_name}`,
			};
		});
		setClassHist(data);
		setClassHistory(sortedHistory);
	};
	return (
		<section className='space-y-2 p-2 px-4 pb-3 bg-white h-screen relative'>
			<header className='flex font-bold justify-between w-full'>
				<h2>Statement of result</h2>
			</header>

			<form className='flex flex-wrap gap-4 items-end' onSubmit={handleSubmit}>
				<Select
					checkIconPosition='right'
					label='Session'
					placeholder='Select session'
					data={sessions}
					allowDeselect={false}
					searchable
					required
					className='w-36'
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
					searchable
					required
					className='w-36'
					data={["1st term", "2nd term", "3rd term"]}
					allowDeselect={false}
					value={term}
					nothingFoundMessage='Nothing found...'
					onChange={(value: any) => {
						setTerm(value);
					}}
				/>
				<Select
					required
					checkIconPosition='right'
					label='Student class'
					placeholder='Select a class'
					data={classList}
					className='w-36'
					disabled={!(session && term)}
					searchable
					allowDeselect={false}
					value={selectedClass}
					nothingFoundMessage='Nothing found...'
					onChange={(value) => {
						const foundClass: any = classes.find(
							(cl: { id: string; name: string; school_section: string }) =>
								cl.id === value
						);
						setCurrClass({
							id: foundClass?.id,
							name: foundClass?.name,
							school_section: foundClass?.school_section,
						});
						setSelectedClass(value ?? "");
						setSelectedStudent(null);
						getClassHistory(value);
					}}
				/>
				<Select
					required
					className='w-80'
					checkIconPosition='right'
					label='Select a student'
					placeholder='Select a student'
					disabled={!(session && term)}
					data={classHistory}
					searchable
					allowDeselect={false}
					value={selectedStudent}
					nothingFoundMessage='Nothing found...'
					onChange={(value: string | null) => {
						setSelectedStudent(value);
					}}
				/>
				<DatePickerInput
					className='w-44'
					placeholder='resumption date'
					label='Resumption Date'
					value={resumption}
					required
					onChange={(value) => {
						setResumption(value);
					}}
				/>
				<Button type='submit' color='teal'>
					Generate
				</Button>
			</form>
			{shown == "init" && (
				<div className='text-xl flex font-semibold justify-center items-center w-full'>
					<h2>Select a student to generate statement of result for</h2>
				</div>
			)}
			{shown == "result" && (
				<Result
					session={session}
					term={term}
					selectedClass={currClass}
					selectedStudent={selectedStudent}
					statement={statement}
					resumption={resumption}
					perc={perc}
					docName={docName}
				/>
			)}

			<LoadingOverlay visible={loading} />
		</section>
	);
};

export default Statement;
