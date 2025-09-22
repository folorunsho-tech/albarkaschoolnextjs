/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
	Text,
	Table,
	Select,
	Button,
	TextInput,
	NumberFormatter,
} from "@mantine/core";
import { usePostNormal, useFetch } from "@/hooks/useQueries";
import { useEffect, useState } from "react";
import DataLoader from "@/components/DataLoader";

import ReportsTable from "@/components/ReportsTable";
import { isEqual } from "date-fns";
import { DatePickerInput } from "@mantine/dates";
const Payments = () => {
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
			<Table.Td>{row?.tnxId}</Table.Td>
			<Table.Td>{row?.name}</Table.Td>
			<Table.Td>{row?.transaction?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.transaction?.student?.last_name}{" "}
				{row?.transaction?.student?.first_name}
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='NGN ' value={row?.paid} thousandSeparator />
			</Table.Td>
			<Table.Td>{row?.method}</Table.Td>
			<Table.Td>{row?.type}</Table.Td>
			<Table.Td>{row?.createdBy?.username}</Table.Td>
		</Table.Tr>
	));
	const printRows = sortedData?.map((row, i) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{new Date(row?.updatedAt).toLocaleDateString()}</Table.Td>
			<Table.Td>{row?.tnxId}</Table.Td>
			<Table.Td>{row?.name}</Table.Td>
			<Table.Td>{row?.transaction?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.transaction?.student?.last_name}{" "}
				{row?.transaction?.student?.first_name}
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='NGN ' value={row?.paid} thousandSeparator />
			</Table.Td>
			<Table.Td>{row?.method}</Table.Td>
			<Table.Td>{row?.type}</Table.Td>
			<Table.Td>{row?.createdBy?.username}</Table.Td>
		</Table.Tr>
	));
	const totalPay = sortedData.reduce((prev, curr) => {
		return Number(prev) + Number(curr.paid);
	}, 0);
	const getValuesUI = () => {
		if (criteria == "Student name") {
			return (
				<TextInput
					label='Student name'
					placeholder='name'
					value={value}
					className='w-64'
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
		if (criteria == "Cashier") {
			return (
				<TextInput
					label='Cashier'
					placeholder='name'
					value={value}
					onChange={(e) => {
						setValue(e.currentTarget.value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Payment Method") {
			return (
				<Select
					label='Payment Method'
					placeholder='method'
					data={["Cash", "Bank TRF", "POS", "MD Collect"]}
					value={value}
					onChange={(value) => {
						setValue(value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Fees") {
			return (
				<Select
					label='Fee'
					placeholder='fee'
					data={fees}
					value={value}
					className='w-[16rem]'
					onChange={(value) => {
						setValue(value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Date") {
			return (
				<DatePickerInput
					label='Date'
					placeholder='Select a date'
					className='w-[16rem]'
					value={value}
					onChange={(value) => {
						setValue(value);
						setDisableBtn(true);
					}}
				/>
			);
		}
		if (criteria == "Payment Type") {
			return (
				<Select
					label='Payment Type'
					placeholder='type'
					data={["payment", "reversal", "balance"]}
					value={value}
					onChange={(value) => {
						setValue(value);
						setDisableBtn(true);
					}}
				/>
			);
		}
	};
	const getFilter = () => {
		if (criteria == "Payment Type") {
			const found = queryData?.filter((d: any) => d?.type == value);
			setSortedData(found);
		}
		if (criteria == "Payment Method") {
			const found = queryData?.filter((d: any) => d?.method == value);
			setSortedData(found);
		}
		if (criteria == "Fees") {
			const found = queryData?.filter((d: any) => d?.tnxItem?.feeId == value);
			setSortedData(found);
		}
		if (criteria == "Date") {
			const found = queryData?.filter((d: any) =>
				isEqual(
					new Date(d?.updatedAt).setUTCHours(0, 0, 0, 0),
					new Date(value).setUTCHours(0, 0, 0, 0)
				)
			);
			setSortedData(found);
		}
		if (criteria == "Cashier") {
			const found = queryData?.filter((d: any) =>
				String(d?.createdBy?.username).toLowerCase().includes(value)
			);
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
					data={[
						"Payment Type",
						"Payment Method",
						"Fees",
						"Date",
						"Student name",
						"Admission No",
						"Cashier",
					]}
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
				return `Payments report for ${criteria} --> ${f}`;
			}
			return `Payments report for ${criteria} --> ${value}`;
		}
		return "Payments report for";
	};
	useEffect(() => {
		const getD = async () => {
			const { data } = await fetch("/feesgroup");
			const section = (id: string, name: string) => {
				if (id == "Exo4omu") {
					return `${name} - Secondary`;
				}
				if (id == "JsrykwV") {
					return `${name} - Nursery/Primary`;
				}
				return name;
			};
			const sorted = data.map((d: { name: string; id: string }) => {
				return {
					label: section(d.id, d.name),
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
	}, [loaded]);
	return (
		<main className='space-y-6 bg-white p-3'>
			<div className='flex justify-between items-end'>
				<DataLoader
					link='/payments'
					post={post}
					setQueryData={setQueryData}
					setLoaded={setLoaded}
				/>

				<Text size='md' fw={600}>
					Payments report
				</Text>
			</div>

			<ReportsTable
				headers={[
					"Date",
					"Tnx Id",
					"Fee",
					"Admission No",
					"Student Name",
					"Amount paid",
					"Method",
					"Type",
					"Cashier",
				]}
				printHeaders={[
					"Date",
					"Tnx Id",
					"Fee",
					"Admission No",
					"Student Name",
					"Amount paid",
					"Method",
					"Type",
					"Cashier",
				]}
				sortedData={sortedData}
				setSortedData={setSortedData}
				data={queryData}
				tableLoading={loading}
				rows={rows}
				printRows={printRows}
				filters={filters}
				loaded={loaded}
				tableReport={getReport()}
				pdfTitle={getReport()}
				disableBtn={disableBtn}
				metadata={
					<div className='text-lg font-semibold my-2'>
						<h2>Total Count: {sortedData.length}</h2>
					</div>
				}
				tableFoot={
					<Table.Tr className=''>
						<Table.Td>Total: </Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>
							<NumberFormatter
								prefix='NGN '
								value={totalPay}
								thousandSeparator
							/>
						</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
				}
			/>
		</main>
	);
};

export default Payments;
