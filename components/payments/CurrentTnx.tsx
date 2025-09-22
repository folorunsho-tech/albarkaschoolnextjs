"use client";
import { useFetchSingle } from "@/hooks/useQueries";
import { LoadingOverlay, NumberFormatter, Text } from "@mantine/core";
import React from "react";
import Reciept from "../Reciept";
import PrintHeader from "../PrintHeader";
import convert from "@/libs/numberConvert";
import { useSearchParams } from "next/navigation";

const CurrentTnx = () => {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");
	const { loading, fetch } = useFetchSingle();
	const [queryData, setQueryData] = React.useState<any>({});
	React.useEffect(() => {
		async function getTnx() {
			const { data } = await fetch("/transactions/" + id);
			setQueryData(data?.tnx);
			// console.log(data);
		}
		getTnx();
	}, []);
	const total = queryData?.items?.reduce((prev: any, curr: any) => {
		return Number(prev) + Number(curr?.amount);
	}, 0);
	const totalPaid = queryData?.items?.reduce((prev: any, curr: any) => {
		return Number(prev) + Number(curr?.paid);
	}, 0);
	return (
		<main className='h-screen'>
			<section className='flex gap-2 justify-between p-2 relative'>
				<section className=''>
					<section className='border border-black max-w-[80rem] p-2 m-2'>
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
									{queryData?.student?.last_name}{" "}
									{queryData?.student?.first_name}
								</i>
							</Text>

							<Text fw={600}>
								ADMISSION NO:
								<i className='text-sm font-normal pl-2'>
									{queryData?.student?.admission_no}
								</i>
							</Text>
							<Text fw={600}>
								CLASS:
								<i className='text-sm font-normal pl-2'>{queryData?.class}</i>
							</Text>
							<Text fw={600}>
								SESSION:
								<i className='text-sm font-normal pl-2'>{queryData?.session}</i>
							</Text>
							<Text fw={600}>
								TERM:
								<i className='text-sm font-normal pl-2'>{queryData?.term}</i>
							</Text>
						</div>
						<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
							<Text fw={600}>
								DATE OF PAYMENT:
								<i className='text-sm font-normal pl-2'>
									{new Date(queryData?.createdAt).toDateString()}
								</i>
							</Text>
							<Text fw={600}>
								RECIEPT NO:
								<i className='text-sm font-normal pl-2'>{queryData?.tnxId}</i>
							</Text>
							<Text fw={600}>
								CASHIER:
								<i className='text-sm font-normal pl-2 underline'>
									{queryData?.createdBy?.name}
								</i>
							</Text>
						</div>
						<table className='recieptable'>
							<thead>
								<tr>
									<th>Name</th>
									<th>Amount</th>
									<th>Paid</th>
								</tr>
							</thead>
							<tbody>
								{queryData?.items?.map((item: any) => {
									return (
										<tr key={item?.payment_id}>
											<td>{item?.item?.name}</td>

											<td>
												<NumberFormatter
													prefix='NGN '
													value={item?.amount}
													thousandSeparator
												/>
											</td>

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
											value={total}
											thousandSeparator
										/>
									</td>

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
										value={queryData?.paid}
										thousandSeparator
									/>
								</b>
							</Text>
							<Text fw={600}>
								Total amount paid in words:
								<i className='text-sm pl-2 capitalize'>
									{convert(Number(queryData?.paid))} Naira
								</i>
							</Text>
						</div>
					</section>
				</section>

				<Reciept queryData={queryData} showAmnt={false} />
			</section>
			<LoadingOverlay visible={loading} />
		</main>
	);
};

export default CurrentTnx;
