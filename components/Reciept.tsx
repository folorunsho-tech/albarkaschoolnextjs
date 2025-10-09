"use client";
import convert from "@/libs/numberConvert";
import { Button, NumberFormatter, Text } from "@mantine/core";
import React from "react";
import PrintHeader from "./PrintHeader";
import { useReactToPrint } from "react-to-print";
import { IconPrinter } from "@tabler/icons-react";
const Reciept = ({
	queryData,
	enablePrint = true,
	showAmnt = false,
}: {
	queryData: any;
	enablePrint?: boolean;
	showAmnt?: boolean;
}) => {
	const contentRef = React.useRef(null);
	const reactToPrintFn: any = useReactToPrint({
		contentRef,
		documentTitle: `TNXID - ${queryData?.tnxId} - ${queryData?.student?.admission_no}`,
	});
	const total = queryData?.items?.reduce((prev: any, curr: any) => {
		return Number(prev) + Number(curr?.amount);
	}, 0);
	const totalPaid = queryData?.items?.reduce((prev: any, curr: any) => {
		return Number(prev) + Number(curr?.paid);
	}, 0);
	// console.log(queryData);
	return (
		<>
			<Button
				disabled={!enablePrint}
				onClick={reactToPrintFn}
				leftSection={<IconPrinter />}
			>
				Print
			</Button>
			<section style={{ display: "none" }}>
				<div
					className='border border-black max-w-[40rem] p-2 m-2 text-xs'
					ref={contentRef}
				>
					<div>
						<PrintHeader />
						<h2 className='text-center font-semibold'>
							STUDENT PAYMENT RECIEPT
						</h2>
					</div>
					<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
						<Text fw={600}>
							FULL NAME:
							<i className=' pl-2'>
								{queryData?.student?.last_name} {queryData?.student?.first_name}
							</i>
						</Text>
						<Text fw={600}>
							GUARDIAN NAME:
							<i className=' pl-2'>{queryData?.student?.guardian_name}</i>
						</Text>
						<Text fw={600}>
							ADMISSION NO:
							<i className=' pl-2'>{queryData?.student?.admission_no}</i>
						</Text>
						<Text fw={600}>
							CLASS:
							<i className=' pl-2'>{queryData?.class}</i>
						</Text>
						<Text fw={600}>
							SESSION:
							<i className=' pl-2'>{queryData?.session}</i>
						</Text>
						<Text fw={600}>
							TERM:
							<i className=' pl-2'>{queryData?.term}</i>
						</Text>
					</div>
					<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
						<Text fw={600}>
							DATE OF PAYMENT:
							<i className=' pl-2'>
								{new Date(queryData?.createdAt).toDateString()}
							</i>
						</Text>
						<Text fw={600}>
							RECIEPT NO:
							<i className=' pl-2'>{queryData?.tnxId}</i>
						</Text>
						<Text fw={600}>
							CASHIER:
							<i className=' pl-2 underline'>{queryData?.createdBy?.name}</i>
						</Text>
					</div>
					<table className='recieptable'>
						<thead>
							<tr>
								<th>Name</th>
								{showAmnt && <th>Amount</th>}
								<th>Paid</th>
							</tr>
						</thead>
						<tbody>
							{queryData?.items?.map((item: any) => {
								return (
									<tr key={item?.payment_id}>
										<td>{item?.item?.name}</td>

										{showAmnt && (
											<td>
												<NumberFormatter
													prefix=' '
													value={item?.amount}
													thousandSeparator
												/>
											</td>
										)}
										<td>
											<NumberFormatter
												prefix=' '
												value={item?.paid}
												thousandSeparator
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr>
								<td className='font-bold text-right'>Total :</td>
								{showAmnt && (
									<td className='font-bold'>
										<NumberFormatter
											prefix=' '
											value={total}
											thousandSeparator
										/>
									</td>
								)}
								<td className='font-bold'>
									<NumberFormatter
										prefix=' '
										value={totalPaid}
										thousandSeparator
									/>
								</td>
							</tr>
						</tfoot>
					</table>
					<div className='flex justify-between items-center px-2 py-2'>
						<Text fw={600}>
							Total amount paid:
							<b className='pl-2'>
								<NumberFormatter
									prefix='N '
									value={queryData?.paid}
									thousandSeparator
								/>
							</b>
						</Text>
						<Text fw={600}>
							Total amount paid in words:
							<i className='pl-2 capitalize'>
								{convert(Number(queryData?.paid))} Naira
							</i>
						</Text>
					</div>
				</div>
			</section>
		</>
	);
};

export default Reciept;
