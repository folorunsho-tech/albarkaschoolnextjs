/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import getUser from "./getUser";
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
	const [user, setUser] = useState<any>(null);
	const [permissions, setPerm] = useState<any[]>([]);
	const getData = async () => {
		const user: any = await getUser("albarkaschooltoken");
		if (!user) {
			router.push("/login");
		} else {
			setUser(user);
			setPerm(user?.menu);
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
