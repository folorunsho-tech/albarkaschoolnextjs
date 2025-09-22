"use client";
import NavMenu from "@/components/NavMenu";
import TopBar from "@/components/TopBar";
import React from "react";
import { UserProvider } from "@/context/User";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<UserProvider>
			<section className='h-full'>
				<div className='w-full'>
					<TopBar />
					<NavMenu />
				</div>
				<main className=' py-2 h-screen '>{children}</main>
			</section>
		</UserProvider>
	);
}
