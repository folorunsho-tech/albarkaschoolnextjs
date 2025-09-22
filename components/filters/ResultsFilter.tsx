import { useFetch } from "@/hooks/useQueries";
import chunk from "@/libs/chunk";
import React, { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Button, ScrollArea, Select } from "@mantine/core";

const ResultsFilter = ({
	setFilterCount,
	setSortedData,
	queryData,
	sortedData,
	resultType = "fca",
}: {
	setFilterCount: any;
	setSortedData: any;
	queryData: any;
	sortedData: any;
	resultType: string;
}) => {
	const classList = [
		"Pre-nursery",
		"Nursery 1",
		"Nursery 2",
		"Primary 1",
		"Primary 2",
		"Primary 3",
		"Primary 4",
		"Primary 5",
		"JSS 1",
		"JSS 2",
		"JSS 3",
		"SSS 1",
		"SSS 2",
		"SSS 3",
	];
	const { fetch } = useFetch();
	const [criteria, setCriteria] = useState<string | null>("");
	const [value, setValue] = useState<string | null>("");
	const [filters, setFilters] = useState<any[]>([]);
	const [subjectsList, setSubjectsList] = useState([]);
	const filterValue = (criteria: any) => {
		if (criteria == "Term") {
			return (
				<Select
					checkIconPosition='right'
					className=' pl-2'
					data={["1st term", "2nd term", "3rd term"]}
					searchable
					allowDeselect={false}
					value={value}
					label='Term'
					nothingFoundMessage='Nothing found...'
					placeholder='Select a term'
					onChange={(value: any) => {
						setValue(value);
					}}
				/>
			);
		} else if (criteria == "Class") {
			return (
				<Select
					checkIconPosition='right'
					className=' pl-2'
					data={classList}
					searchable
					allowDeselect={false}
					value={value}
					label='Class'
					nothingFoundMessage='Nothing found...'
					placeholder='Select a class'
					onChange={(value: any) => {
						setValue(value);
					}}
				/>
			);
		} else if (criteria == "Subject") {
			return (
				<Select
					checkIconPosition='right'
					className=' pl-2'
					data={subjectsList}
					searchable
					allowDeselect={false}
					value={value}
					label='Subject'
					nothingFoundMessage='Nothing found...'
					placeholder='Select a subject'
					onChange={(value: any) => {
						setValue(value);
					}}
				/>
			);
		}
	};
	const filterFunc = (criteria: any, value: any) => {
		if (criteria == "Class") {
			const filteredClass = sortedData?.filter(
				(fil: any) => fil?.class?.name == value
			);
			return filteredClass;
		} else if (criteria == "Subject") {
			const filteredSubs = sortedData?.filter(
				(fil: any) => fil?.subject?.name == value
			);
			return filteredSubs;
		} else if (criteria == "Term") {
			const filteredTerm = sortedData?.filter((fil: any) => fil?.term == value);
			return filteredTerm;
		}
	};
	useEffect(() => {
		async function getSubjects() {
			const { data } = await fetch("/subjects");
			const sortedSubjects = data?.map((sub: any) => {
				return sub?.name;
			});
			setSubjectsList(sortedSubjects);
		}
		getSubjects();
	}, []);
	useEffect(() => {
		if (filters.length !== 0) {
			let result: any[] = [];
			filters?.forEach(({ criteria, value }: any) => {
				const filterF = filterFunc(criteria, value);
				result.push(filterF);
			});
			if (result !== undefined || result !== null) {
				const paginated = chunk(result[0], 50);
				setSortedData(paginated[0]);
			}
		}
		setFilterCount(filters?.length);
	}, [filters]);
	return (
		<ScrollArea h={100}>
			<section className='flex flex-col gap-2 '>
				<form
					className='self-end flex  items-center gap-4 '
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className='flex flex-wrap items-center gap-3'>
						<Button disabled className='self-end'>
							Where:{" "}
						</Button>
						<Select
							checkIconPosition='right'
							className='pl-2'
							data={["Term", "Class", "Subject"]}
							searchable
							allowDeselect={false}
							value={criteria}
							label='Criteria'
							nothingFoundMessage='Nothing found...'
							placeholder='Select a filter criteria'
							onChange={(value: any) => {
								setCriteria(value);
								filterValue(value);
								setValue(null);
							}}
						/>
						<Button disabled className='self-end'>
							equals{" "}
						</Button>
						{filterValue(criteria)}
						<Button
							disabled={!(criteria && value)}
							onClick={() => {
								setFilters([
									{
										criteria,
										value,
										id: `Filt-${Math.round(Math.random() * 10000)}`,
									},
									...filters,
								]);
							}}
							className='self-end'
							type='submit'
						>
							Add Filter
						</Button>
						<Button
							className='self-end'
							onClick={() => {
								setFilters([]);
								setCriteria(null);
								setValue(null);

								const paginated = chunk(queryData, 50);
								setSortedData(paginated[0]);
							}}
							color='red'
							leftSection={<IconX />}
						>
							Clear filters
						</Button>
					</div>
				</form>
				<section className='flex gap-2'>
					{filters?.map((filter: any, index: number) => (
						<div
							key={filter?.criteria + index}
							className='flex gap-2 items-center'
						>
							<span className='p-1 rounded text-sm bg-gray-400'>
								{filter?.criteria}
							</span>
							=
							<span className='p-1 rounded text-sm bg-gray-400'>
								{filter?.value}
							</span>
							<ActionIcon
								variant='outline'
								color='red'
								aria-label='action menu'
								onClick={() => {
									const found = filters?.filter(
										(fil: any) => fil?.id !== filter?.id
									);
									setSortedData(queryData);
									setFilters(found);
								}}
							>
								<IconX style={{ width: "70%", height: "70%" }} stroke={2} />
							</ActionIcon>
						</div>
					))}
				</section>
			</section>
		</ScrollArea>
	);
};

export default ResultsFilter;
