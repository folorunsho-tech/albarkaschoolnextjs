/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { Combobox, Loader, TextInput, useCombobox } from "@mantine/core";
import axios from "@/config/axios";

function getAsyncData(searchQuery: string, signal: AbortSignal) {
	return new Promise<string[]>((resolve, reject) => {
		signal.addEventListener("abort", () => {
			reject(new Error("Request aborted"));
		});
		if (searchQuery !== "") {
			axios
				.post("/students/search", { value: searchQuery })
				.then((result: any) => {
					resolve(result.data);
				});
		} else {
			return resolve([]); // Return an empty array if searchQuery is empty
		}
	});
}

export default function StudentSearch({
	setStudent,
	cleared = false,
}: {
	setStudent: any;
	cleared?: boolean;
}) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any[] | null>(null);
	const [value, setValue] = useState("");
	const [empty, setEmpty] = useState(false);
	const abortController = useRef<AbortController | any>(null);

	const fetchOptions = (query: string) => {
		abortController.current?.abort();
		abortController.current = new AbortController();
		setLoading(true);

		getAsyncData(query, abortController.current.signal)
			.then((result) => {
				setData(result);
				setLoading(false);
				setEmpty(result.length === 0);
				abortController.current = undefined;
			})
			.catch(() => {});
	};

	const options = (data || []).map((item) => (
		<Combobox.Option
			value={`${item?.admission_no} - ${item?.last_name} ${item?.first_name}`}
			key={item?.id}
		>
			{item?.admission_no} - {item?.last_name} {item?.first_name}
		</Combobox.Option>
	));
	useEffect(() => {
		if (value == "" || cleared) {
			setStudent(null);
		}
	}, [value]);
	useEffect(() => {
		if (cleared) {
			setValue("");
		}
	}, [cleared]);
	return (
		<Combobox
			onOptionSubmit={(optionValue) => {
				const f = optionValue.split("-")[0].split("-")[0].trim();
				setValue(optionValue);

				setStudent(data?.find((student: any) => student?.admission_no == f));
				combobox.closeDropdown();
			}}
			withinPortal={false}
			store={combobox}
		>
			<Combobox.Target>
				<TextInput
					label='Student admission no'
					placeholder='Search by admission no '
					value={value}
					onChange={(event) => {
						setValue(event.currentTarget.value);
						fetchOptions(event.currentTarget.value);
						combobox.resetSelectedOption();
						combobox.openDropdown();
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => {
						combobox.openDropdown();
						if (data === null) {
							fetchOptions(value);
						}
					}}
					onBlur={() => combobox.closeDropdown()}
					rightSection={loading && <Loader size={18} />}
					className='w-[25rem]'
				/>
			</Combobox.Target>

			<Combobox.Dropdown hidden={data === null}>
				<Combobox.Options>
					{options}
					{empty && <Combobox.Empty>No results found</Combobox.Empty>}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
