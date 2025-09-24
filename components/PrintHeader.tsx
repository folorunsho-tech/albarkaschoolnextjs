"use client";
import React from "react";

const PrintHeader = ({ showDate = true }) => {
	return (
		<div className='flex flex-col'>
			{showDate && (
				<p className='self-end p-1 underline'>
					{new Date().toLocaleDateString()}
				</p>
			)}
			<div className='flex justify-center w-full items-start py-2 text-center'>
				<img
					src='/logo.png'
					alt='albarkaschool-logo'
					width={100}
					height={100}
					loading='eager'
				/>
				<div className='flex flex-col gap-1'>
					<div>
						<h2 className='font-serif text-lg'>ALBARKA SCHOOL WAWA.</h2>
						<p className='bg-black text-white text-sm px-1'>
							ROFIA ROAD, WAWA, NEW BUSSA, NIGER STATE.
						</p>
					</div>
					<p className='font-semibold italic text-xs'>
						Email: albarkaschool@yahoo.com
					</p>
					<p className='font-semibold italic text-xs'>
						MOTO: Knowledge for greatness
					</p>
				</div>
			</div>
		</div>
	);
};

export default PrintHeader;
