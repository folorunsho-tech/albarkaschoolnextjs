"use client";
import { useState, useContext, useEffect } from "react";
import {
	TextInput,
	PasswordInput,
	Button,
	Checkbox,
	Select,
	MultiSelect,
} from "@mantine/core";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useFetch, usePost } from "@/hooks/useQueries";
import { userContext } from "@/context/User";
const Create = () => {
	const { fetch } = useFetch();
	const { user } = useContext(userContext);
	const { post, loading } = usePost();
	const [students, setStudents] = useState({
		view: false,
		create: false,
		edit: false,
	});
	const [results, setResults] = useState({
		view: false,
		create: false,
		edit: false,
	});
	const [payments, setPayments] = useState({
		view: false,
		create: false,
		edit: false,
	});
	const [classes, setClasses] = useState({
		view: false,
		edit: false,
	});
	const [accounts, setAccounts] = useState(false);
	const [studentPromotions, setStudentPromotions] = useState(false);
	const [statement, setStatement] = useState(false);
	const [role, setRole] = useState<"user" | "admin" | "editor">("user");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [subjects, setSubjects] = useState<string[]>([]);
	const [allSubjects, setAllSubjects] = useState<
		{ value: string; label: string }[]
	>([]);
	const { handleSubmit } = useForm();
	const router = useRouter();
	const onSubmit = async () => {
		await post("/accounts/create", {
			username,
			password,
			role,
			permissions: {
				accounts,
				statement,
				studentPromotions,
				classes,
				students,
				results,
				payments,
			},
			subjects: subjects.map((sub) => {
				return {
					id: sub,
				};
			}),
		});

		setAccounts(false);
		setStatement(false);
		setStudentPromotions(false);
		setClasses({
			view: false,

			edit: false,
		});
		setStudents({
			view: false,
			create: false,
			edit: false,
		});
		setResults({
			view: false,
			create: false,
			edit: false,
		});
		setPayments({
			view: false,
			create: false,
			edit: false,
		});
		setUsername("");
		setPassword("");
		setRole("user");
	};
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const { data } = await fetch("/subjects");
				const sorted = data.map((subject: { id: string; name: string }) => {
					return { value: subject.id, label: subject.name };
				});
				setAllSubjects(sorted);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchSubjects();
	}, []);
	return (
		<section className='flex flex-col gap-4 relative p-3 bg-white'>
			<div className='flex gap-10 items-center'>
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
				<h2 className='font-bold text-xl text-blue-700'>Create account</h2>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='relative'>
				<section className='flex flex-col gap-6'>
					{user?.role == "admin" && (
						<Select
							className='w-80'
							checkIconPosition='right'
							label='Select account role'
							placeholder='Select a role'
							data={["admin", "user"]}
							value={role}
							allowDeselect={false}
							onChange={(value: any) => {
								setRole(value);
							}}
						/>
					)}

					<TextInput
						label='Username'
						placeholder='username...'
						className='w-80'
						value={username}
						onChange={(e) => {
							setUsername(e.currentTarget.value);
						}}
					/>
					<PasswordInput
						label='Password'
						placeholder='Your password'
						className='w-80'
						value={password}
						onChange={(e) => {
							setPassword(e.currentTarget.value);
						}}
					/>
					<section>
						<h2 className='text-md font-semibold mb-3'>Select subjects:</h2>
						<Checkbox
							label='Select All Subjects'
							className='mb-4 cursor-pointer'
							checked={subjects.length === allSubjects.length}
							onChange={(e) => {
								e.currentTarget.checked
									? setSubjects(allSubjects.map((subject) => subject.value))
									: setSubjects([]);
							}}
						/>
						<MultiSelect
							data={allSubjects}
							placeholder='Select subjects'
							value={subjects}
							onChange={setSubjects}
							className='w-1/2'
							clearable
							searchable
							nothingFoundMessage='No subject found'
							maxDropdownHeight={160}
						/>
					</section>
					<section className='space-y-2 mb-3'>
						<h2 className='text-md font-semibold'>Permissions:</h2>
						<div className='flex flex-wrap gap-4'>
							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={accounts}
										onChange={() => setAccounts(!accounts)}
									/>
									<h3 className='text-sm font-semibold'>Accounts</h3>
								</span>
							</div>

							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={studentPromotions}
										onChange={() => setStudentPromotions(!studentPromotions)}
									/>
									<h3 className='text-sm font-semibold'>Students Promotions</h3>
								</span>
							</div>

							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={statement}
										onChange={() => setStatement(!statement)}
									/>
									<h3 className='text-sm font-semibold'>
										Statement of results
									</h3>
								</span>
							</div>

							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={classes.view && classes.edit}
										onChange={() => {
											setClasses({
												view: !classes.view,

												edit: !classes.edit,
											});
										}}
									/>
									<h3 className='text-sm font-semibold'>Classes</h3>
								</span>

								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={classes.edit}
										onChange={() =>
											setClasses((prev) => ({ ...prev, edit: !prev.edit }))
										}
									/>
									<h3 className='text-sm font-semibold'>Edit</h3>
								</span>
							</div>
							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={students.view && students.create && students.edit}
										onChange={() => {
											setStudents({
												view: !students.view,
												create: !students.create,
												edit: !students.edit,
											});
										}}
									/>
									<h3 className='text-sm font-semibold'>Students</h3>
								</span>

								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={students.create}
										onChange={() =>
											setStudents((prev) => ({
												...prev,
												create: !prev.create,
											}))
										}
									/>
									<h3 className='text-sm font-semibold'>Create</h3>
								</span>
								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={students.edit}
										onChange={() =>
											setStudents((prev) => ({ ...prev, edit: !prev.edit }))
										}
									/>
									<h3 className='text-sm font-semibold'>Edit</h3>
								</span>
							</div>
							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={results.view && results.create && results.edit}
										onChange={() => {
											setResults({
												view: !results.view,
												create: !results.create,
												edit: !results.edit,
											});
										}}
									/>
									<h3 className='text-sm font-semibold'>Results</h3>
								</span>

								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={results.create}
										onChange={() =>
											setResults((prev) => ({
												...prev,
												create: !prev.create,
											}))
										}
									/>
									<h3 className='text-sm font-semibold'>Create</h3>
								</span>
								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={results.edit}
										onChange={() =>
											setResults((prev) => ({ ...prev, edit: !prev.edit }))
										}
									/>
									<h3 className='text-sm font-semibold'>Edit</h3>
								</span>
							</div>

							<div className='space-y-2'>
								<span className='flex gap-2'>
									<Checkbox
										checked={payments.view && payments.create && payments.edit}
										onChange={() => {
											setPayments({
												view: !payments.view,
												create: !payments.create,
												edit: !payments.edit,
											});
										}}
									/>
									<h3 className='text-sm font-semibold'>Payments</h3>
								</span>

								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={payments.create}
										onChange={() =>
											setPayments((prev) => ({
												...prev,
												create: !prev.create,
											}))
										}
									/>
									<h3 className='text-sm font-semibold'>Create</h3>
								</span>
								<span className='flex gap-2 ml-4'>
									<Checkbox
										checked={payments.edit}
										onChange={() =>
											setPayments((prev) => ({ ...prev, edit: !prev.edit }))
										}
									/>
									<h3 className='text-sm font-semibold'>Edit</h3>
								</span>
							</div>
						</div>
					</section>
				</section>
				<div className='flex items-center gap-6 mt-5 '>
					<Button
						onClick={() => {
							router.back();
						}}
						color='black'
					>
						Cancel
					</Button>
					<Button color='teal' type='submit'>
						Create account
					</Button>
				</div>
			</form>
			<LoadingOverlay visible={loading} />
		</section>
	);
};

export default Create;
