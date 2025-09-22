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
import { DatePickerInput } from "@mantine/dates";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useFetch, useEdit } from "@/hooks/useQueries";
import { useDisclosure } from "@mantine/hooks";
import { sessions } from "@/libs/sessions";

const EditStudent = () => {
	const [date_of_birth, setDOB] = useState<string | null>(null);
	const [date_of_admission, setDOA] = useState<string | null>(null);
	const [visible, { open, close }] = useDisclosure(false);
	const { edit } = useEdit();
	const [sex, setSex] = useState("");
	const [first_name, setFname] = useState("");
	const [last_name, setLname] = useState("");
	const [address, setAddrss] = useState("");
	const [state_of_origin, setStateOfOrigin] = useState("");
	const [lga, setLga] = useState("");
	const [guardian_name, setguardian_name] = useState("");
	const [guardian_telephone, setguardian_telephone] = useState("");
	const [religion, setReligion] = useState("");
	const [admission_status, setAdmission_status] = useState("");
	const [admission_term, setadmission_term] = useState("");
	const [admission_no, setadmission_no] = useState("");
	const [admission_session, setadmission_session] = useState("");
	const [admission_class, setAdmission_class] = useState("");
	const [curr_class_id, setcurr_class_id] = useState<string | null>("");
	const [section, setSection] = useState("");
	const [AclassList, setAClassList] = useState([]);
	const [classList, setClassList] = useState([]);
	const { handleSubmit } = useForm();
	const { fetch } = useFetch();
	const router = useRouter();
	const { id }: { id: string } = useParams();

	React.useEffect(() => {
		const getAll = async () => {
			const { data: classes } = await fetch("/classes");
			const { data } = await fetch(`/students/${id}`);
			const sortedClass: any = classes.map((cl: any) => {
				return {
					value: cl.id,
					label: cl.name,
				};
			});
			setClassList(sortedClass);
			const sortedAClass: any = classes.map((cl: any) => {
				return cl.name;
			});

			setAClassList(sortedAClass);
			setDOB(data?.date_of_birth);
			setDOA(data?.date_of_admission);
			setSex(data?.sex);
			setReligion(data?.religion);
			setAdmission_status(data?.admission_status);
			setAdmission_class(data?.admission_class);
			setcurr_class_id(data?.curr_class_id);
			setadmission_session(data?.admission_session);
			setadmission_term(data?.admission_term);
			setadmission_no(data?.admission_no);
			setFname(data?.first_name);
			setLname(data?.last_name);
			setAddrss(data?.address);
			setStateOfOrigin(data?.state_of_origin);
			setLga(data?.lga);
			setguardian_name(data?.guardian_name);
			setguardian_telephone(data?.guardian_telephone);
			setSection(data?.school_section);
		};
		getAll();
	}, []);
	const onSubmit = async () => {
		open();
		await edit(`/students/${id}/edit`, {
			first_name,
			last_name,
			address,
			state_of_origin,
			lga,
			guardian_name,
			guardian_telephone,
			date_of_birth,
			date_of_admission,
			sex,
			religion,
			admission_status,
			admission_term,
			admission_session,
			admission_class,
			school_section: section,
			curr_class_id,
			admission_no,
		});
		close();
	};

	return (
		<section className='space-y-6 bg-white p-4'>
			<div className='flex justify-between items-center'>
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
				<Select
					checkIconPosition='right'
					className='w-48'
					data={["Pre-nursery", "Nursery", "Primary", "JSS", "SSS"]}
					searchable
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

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
				<div className='flex gap-6 flex-wrap relative'>
					<TextInput
						className='w-42'
						label='Admission No'
						placeholder='Input admission no'
						value={admission_no}
						onChange={(e) => {
							setadmission_no(e.currentTarget.value);
						}}
					/>
					<DatePickerInput
						label='Date of admission'
						clearable
						placeholder='Pick date of employment'
						className='w-48'
						value={date_of_admission}
						defaultDate={new Date()}
						onChange={setDOA}
					/>
					<TextInput
						className='w-52'
						label='First name'
						placeholder='Input first name'
						value={first_name}
						onChange={(e) => {
							setFname(e.currentTarget.value);
						}}
					/>
					<TextInput
						className='w-52'
						label='Surname'
						placeholder='Input last name'
						value={last_name}
						onChange={(e) => {
							setLname(e.currentTarget.value);
						}}
					/>

					<DatePickerInput
						label='Date of birth'
						clearable
						placeholder='Pick date of birth'
						className='w-44'
						value={date_of_birth}
						defaultDate={new Date()}
						onChange={setDOB}
					/>
					<Select
						checkIconPosition='right'
						label='Sex'
						placeholder='Select sex'
						data={["Male", "Female"]}
						clearable
						nothingFoundMessage='Nothing found...'
						className='w-32'
						withAsterisk
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
						value={address}
						onChange={(e) => {
							setAddrss(e.currentTarget.value);
						}}
					/>

					<TextInput
						className='w-[8rem]'
						label='State of origin'
						placeholder='State of origin'
						value={state_of_origin}
						onChange={(e) => {
							setStateOfOrigin(e.currentTarget.value);
						}}
					/>
					<TextInput
						className='w-[8rem]'
						label='L.G.A'
						placeholder='L.G.A'
						value={lga}
						onChange={(e) => {
							setLga(e.currentTarget.value);
						}}
					/>
					<TextInput
						className='w-52'
						label='Guardian name'
						placeholder='Input guardian name'
						value={guardian_name}
						onChange={(e) => {
							setguardian_name(e.currentTarget.value);
						}}
					/>

					<TextInput
						className='w-[12rem]'
						label='Guardian Telephone'
						placeholder='Input telephone'
						value={guardian_telephone}
						onChange={(e) => {
							setguardian_telephone(e.currentTarget.value);
						}}
					/>

					<Select
						checkIconPosition='right'
						className='w-74'
						data={AclassList}
						searchable
						clearable
						value={admission_class}
						allowDeselect={false}
						label='Admission class'
						nothingFoundMessage='Nothing found...'
						placeholder='Pick a class'
						onChange={(value: any) => {
							setAdmission_class(value);
						}}
					/>
					<Select
						checkIconPosition='right'
						className='w-74'
						data={sessions}
						searchable
						clearable
						allowDeselect={false}
						value={admission_session}
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
						searchable
						clearable
						allowDeselect={false}
						value={admission_term}
						label='Admission term'
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
						clearable
						allowDeselect={false}
						value={curr_class_id}
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
							router.back();
						}}
					>
						Cancel
					</Button>
					<Button color='teal' type='submit'>
						Update student
					</Button>
				</Group>
				<LoadingOverlay
					visible={visible}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
				/>
			</form>
		</section>
	);
};

export default EditStudent;
