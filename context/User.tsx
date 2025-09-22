/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useFetchSingle } from "@/hooks/useQueries";
import { ReactNode, createContext, useEffect, useState } from "react";
import getCookie from "./getCookie";
import { useRouter } from "next/navigation";

const userContext = createContext<{
	user: any;
	permissions: any;
	setUser: any;
	setPerm: any;
}>({
	user: null,
	permissions: [],
	setUser: () => {},
	setPerm: () => {},
});
const UserProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const { fetch } = useFetchSingle();
	const [user, setUser] = useState<any>(null);
	const [permissions, setPerm] = useState<any[]>([]);
	const getData = async () => {
		const cookie = await getCookie("token");
		if (cookie?.value) {
			const { data, status } = await fetch(`/auth/me`);
			if (status === 404) {
				router.push("/login");
			}
			setUser(data);
			setPerm(data?.menu);
		}
	};
	useEffect(() => {
		getData();
	}, []);
	return (
		<userContext.Provider
			value={{
				user,
				setUser,
				permissions,
				setPerm,
			}}
		>
			{children}
		</userContext.Provider>
	);
};

export { userContext, UserProvider };
