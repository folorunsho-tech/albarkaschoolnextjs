"use client";
import convert from "@/libs/numberConvert";
import { Button, NumberFormatter, Text } from "@mantine/core";
import React from "react";
import PrintHeader from "./PrintHeader";
import { useReactToPrint } from "react-to-print";
import { IconPrinter } from "@tabler/icons-react";
const BReciept = ({
	hist,
	enablePrint = true,
	showBtn = true,
}: {
	hist: any;
	enablePrint?: boolean;
	showBtn?: boolean;
}) => {
	const contentRef = React.useRef(null);
	const reactToPrintFn: any = useReactToPrint({
		contentRef,
		documentTitle: `TNXID - ${hist?.tnxId} - ${hist?.student?.admission_no}`,
	});
	// console.log(hist);
	// const total = hist?.items?.reduce((prev: any, curr: any) => {
	// 	return Number(prev) + Number(curr?.balance);
	// }, 0);
	const totalPaid = hist?.items?.reduce((prev: any, curr: any) => {
		return Number(prev) + Number(curr?.paid);
	}, 0);
	return (
		<>
			<Button
				disabled={!enablePrint}
				onClick={reactToPrintFn}
				leftSection={<IconPrinter />}
			>
				Print reciept
			</Button>
			<section style={{ display: "none" }}>
				<div
					className='border border-black max-w-[40rem] p-2 m-2'
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
							<i className='text-sm font-normal pl-2'>
								{hist?.student?.last_name} {hist?.student?.first_name}
							</i>
						</Text>
						<Text fw={600}>
							GUARDIAN NAME:
							<i className='text-sm font-normal pl-2'>
								{hist?.student?.guardian_name}
							</i>
						</Text>
						<Text fw={600}>
							ADMISSION NO:
							<i className='text-sm font-normal pl-2'>
								{hist?.student?.admission_no}
							</i>
						</Text>
						<Text fw={600}>
							CLASS:
							<i className='text-sm font-normal pl-2'>{hist?.class}</i>
						</Text>
						<Text fw={600}>
							SESSION:
							<i className='text-sm font-normal pl-2'>{hist?.session}</i>
						</Text>
						<Text fw={600}>
							TERM:
							<i className='text-sm font-normal pl-2'>{hist?.term}</i>
						</Text>
					</div>
					<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
						<Text fw={600}>
							DATE OF PAYMENT:
							<i className='text-sm font-normal pl-2'>
								{new Date(hist?.createdAt).toDateString()}
							</i>
						</Text>
						<Text fw={600}>
							RECIEPT NO:
							<i className='text-sm font-normal pl-2'>{hist?.tnxId}</i>
						</Text>
						<Text fw={600}>
							CASHIER:
							<i className='text-sm font-normal pl-2 underline'>
								{hist?.createdBy?.name}
							</i>
						</Text>
					</div>
					<table className='recieptable'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Paid</th>
							</tr>
						</thead>
						<tbody>
							{hist?.items?.map((item: any) => {
								return (
									<tr key={item?.payment_id}>
										<td>{item?.name}</td>

										<td>
											<NumberFormatter
												prefix='NGN '
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

								<td className='font-bold'>
									<NumberFormatter
										prefix='NGN '
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
							<b className='text-sm pl-2'>
								<NumberFormatter
									prefix='NGN '
									value={totalPaid}
									thousandSeparator
								/>
							</b>
						</Text>
						<Text fw={600}>
							Total amount paid in words:
							<i className='text-sm pl-2 capitalize'>
								{convert(Number(totalPaid))} Naira
							</i>
						</Text>
					</div>
				</div>
			</section>
		</>
	);
};

export default BReciept;
