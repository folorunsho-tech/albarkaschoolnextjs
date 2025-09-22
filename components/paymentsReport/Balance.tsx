"use client";
import PaymentLoader from "@/components/PaymentLoader";
import { usePostNormal } from "@/hooks/useQueries";
import { useState } from "react";
import DeptorsFilter from "../filters/DeptorsFilter";

const Balance = () => {
	const { post, loading } = usePostNormal();
	const [queryData, setQueryData] = useState<any[]>([]);

	return (
		<main className='bg-white p-2 divide-y-4'>
			<section className='flex justify-between p-3'>
				<PaymentLoader
					link='/payments'
					post={post}
					// loadCriteria='Sex'
					setQueryData={setQueryData}
				/>
			</section>

			<DeptorsFilter data={queryData} loading={loading} />
		</main>
	);
};

export default Balance;
