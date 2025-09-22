import { Table } from "@mantine/core";
import React from "react";

const Outstanding = ({
	outstandingFees,
}: {
	outstandingFees: {
		id: string;
		price: number | string;
		paid: number | string;
		balance: number | string;
		createdAt: string;
		updatedAt: string;
		transactionId: string;
		year: string;
		fee: string;
	}[];
}) => {
	return (
		<section>
			<div className='border rounded p-2'>
				<h2 className='text-lg font-semibold mb-2 text-center text-red-500'>
					Error !!!
				</h2>
				<h3 className='text-md font-semibold mb-2 text-center'>
					This student has {outstandingFees.length} outstanding Fees
				</h3>
				<Table
					miw={700}
					striped
					highlightOnHover
					withTableBorder
					withColumnBorders
					fz={13}
				>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>S/N</Table.Th>
							<Table.Th>Date</Table.Th>
							<Table.Th>Transaction ID</Table.Th>
							<Table.Th>Fee</Table.Th>
							<Table.Th>Price</Table.Th>
							<Table.Th>Paid</Table.Th>
							<Table.Th>Balance</Table.Th>
							<Table.Th>Created At</Table.Th>
							<Table.Th>Last Updated At</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{outstandingFees.map((out, index) => (
							<Table.Tr key={out.id}>
								<Table.Td>{index + 1}</Table.Td>
								<Table.Td>{out.year}</Table.Td>
								<Table.Td>{out.transactionId}</Table.Td>
								<Table.Td>{out.fee}</Table.Td>
								<Table.Td>{out.price}</Table.Td>
								<Table.Td>{out.paid}</Table.Td>
								<Table.Td>{out.balance}</Table.Td>
								<Table.Td>{out.createdAt}</Table.Td>
								<Table.Td>{out.updatedAt}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</div>
		</section>
	);
};

export default Outstanding;
