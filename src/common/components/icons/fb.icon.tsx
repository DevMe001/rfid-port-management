import * as React from "react"
import { JSX } from "react/jsx-runtime"
import Immutable from "../../../immutable/constant";



const FacebookIcon: React.FC<JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>> = () => (
	<div className='flex justify-between items-center btn bg-blue-800  gap-2 my-5' onClick={() => (window.location.href = `${Immutable.API}/auth/facebook`)}>
		<div className='btn bg-blue-800 w-[15rem] h-[3rem] '>
			<div className='flex justify-center items-center h-full text-white font-semibold text-sm md:text-2xl'>
				<span>Facebook</span>
			</div>
		</div>
		<svg
			style={{
				fontSize: '2rem',
				vectorEffect: 'non-scaling-stroke',
				width: 80,
				height: 50,
				marginTop: '0.875rem',
			}}
			xmlns='http://www.w3.org/2000/svg'
			xmlSpace='preserve'
			viewBox='0 0 512 512'
		>
			<path
				d='m511.96 142.534-1.374 11.223-17.101 135.204L456 326.445H260.256l-42.677-42.599h-47.485V106.805h47.485L323.315 0h49.318v26.797l-18.704 18.704v58.861h119.859z'
				style={{
					fill: '#fdfefe',
				}}
			/>
			<path
				d='M168.032 106.805h37.561v177.041h-37.561zM372.557 0v26.797l-18.628 18.704v58.861h-34.507V45.501l18.628-18.704V0zM511.937 142.543l-18.493 146.411-37.478 37.479H421.45l37.478-37.479 18.493-146.411-38.154-38.162h34.516z'
				style={{
					opacity: 0.07,
					fill: '#040000',
				}}
			/>
			<path
				d='M0 92.911h177.957v235.673H0z'
				style={{
					fill: '#4b70a7',
				}}
			/>
			<path
				d='M353.969 103.293V65.274l-262.24 262.24h86.268v-44.737h39.622l42.676 42.599H456.04l37.485-37.484 17.101-135.204L512 141.465l-38.172-38.172z'
				style={{
					opacity: 0.02,
					fill: '#040000',
				}}
			/>
		</svg>
	</div>
);
export default FacebookIcon
