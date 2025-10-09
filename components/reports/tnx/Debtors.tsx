/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
	Text,
	Table,
	Select,
	Button,
	NumberFormatter,
	TextInput,
} from "@mantine/core";
import { usePostNormal, useFetch } from "@/hooks/useQueries";
import { useEffect, useState } from "react";
import DataLoader from "@/components/DataLoader";

import ReportsTable from "@/components/ReportsTable";
const Debtors = () => {
	const { post, loading } = usePostNormal();
	const { fetch } = useFetch();
	const [queryData, setQueryData] = useState<any[]>([]);
	const [sortedData, setSortedData] = useState<any[]>(queryData);
	const [fees, setFees] = useState<any[]>([]);
	const [value, setValue] = useState<any>("");
	const [criteria, setCriteria] = useState<string | null>("");
	const [loaded, setLoaded] = useState<any>("");
	const [disableBtn, setDisableBtn] = useState<boolean>(true);
	const rows = sortedData?.map((row, i) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{new Date(row?.updatedAt).toLocaleDateString()}</Table.Td>
			<Table.Td>{row?.transactionId}</Table.Td>
			<Table.Td>{row?.transaction?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.transaction?.student?.last_name}{" "}
				{row?.transaction?.student?.first_name}
			</Table.Td>
			<Table.Td>{row?.fee?.name}</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.price} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.paid} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.balance} thousandSeparator />
			</Table.Td>
		</Table.Tr>
	));
	const printRows = sortedData?.map((row, i) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{new Date(row?.updatedAt).toLocaleDateString()}</Table.Td>
			<Table.Td>{row?.transactionId}</Table.Td>
			<Table.Td>{row?.transaction?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.transaction?.student?.last_name}{" "}
				{row?.transaction?.student?.first_name}
			</Table.Td>
			<Table.Td>{row?.fee?.name}</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.price} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.paid} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.balance} thousandSeparator />
			</Table.Td>
		</Table.Tr>
	));
	const totalPrice = sortedData.reduce((prev, curr) => {
		return Number(prev) + Number(curr.price);
	}, 0);
	const totalPay = sortedData.reduce((prev, curr) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const totalBalance = sortedData.reduce((prev, curr) => {
		return Number(prev) + Number(curr.balance);
	}, 0);
	const getValuesUI = () => {
		if (criteria == "Fees") {
			return (
				<Select
					label='Fee'
					placeholder='fee'
					data={fees}
					value={value}
					onChange={(value) => {
						setValue(value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Student name") {
			return (
				<TextInput
					label='Student name'
					placeholder='name'
					className='w-64'
					value={value}
					onChange={(e) => {
						setValue(e.currentTarget.value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Admission No") {
			return (
				<TextInput
					label='Admission No'
					placeholder='adm no'
					value={value}
					onChange={(e) => {
						setValue(e.currentTarget.value);
						setDisableBtn(true);
					}}
				/>
			);
		}
	};
	const getFilter = () => {
		if (criteria == "Fees") {
			const found = queryData?.filter((d: any) => d?.feeId == value);
			setSortedData(found);
		}
		if (criteria == "Student name") {
			const found = queryData?.filter((d: any) =>
				(
					String(d?.transaction?.student?.last_name) +
					` ` +
					String(d?.transaction?.student?.first_name)
				)
					.toLowerCase()
					.trim()
					.includes(String(value).toLowerCase().trim())
			);
			setSortedData(found);
		}
		if (criteria == "Admission No") {
			const found = queryData?.filter((d: any) =>
				String(d?.transaction?.student?.admission_no).trim().includes(value)
			);
			setSortedData(found);
		}
	};
	const filters = (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				getFilter();
			}}
			className='w-full'
		>
			<label htmlFor='filters'>Filters</label>
			<div id='filters' className='flex gap-3 items-end flex-wrap'>
				<Select
					label='Criteria'
					placeholder='select a criteria'
					data={["Fees", "Student name", "Admission No"]}
					className='w-[16rem]'
					clearable
					value={criteria}
					onChange={(value) => {
						setCriteria(value);
						setValue(null);
						setDisableBtn(true);
					}}
				/>
				{getValuesUI()}
				<Button
					onClick={() => {
						getFilter();
						setDisableBtn(false);
					}}
					disabled={!value}
					type='submit'
				>
					Filter
				</Button>
				<Button
					color='red'
					onClick={() => {
						setSortedData(queryData);
						setCriteria(null);
						setValue(null);
						setDisableBtn(true);
					}}
				>
					Clear Filter
				</Button>
			</div>
		</form>
	);
	const getReport = () => {
		if (criteria && value) {
			const f = fees.find((f) => f.value == value)?.label;
			if (f) {
				return `Debtors report for ${criteria} --> ${f}`;
			}
			return `Debtors report for ${criteria} --> ${value}`;
		}
		return "Debtors report for";
	};
	useEffect(() => {
		const getD = async () => {
			const { data } = await fetch("/feesgroup");
			const sorted = data.map((d: { name: string; id: string }) => {
				return {
					label: d.name,
					value: d.id,
				};
			});
			setFees(sorted);
		};
		getD();
	}, []);
	useEffect(() => {
		setSortedData(queryData);
		setCriteria(null);
		setValue(null);
	}, [loading]);
	return (
		<main className='space-y-6'>
			<div className='flex justify-between items-end'>
				<DataLoader
					link='/transactions/report/debtors'
					post={post}
					setQueryData={setQueryData}
					setLoaded={setLoaded}
				/>

				<Text size='md' fw={600}>
					Debtors report
				</Text>
			</div>

			<ReportsTable
				headers={[
					"Date",
					"Tnx Id",
					"Admission No",
					"Student Name",
					"Fee",
					"Amount",
					"Paid",
					"Balance",
				]}
				printHeaders={[
					"Date",
					"Tnx Id",
					"Admission No",
					"Student Name",
					"Fee",
					"Amount",
					"Paid",
					"Balance",
				]}
				sortedData={sortedData}
				setSortedData={setSortedData}
				data={queryData}
				tableLoading={loading}
				disableBtn={disableBtn}
				rows={rows}
				printRows={printRows}
				filters={filters}
				loaded={loaded}
				tableReport={getReport()}
				pdfTitle={getReport()}
				metadata={
					<div className='text-lg font-semibold my-2'>
						<h2>Total Count: {sortedData.length}</h2>
					</div>
				}
				tableFoot={
					<Table.Tr>
						<Table.Td>Total: </Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='N '
								value={totalPrice}
								thousandSeparator
							/>
						</Table.Td>
						<Table.Td>
							<NumberFormatter prefix='N ' value={totalPay} thousandSeparator />
						</Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='N '
								value={totalBalance}
								thousandSeparator
							/>
						</Table.Td>
					</Table.Tr>
				}
			/>
		</main>
	);
};

export default Debtors;
