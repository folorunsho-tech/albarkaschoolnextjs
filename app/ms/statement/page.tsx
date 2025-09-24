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
	const { post } = usePostNormal();
	const [perc, setPerc] = React.useState<number>(0);
	const [statement, setStatement] = React.useState<any>("");
	const [selectedClass, setSelectedClass] = React.useState<string>("");
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
				classId: selectedClass,
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
				fca: fca?.score || null,
				sca: sca?.score || null,
				exam: exam?.score || null,
				total:
					Number(fca?.score) + Number(sca?.score) + Number(exam?.score) || null,
				grade: getGrade(
					Number(fca?.score) + Number(sca?.score) + Number(exam?.score),
					data?.className || ""
				),
			});
		});
		setStatement({
			name: `${student?.last_name} ${student?.first_name}`,
			term: data?.term,
			session: data?.session,
			admission_no: student?.admission_no,
			className: data?.className,
			school_section: data?.school_section,
			generated: generated.sort((a, b) =>
				a?.name?.toLowerCase() < b?.name?.toLowerCase() ? -1 : 1
			),
		});
		const total = generated?.reduce((prev: number, curr: { total: number }) => {
			return Number(prev) + Number(curr.total);
		}, 0);
		const validSubs = generated?.filter((sub) => sub.total !== null);
		const calculated = ((total / (validSubs.length * 100)) * 100).toFixed(2);
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
				label: `${student?.admission_no} - ${student?.last_name} ${student?.first_name} `,
			};
		});
		setClassHist(data);
		setClassHistory(sortedHistory);
	};

	React.useEffect(() => {
		if (selectedClass) {
			getClassHistory(selectedClass);
		}
	}, [selectedClass, session, term]);
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
						setSelectedStudent(null);
						setSelectedClass(value || "");
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
					selectedStudent={selectedStudent}
					statement={statement}
					resumption={resumption}
					perc={perc}
					docName={docName}
				/>
			)}
		</section>
	);
};

export default Statement;
