import Ship1 from '../../../assets/home/ship5.jpg';
import Ship2 from '../../../assets/home/ship02.jpg';
import Ship3 from '../../../assets/home/ship03.webp';
import Ship4 from '../../../assets/home/ship04.jpg';
export type IImage = {
	thumb: string;
	image: string;
};

export const catalogsList: IImage[] = [
	{
		thumb: Ship4,
		image: Ship4,
	},
	{
		thumb: Ship1,
		image: Ship1,
	},
	{
		thumb: Ship2,
		image: Ship2,
	},
	{
		thumb: Ship3,
		image: Ship3,
	},
];
