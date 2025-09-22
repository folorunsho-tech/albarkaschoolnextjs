import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useQueries";
import { IconFilter, IconX } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { Button, Select, Accordion, Text } from "@mantine/core";
import chunk from "@/libs/chunk";
const DStudentsFilter = ({
	setQueryData,
	setSortedData,
	sortedData,
	queryData,
}: {
	setQueryData: any;
	setSortedData: any;
	sortedData: any;
	queryData: any;
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
	const [filterClass, setFilterClass] = useState("");
	const [filterAClass, setFilterAClass] = useState("");
	const [filterCondition, setFilterCondition] = useState("NONE");

	const filterF = async (filterData: any, condition: string) => {
		if (condition === "OR") {
			const ORfiltered: any[] = filterData?.filter(
				(fil: any) =>
					fil?.student?.curr_class?.name == filterClass ||
					fil?.student?.admission_class == filterAClass
			);

			const paginated = chunk(ORfiltered, 50);
			setSortedData(paginated[0]);
		} else if (condition === "AND") {
			const ANDfiltered = filterData?.filter(
				(fil: any) =>
					fil?.student?.curr_class?.name == filterClass &&
					fil?.student?.admission_class == filterAClass
			);

			const paginated = chunk(ANDfiltered, 50);
			setSortedData(paginated[0]);
		} else {
			const { data } = await fetch("/disengagements/students");
			setQueryData(data);
			const paginated = chunk(data, 50);
			setSortedData(paginated[0]);
		}
	};
	return (
		<section className='flex justify-between gap-2 w-full my-3'>
			<Accordion variant='contained' className='w-3/5'>
				<Accordion.Item value='filter'>
					<Accordion.Control icon={<IconFilter />}>Filter</Accordion.Control>
					<Accordion.Panel>
						<form
							className='flex items-center gap-4 '
							onSubmit={(e) => {
								e.preventDefault();
								filterF(queryData, filterCondition);
							}}
						>
							<div className='flex flex-wrap items-end gap-3 divide-x-2'>
								<Select
									required
									checkIconPosition='right'
									className='w-28'
									data={["NONE", "OR", "AND"]}
									allowDeselect={false}
									value={filterCondition}
									label='Filter condition'
									nothingFoundMessage='Nothing found...'
									placeholder='Pick a condition'
									onChange={(value: any) => {
										setFilterCondition(value);
									}}
								/>
								{filterCondition !== "NONE" && (
									<>
										<Select
											checkIconPosition='right'
											className='w-36 pl-2'
											data={classList}
											searchable
											allowDeselect={false}
											value={filterAClass}
											label='Admission class'
											nothingFoundMessage='Nothing found...'
											placeholder='Pick a class'
											onChange={(value: any) => {
												setFilterAClass(value);
											}}
										/>
										<Select
											checkIconPosition='right'
											className='w-36 pl-2'
											data={classList}
											searchable
											allowDeselect={false}
											value={filterClass}
											label='Current class'
											nothingFoundMessage='Nothing found...'
											placeholder='Pick a class'
											onChange={(value: any) => {
												setFilterClass(value);
											}}
										/>

										<Button type='submit' leftSection={<IconFilter />}>
											Filter
										</Button>
										<Button
											onClick={() => {
												setFilterCondition("NONE");
												setFilterAClass("");
												setFilterClass("");

												filterF(null, "NONE");
											}}
											color='red'
											leftSection={<IconX />}
										>
											Clear filters
										</Button>
									</>
								)}
							</div>
						</form>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</section>
	);
};

export default DStudentsFilter;
