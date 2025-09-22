import React from "react";
import {
	Button,
	Select,
	Text,
	LoadingOverlay,
	NumberFormatter,
} from "@mantine/core";
import { useFetch } from "@/hooks/useQueries";
import { IconPrinter } from "@tabler/icons-react";
import PrintHeader from "../PrintHeader";
import { useReactToPrint } from "react-to-print";
const DeptorsFilter = ({
	data,
	filterCriteria = "",
	loading,
}: {
	data: any[];
	filterCriteria?: string;
	loading: boolean;
}) => {
	const [sortedData, setSortedData] = React.useState<any[]>([]);
	const { fetch } = useFetch();
	const [feeList, setFeeList] = React.useState<any[]>([]);
	const [classList, setClassList] = React.useState<any[]>([]);
	const [criteria, setCriteria] = React.useState<string>(filterCriteria);
	const [value, setValue] = React.useState<string>("");
	const contentRef = React.useRef(null);
	const reactToPrintFn: any = useReactToPrint({
		contentRef,
		documentTitle: `Fees Report ${new Date().toLocaleDateString()}`,
	});
	const getStatus = (paid: number, total: number) => {
		if (paid == total) {
			return "Paid";
		} else if (paid > 0 && paid < total) {
			return "Partly paid";
		} else if (paid == 0) {
			return "Unpaid";
		}
	};

	const total = sortedData?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.amount);
	}, 0);
	const totalPaid = sortedData?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.paid);
	}, 0);
	const totalBalance = sortedData?.reduce((prev, curr) => {
		return Number(prev) + Number(curr?.balance);
	}, 0);
	const filter = () => {
		const mappedD = data?.map((d) => {
			return {
				...d,
				status: getStatus(d?.paid, d?.amount),
				balance: Number(d?.amount) - Number(d?.paid),
			};
		});
		const mapped = mappedD.filter((d) => {
			return d?.balance > 0;
		});
		if (criteria == "Class") {
			const filterd: any = mapped?.filter((d) => {
				return d?.transaction?.class == value;
			});
			return filterd;
		} else if (criteria == "Fee") {
			const filterd: any = mapped?.filter((d) => {
				return d?.item?.id == value;
			});
			return filterd;
		} else {
			return mapped;
		}
	};

	React.useEffect(() => {
		async function getAll() {
			// setValue("Active");
			const { data: classes } = await fetch("/classes");
			const { data: fees } = await fetch("/feesgroup");
			const sortedClass = classes?.map((cl: any) => {
				return cl?.name;
			});
			const sortedFees = fees?.map((fee: any) => {
				return {
					value: fee?.id,
					label: fee?.name,
				};
			});
			setClassList(sortedClass);
			setFeeList(sortedFees);
		}
		getAll();
	}, []);
	React.useEffect(() => {
		const returned = filter();
		setSortedData(returned);
	}, [loading, value]);
	return (
		<section className=''>
			<div className='flex items-end justify-between pr-6'>
				<div className='flex items-end gap-2 p-1'>
					<Text className='font-semibold'>Filter payments by:</Text>
					<Select
						checkIconPosition='right'
						className='w-[11rem] pl-2'
						data={["Class", "Fee"]}
						allowDeselect={false}
						value={criteria}
						label='Criteria'
						placeholder='Select a criteria'
						onChange={(value: any) => {
							setCriteria(value);
						}}
					/>

					{criteria == "Class" && (
						<div className='flex gap-4'>
							<Select
								checkIconPosition='right'
								className='w-52'
								data={classList}
								searchable
								allowDeselect={false}
								label='Class'
								nothingFoundMessage='Nothing found...'
								placeholder='Select a class'
								onChange={(value: any) => {
									setValue(value);
								}}
							/>
						</div>
					)}
					{criteria == "Fee" && (
						<div className='flex gap-4'>
							<Select
								checkIconPosition='right'
								className='w-52'
								data={feeList}
								searchable
								allowDeselect={false}
								label='Fee Type'
								nothingFoundMessage='Nothing found...'
								placeholder='Select a fee'
								onChange={(value: any) => {
									setValue(value);
								}}
							/>
						</div>
					)}
				</div>
				<Button
					disabled={sortedData?.length < 1}
					onClick={reactToPrintFn}
					leftSection={<IconPrinter />}
					className='justify-self-end'
				>
					Print
				</Button>
			</div>
			<section ref={contentRef}>
				<PrintHeader />
				<table className='recieptable mt-1'>
					<thead>
						<tr>
							<th>S/N</th>
							<th>date</th>
							<th>TnxId</th>
							<th>Adm No.</th>
							<th>Name</th>
							<th>Class</th>

							<th>Fee</th>
							<th>amount</th>
							<th>paid</th>
							<th>balance</th>
						</tr>
					</thead>
					{sortedData?.length > 0 && (
						<tbody>
							{sortedData?.map((data: any, i: number) => (
								<tr key={data?.payment_id}>
									<td>{i + 1}</td>
									<td>{new Date(data?.createdAt).toLocaleDateString()}</td>

									<td>{data?.transactionId}</td>
									<td>{data?.transaction?.student?.admission_no}</td>
									<td>
										{data?.transaction?.student?.last_name}{" "}
										{data?.transaction?.student?.first_name}
									</td>
									<td>{data?.transaction?.class}</td>

									<td>{data?.item?.name}</td>
									<td>
										<NumberFormatter
											prefix='NGN '
											value={data?.amount}
											thousandSeparator
										/>
									</td>
									<td>
										<NumberFormatter
											prefix='NGN '
											value={data?.paid}
											thousandSeparator
										/>
									</td>
									<td>
										<NumberFormatter
											prefix='NGN '
											value={Number(data?.amount) - Number(data?.paid)}
											thousandSeparator
										/>
									</td>
								</tr>
							))}
						</tbody>
					)}
					<tfoot>
						<tr>
							<td></td>
							<td></td>
							<td></td>

							<td></td>
							<td></td>
							<td></td>
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
							<td className='font-bold'>
								<NumberFormatter
									prefix='NGN '
									value={totalBalance}
									thousandSeparator
								/>
							</td>
						</tr>
					</tfoot>
				</table>
			</section>
			<LoadingOverlay visible={loading} />
		</section>
	);
};

export default DeptorsFilter;
