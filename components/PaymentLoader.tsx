import React from "react";
import { currSession, currTerm, sessions } from "@/libs/sessions";
import { Button, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

const PaymentLoader = ({
	link,
	setQueryData,
	showReload = false,
	post,
	loadCriteria = "Session and Term",
}: {
	link: string;
	setQueryData: any;
	showReload?: Boolean;
	post: any;
	loadCriteria?: string;
}) => {
	const [session, setSession] = React.useState<string | null>(currSession);
	const [Asession, setASession] = React.useState<string | null>(currSession);
	const [term, setTerm] = React.useState<string | null | undefined>(currTerm);
	const [dateF, setDateF] = React.useState<Date | null>(new Date());
	const [dateT, setDateT] = React.useState<Date | null>(new Date());
	const [criteria, setCriteria] = React.useState<string | null>(loadCriteria);

	const getData = async () => {
		if (criteria == "Session and Term") {
			const { data } = await post(link + "/bysessionnterm", {
				session: Asession,
				term,
			});
			setQueryData(data);
		} else if (criteria == "Session") {
			const { data } = await post(link + "/bysession", { session });
			setQueryData(data);
		} else if (criteria == "Date") {
			const { data } = await post(link + "/bydate", {
				from: dateF,
				to: dateT,
			});
			setQueryData(data);
		}
	};
	React.useEffect(() => {
		getData();
	}, [Asession, term, session, criteria, dateF, dateT]);
	return (
		<section className='flex gap-6 items-end'>
			<div className='flex items-center gap-2'>
				<Text className='font-semibold'>Load data by:</Text>
				<Select
					checkIconPosition='right'
					className='w-[11rem] pl-2'
					data={["Session", "Session and Term", "Date"]}
					allowDeselect={false}
					value={criteria}
					label='Criteria'
					placeholder='Select a criteria'
					onChange={(value: any) => {
						setCriteria(value);
					}}
				/>
				{criteria == "Session" && (
					<Select
						checkIconPosition='right'
						data={sessions}
						className='w-32'
						searchable
						allowDeselect={false}
						value={session}
						label='Session'
						nothingFoundMessage='Nothing found...'
						placeholder='Select a session'
						onChange={(value: any) => {
							setSession(value);
						}}
					/>
				)}
				{criteria == "Session and Term" && (
					<div className='flex gap-4'>
						<Select
							checkIconPosition='right'
							className='w-32'
							data={sessions}
							searchable
							allowDeselect={false}
							value={Asession}
							label='Session'
							nothingFoundMessage='Nothing found...'
							placeholder='Select a session'
							onChange={(value: any) => {
								setASession(value);
							}}
						/>
						<Select
							checkIconPosition='right'
							className='w-32'
							data={["1st term", "2nd term", "3rd term"]}
							allowDeselect={false}
							value={term}
							label='Session'
							placeholder='Select a term'
							onChange={(value: any) => {
								setTerm(value);
							}}
						/>
					</div>
				)}
				{criteria == "Date" && (
					<div className='flex gap-4'>
						<DatePickerInput
							allowDeselect={false}
							value={dateF}
							label='From'
							placeholder='Select a date from'
							onChange={(value: any) => {
								setDateF(value);
							}}
						/>
						<DatePickerInput
							allowDeselect={false}
							value={dateT}
							label='To'
							placeholder='Select a date to'
							onChange={(value: any) => {
								setDateT(value);
							}}
						/>
					</div>
				)}
			</div>
			{showReload && (
				<Button
					onClick={() => {
						getData();
					}}
				>
					Reload data
				</Button>
			)}
		</section>
	);
};

export default PaymentLoader;
