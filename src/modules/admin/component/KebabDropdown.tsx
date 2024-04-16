import { useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import RenderIf from "../../../common/components/ui/render-if";

interface KebabMenuProps {
	list: {
		label: string;
		onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
	}[];
}

const KebabMenu: React.FC<KebabMenuProps> = ({ list }) => {
	const [display, setDisplay] = useState<boolean>(false);

	const onToggleBtn = () => {
		setDisplay(!display);
	};

	return (
		<div className='relative' onMouseLeave={() => setDisplay(false)}>
			<GoKebabHorizontal size={25} className='cursor-pointer' onClick={onToggleBtn} />

			<RenderIf value={display}>
				<ul className='absolute bg-white z-10 rounded shadow-md'>
					{list.map((value, i) => (
						<li key={i} className=' border-b border-gray-300 py-1 px-5 cursor-pointer' onClick={value.onClick}>
							<a className='text-accent font-medium'>
								{value.label}
							</a>
						</li>
					))}
				</ul>
			</RenderIf>
		</div>
	);
};

export default KebabMenu;
