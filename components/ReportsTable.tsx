/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactElement, ReactNode, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
	ScrollArea,
	Table,
	Text,
	Box,
	Button,
	Loader,
	LoadingOverlay,
} from "@mantine/core";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const ReportsTable = ({
	headers,
	rows,
	data,
	setSortedData,
	sortedData,
	tableLoading,
	printHeaders,
	printRows,
	tableReport = "",
	tableFoot,
	showPrint = true,
	filters,
	pdfTitle = "",
	loaded = "",
	metadata,
	disableBtn = false,
}: {
	headers: string[];
	rows: ReactElement[];
	printHeaders?: string[];
	printRows?: ReactElement[];
	data: any[];
	setSortedData?: any;
	sortedData: any[];
	placeholder?: string;
	tableLoading?: boolean;
	tableReport?: string;
	tableFoot?: ReactElement;
	showPrint?: Boolean;
	filters?: ReactNode;
	pdfTitle?: string;
	loaded?: string;
	metadata?: ReactNode;
	disableBtn?: boolean;
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const reactToPrintFn = useReactToPrint({
		contentRef,
		bodyClass: "print",
		documentTitle: pdfTitle,
	});

	useEffect(() => {
		if (tableLoading) {
			setSortedData(data);
		}
	}, [tableLoading]);
	return (
		<Box pos='relative'>
			<section style={{ display: "none" }}>
				<div ref={contentRef} className='printable'>
					<div className='flex items-start gap-4 mb-1'>
						<Image
							src='/logo.svg'
							height={100}
							width={100}
							alt='Albarka logo'
							loading='eager'
						/>
						<div className='space-y-1 w-full'>
							<div className='flex items-center w-full justify-between'>
								<h2 className='font-extrabold font-serif '>ALBARKA SCHOOL</h2>
								<p>{format(new Date(), "Pp")}</p>
							</div>
							<h3 className=''>Rofia Road, Wawa, Niger State</h3>
							<p className=' italic'>E-mail: albarkaschool@yahoo.com</p>
						</div>
					</div>
					{metadata}
					<Table miw={700} fz={13}>
						<Table.Thead>
							<Table.Tr>
								{printHeaders?.map((head: string, index: number) => (
									<Table.Th key={head + index + 1}>{head}</Table.Th>
								))}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{printRows}</Table.Tbody>
						<Table.Tfoot className='font-semibold border bg-gray-200'>
							{tableFoot}
						</Table.Tfoot>
					</Table>
				</div>
			</section>
			<section className='flex flex-col gap-2'>
				<div className='flex gap-3 items-end justify-between'>
					{filters}
					{showPrint && (
						<Button
							onClick={() => {
								reactToPrintFn();
							}}
						>
							<Printer />
						</Button>
					)}
				</div>

				<ScrollArea h={700}>
					{metadata}
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
								{headers?.map((head: string, index: number) => (
									<Table.Th key={head + index}>{head}</Table.Th>
								))}
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{sortedData?.length > 0 ? (
								rows
							) : (
								<Table.Tr>
									<Table.Td>
										<Text fw={500} ta='center'>
											Nothing found
										</Text>
									</Table.Td>
								</Table.Tr>
							)}
						</Table.Tbody>
						<Table.Tfoot className='font-semibold border border-black bg-gray-200'>
							{tableFoot}
						</Table.Tfoot>
					</Table>
				</ScrollArea>

				<LoadingOverlay visible={tableLoading} />
			</section>
		</Box>
	);
};

export default ReportsTable;
