"use client";
import React from "react";
import { Button, LoadingOverlay, MultiSelect, TextInput } from "@mantine/core";
import { useFetchSingle, useEdit } from "@/hooks/useQueries";
import { useRouter, useParams } from "next/navigation";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

const Edit = () => {
	const router = useRouter();
	const { id }: { id: string } = useParams();

	const { fetch, loading: fLoading } = useFetchSingle();
	const { edit, loading } = useEdit();
	const [amount, setAmount] = React.useState("");
	const [name, setName] = React.useState("");
	const [classList, setClassList] = React.useState([]);
	const [classes, setClasses] = React.useState([]);
	const getFee = async () => {
		const { data } = await fetch("/feesgroup/" + id);

		const { data: classes } = await fetch("/classes/list");
		const sortedClasses = classes?.map((cl: any) => {
			return {
				value: cl?.id,
				label: cl?.name,
			};
		});
		const cls = data?.classes?.map((cl: any) => {
			return cl?.id;
		});
		setClassList(sortedClasses);
		setAmount(data?.amount);
		setName(data?.name);
		setClasses(cls);
	};

	React.useEffect(() => {
		getFee();
	}, [id]);
	return (
		<section className='w-full p-3 space-y-4 bg-white'>
			<div className='flex justify-between pr-12'>
				<Button
					leftSection={<IconArrowNarrowLeft size={25} />}
					onClick={() => {
						router.push("/ms/settings");
					}}
				>
					Go back
				</Button>
			</div>
			<form
				className='flex  flex-col gap-4'
				onSubmit={async (e) => {
					e.preventDefault();
					await edit(`/feesgroup/${id}/edit`, {
						amount,
						classes: classes?.map((cl: any) => {
							return {
								id: cl,
							};
						}),
					});
					getFee();
				}}
			>
				<TextInput
					label='Fee group name'
					disabled
					defaultValue={name}
					placeholder='fee group name...'
					className='w-max'
				/>

				<TextInput
					label='Fee group amount'
					leftSectionPointerEvents='none'
					leftSection='N'
					placeholder='fee group amount...'
					value={amount}
					onChange={(e) => {
						setAmount(e.target.value);
					}}
					className='w-max'
				/>
				<MultiSelect
					label='Classes'
					placeholder='Pick one or more class'
					checkIconPosition='right'
					value={classes}
					data={classList}
					clearable
					searchable
					hidePickedOptions
					onChange={(value: any) => {
						setClasses(value);
					}}
					className='w-2/3'
				/>
				<div className='flex gap-4 items-center'>
					<Button
						color='black'
						onClick={() => {
							router.push("/ms/settings");
						}}
					>
						Cancel
					</Button>
					<Button color='teal' type='submit'>
						Update Fee
					</Button>
				</div>
			</form>
			<LoadingOverlay visible={loading || fLoading} />
		</section>
	);
};

export default Edit;
