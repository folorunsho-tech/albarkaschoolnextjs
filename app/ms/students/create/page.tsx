"use client";
import {
	Button,
	TextInput,
	Group,
	Select,
	LoadingOverlay,
} from "@mantine/core";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import React, { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useFetch, usePost } from "@/hooks/useQueries";
import { useDisclosure } from "@mantine/hooks";
import { sessions } from "@/libs/sessions";

const CreateStudent = () => {
	const { post } = usePost();
	const [date_of_birth, setDOB] = useState<string | null>(null);
	const [date_of_admission, setDOA] = useState<null | string>(null);
	const [visible, { open, close }] = useDisclosure(false);
	const [sex, setSex] = useState<string | null>(null);
	const [religion, setReligion] = useState<string | null>(null);
	const [admission_term, setadmission_term] = useState<string | null>(null);
	const [curr_session, setCurr_session] = useState<string | null>(null);
	const [admission_session, setadmission_session] = useState<string | null>(
		null
	);
	const [admission_class, setAdmission_class] = useState<string | null>(null);
	const [curr_class_id, setcurr_class_id] = useState<string | null>(null);
	const [classList, setClassList] = useState([]);
	const [AclassList, setAClassList] = useState([]);
	const [section, setSection] = useState(null);
	const { register, handleSubmit, reset } = useForm();
	const { fetch } = useFetch();
	const router = useRouter();
	React.useEffect(() => {
		const getAll = async () => {
			const { data: classes } = await fetch("/classes");
			const sortedClass: any = classes.map((cl: any) => {
				return {
					value: cl.id,
					label: cl.name,
				};
			});
			const sortedAClass: any = classes.map((cl: any) => {
				return cl.name;
			});
			setClassList(sortedClass);
			setAClassList(sortedAClass);
		};
		getAll();
	}, []);
	const onSubmit = async (values: any) => {
		open();
		await post("/students", {
			...values,
			date_of_birth,
			date_of_admission,
			sex,
			religion,
			admission_term,
			admission_session,
			admission_class,
			curr_class_id,
			school_section: section,
			curr_session,
		});
		reset();
		close();
	};

	return (
		<section className='space-y-6 bg-white p-4'>
			<div className='flex flex-wrap gap-2 justify-between items-center'>
				<Button
					leftSection={<IconArrowNarrowLeft size={25} />}
					onClick={() => {
						router.push("/ms/students");
					}}
				>
					Go back
				</Button>
				<div className='flex flex-wrap items-end gap-5'>
					<Select
						checkIconPosition='right'
						className='w-36'
						data={sessions}
						searchable
						required
						withAsterisk
						allowDeselect={false}
						value={curr_session}
						label='Current session'
						nothingFoundMessage='Nothing found...'
						placeholder='Pick a session'
						onChange={(value: any) => {
							setCurr_session(value);
						}}
					/>
					<Select
						checkIconPosition='right'
						className='w-48'
						data={["Pre-nursery", "Nursery", "Primary", "JSS", "SSS"]}
						searchable
						required
						withAsterisk
						allowDeselect={false}
						value={section}
						label='School section'
						nothingFoundMessage='Nothing found...'
						placeholder='Pick a school section'
						onChange={(value: any) => {
							setSection(value);
						}}
					/>
				</div>
			</div>
			{section && curr_session ? (
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
					<div className='flex gap-6 flex-wrap relative'>
						<TextInput
							className='w-42'
							label='Admission No'
							placeholder='Input admission no'
							required
							{...register("admission_no")}
						/>
						<DateInput
							label='Date of admission'
							clearable
							placeholder='Pick date of admission'
							className='w-48'
							value={date_of_admission}
							defaultDate={new Date()}
							onChange={setDOA}
						/>
						<TextInput
							className='w-52'
							label='First name'
							placeholder='Input first name'
							required
							{...register("first_name")}
						/>
						<TextInput
							className='w-52'
							label='Surname'
							placeholder='Input last name'
							required
							{...register("last_name")}
						/>

						<DateInput
							label='Date of birth'
							clearable
							placeholder='Pick date of birth'
							className='w-44'
							defaultDate={new Date()}
							value={date_of_birth}
							onChange={setDOB}
						/>
						<Select
							checkIconPosition='right'
							label='Sex'
							placeholder='Select sex'
							data={["Male", "Female"]}
							required
							withAsterisk
							searchable
							nothingFoundMessage='Nothing found...'
							className='w-32'
							value={sex}
							onChange={(value: any) => {
								setSex(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							label='Religion'
							placeholder='Select religion'
							data={["Islam", "Christianity", "Others"]}
							clearable
							value={religion}
							searchable
							nothingFoundMessage='Nothing found...'
							className='w-36'
							onChange={(value: any) => {
								setReligion(value);
							}}
						/>

						<TextInput
							className='w-[29.8rem]'
							label='Address'
							placeholder='Input address'
							{...register("address")}
						/>

						<TextInput
							className='w-[8rem]'
							label='State of origin'
							placeholder='State of origin'
							{...register("state_of_origin")}
						/>
						<TextInput
							className='w-[8rem]'
							label='L.G.A'
							placeholder='L.G.A'
							{...register("lga")}
						/>
						<TextInput
							className='w-52'
							label='Guardian name'
							placeholder='Input guardian name'
							{...register("guardian_name")}
						/>

						<TextInput
							className='w-[12rem]'
							label='Guardian Telephone'
							placeholder='Input telephone'
							{...register("guardian_telephone")}
						/>

						<Select
							checkIconPosition='right'
							className='w-74'
							data={AclassList}
							searchable
							value={admission_class}
							// allowDeselect={false}
							label='Admission class'
							nothingFoundMessage='Nothing found...'
							placeholder='Pick a class'
							onChange={(value: any) => {
								setAdmission_class(value);
								const found: any = classList.find((cl: any) =>
									cl.label.includes(value)
								);
								setcurr_class_id(found?.value);
							}}
						/>
						<Select
							checkIconPosition='right'
							className='w-74'
							data={sessions}
							searchable
							allowDeselect={false}
							value={admission_session || curr_session}
							required
							label='Admission session'
							nothingFoundMessage='Nothing found...'
							placeholder='Pick a session'
							onChange={(value: any) => {
								setadmission_session(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							className='w-74'
							data={["1st term", "2nd term", "3rd term"]}
							allowDeselect={false}
							value={admission_term}
							label='Admission term'
							required
							searchable
							withAsterisk
							nothingFoundMessage='Nothing found...'
							placeholder='Pick a term'
							onChange={(value: any) => {
								setadmission_term(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							className='w-74'
							data={classList}
							searchable
							required
							withAsterisk
							allowDeselect={false}
							value={curr_class_id}
							// clearable
							label='Current class'
							nothingFoundMessage='Nothing found...'
							placeholder='Pick a class'
							onChange={(value: any) => {
								setcurr_class_id(value);
							}}
						/>
					</div>
					<Group>
						<Button
							onClick={() => {
								router.push("/ms/students");
							}}
						>
							Cancel
						</Button>
						<Button color='teal' type='submit'>
							Add student
						</Button>
					</Group>
					<LoadingOverlay
						visible={visible}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
					/>
				</form>
			) : (
				<div className='flex justify-center items-center h-52 font-bold text-xl'>
					<h2>Choose current session and a school section to add student to</h2>
				</div>
			)}
		</section>
	);
};

export default CreateStudent;
