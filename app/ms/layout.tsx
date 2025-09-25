/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import NavMenu from "@/components/NavMenu";
import TopBar from "@/components/TopBar";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='h-full'>
			<div className='w-full'>
				<TopBar />
				<NavMenu />
			</div>
			<main className=' py-2 h-screen '>{children}</main>
		</section>
	);
}
