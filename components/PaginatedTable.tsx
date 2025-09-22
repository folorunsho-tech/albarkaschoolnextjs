import { useEffect, useState } from "react";
import {
	Table,
	ScrollArea,
	Text,
	TextInput,
	rem,
	keys,
	Loader,
} from "@mantine/core";
import chunk from "@/libs/chunk";
import { IconSearch } from "@tabler/icons-react";
import { Pagination } from "@mantine/core";

function filterData(data: any[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
	);
}

const PaginatedTable = ({
	data,
	headers,
	setSortedData,
	rows,
	placeholder = "Search by any field",
	loading,
	showSearch = true,
	showlast = true,
	depth = "",
	sortedData,
	showPagination = true,
}: {
	data: any[];
	headers: string[];
	setSortedData?: any;
	rows: any;
	placeholder: string;
	loading: boolean;
	showSearch?: boolean;
	showlast?: boolean;
	depth: string;
	sortedData: any;
	showPagination?: boolean;
}) => {
	const mappedData = data?.map((mDtata) => {
		return {
			...mDtata,
			...mDtata[depth],
		};
	});
	const chunkAmnt = 100;
	const [total, setTotal] = useState(1);
	const [search, setSearch] = useState("");
	const [activePage, setPage] = useState(1);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		const filtered = filterData(mappedData, value);
		const chunked = chunk(filtered, chunkAmnt);
		setPage(1);
		setSortedData(chunked[activePage - 1]);
		setTotal(chunked?.length);
	};
	useEffect(() => {
		const chunked = chunk(data, chunkAmnt);
		setTotal(chunked?.length);
		setSortedData(chunked[activePage - 1]);
	}, [loading]);
	useEffect(() => {
		const chunked = chunk(sortedData, chunkAmnt);
		setTotal(chunked?.length);
		setSortedData(chunked[activePage - 1]);
	}, []);
	return (
		<ScrollArea h={800} className='relative'>
			{showSearch && (
				<TextInput
					placeholder={placeholder}
					mb='md'
					leftSection={
						<IconSearch
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
					value={search}
					onChange={handleSearchChange}
				/>
			)}
			<Table
				verticalSpacing='xs'
				highlightOnHover
				layout='auto'
				withTableBorder
				striped
				// className='relative '
				withColumnBorders
				withRowBorders
			>
				<Table.Tbody className='border-b '>
					<Table.Tr>
						{!headers.includes("S/N") && <Table.Th>S/N</Table.Th>}
						{headers.map((header, index) => (
							<Table.Th key={header + index}>{header}</Table.Th>
						))}
						{showlast && <Table.Th></Table.Th>}
					</Table.Tr>
				</Table.Tbody>
				<Table.Tbody className=''>
					{rows?.length > 0 ? (
						rows
					) : (
						<Table.Tr>
							<Table.Td colSpan={headers.length + 1}>
								<Text fw={500} ta='center'>
									Nothing found
								</Text>
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>
			<div className='flex items-center justify-center'>
				{loading && <Loader className='mx-auto' />}
			</div>
			<div className='flex w-full justify-end'>
				{showPagination && (
					<Pagination
						mt={20}
						total={total}
						value={activePage}
						onChange={(value: number) => {
							setPage(value);
							const chunked = chunk(data, chunkAmnt);
							setSortedData(chunked[value - 1]);
						}}
					/>
				)}
			</div>
		</ScrollArea>
	);
};

export default PaginatedTable;
