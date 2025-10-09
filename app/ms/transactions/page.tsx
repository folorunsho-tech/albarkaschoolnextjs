/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DataLoader from "@/components/DataLoader";
import PaginatedTable from "@/components/PaginatedTable";
import { userContext } from "@/context/User";
import { usePostNormal } from "@/hooks/useQueries";
import { ActionIcon, Button, NumberFormatter, rem, Table } from "@mantine/core";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, useContext } from "react";

const Payments = () => {
	const { user } = useContext(userContext);
	const { post, loading } = usePostNormal();
	const [queryData, setQueryData] = useState<any[]>([]);
	const [sortedData, setSortedData] = useState<any[]>([]);
	const getStatus = (status: string | any) => {
		if (status == "Fully Paid") {
			return "bg-green-500 text-white";
		} else if (status == "Partly Paid") {
			return "bg-orange-500 text-white";
		} else if (status == "Partly Reversed") {
			return "bg-pink-500 text-white";
		} else if (status == "Fully Reversed") {
			return "bg-red-500 text-white";
		}
	};

	const rows = sortedData?.map((row, i: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{row?.id}</Table.Td>
			<Table.Td>{format(new Date(row?.createdAt), "dd/MM/yyyy, p")}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.last_name} {row?.student?.first_name}
			</Table.Td>
			<Table.Td>{row?._count?.items}</Table.Td>
			<Table.Td>
				<NumberFormatter value={row?.total} prefix='NGN ' thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter
					value={
						row?.status == "Fully Reversed"
							? -(Number(row?.total) - Number(row?.balance))
							: Number(row?.total) - Number(row?.balance)
					}
					prefix='NGN '
					thousandSeparator
				/>
			</Table.Td>
			<Table.Td>
				<NumberFormatter value={row?.balance} prefix='NGN ' thousandSeparator />
			</Table.Td>
			<Table.Td className={getStatus(row?.status)}>{row?.status}</Table.Td>
			<Table.Td>
				<ActionIcon component={Link} href={`transactions/${row?.id}`}>
					<Eye style={{ width: rem(14), height: rem(14) }} />
				</ActionIcon>
			</Table.Td>
		</Table.Tr>
	));
	return (
		<main className='space-y-6 bg-white p-3'>
			<div className='flex items-end justify-between w-full gap-2'>
				<DataLoader
					post={post}
					setQueryData={setQueryData}
					link='/transactions'
				/>
				<div className='flex gap-1 items-end'>
					<Button href='transactions/report' component={Link}>
						Report
					</Button>
					<Button color='teal' href='transactions/payment' component={Link}>
						New transaction
					</Button>
					<Button color='orange' href='transactions/balance' component={Link}>
						Balance payment
					</Button>
					{user?.role == "admin" && (
						<Button color='red' href='transactions/reversal' component={Link}>
							Reversal
						</Button>
					)}
				</div>
			</div>
			<PaginatedTable
				headers={[
					"S/N",
					"Tnx Id",
					"Date",
					"Adm No",
					"Name",
					"Items",
					"Total",
					"Paid",
					"Balance",
					"Status",
					"Action",
				]}
				placeholder='Search by transaction Id'
				sortedData={sortedData}
				rows={rows}
				showSearch={true}
				showPagination={true}
				showlast={false}
				data={queryData}
				setSortedData={setSortedData}
				loading={loading}
				depth=''
			/>
		</main>
	);
};

export default Payments;
