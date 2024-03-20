import RenderIf from '../../../common/components/ui/render-if';
import CatalogDisplay from '../../../common/widget/slider';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import Ship from '../../../assets/home/ship01.jpg';


const HomepageMain = () => {

  	const [toggle] = onToggleNavHomepageMobile();

  return (
			<RenderIf value={!toggle}>
				<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[100%] sm:h-[60vh]  md:h-[70vh] lg:h-[70vh]'>
					<CatalogDisplay />
					<article>
						<p className='text-navy font-semibold text-center xs:text-xl md:text-4xl my-4 lg:my-10'>Welcome to Port Roxas</p>
					</article>
					<section className='flex flex-col gap-5  w-full mx-auto md:flex-row sm:justify-evenly  sm:items-center lg:my-8 md:gap-0 px-5'>
						<img src={Ship} alt='' className='h-[20rem]  md:h-[25rem] lg:w-[40rem] mx-auto' />

						<article className='max-w-[50ch] text-center leading-7 md:text-left font-medium xs:text-xl md:3xl text-navy'>The Port of Roxas, Oriental Mindoro (Filipino: Pantalan ng Rozas,Oriental Mindoro) or Dangay Port is the seapot in Roxas,Oriental Mindoro in the philippines. The seaport serves as gateway to Mindanao and Visayas from Luzon with passengers being transported from Dangay to Caticlan.</article>
					</section>
				</main>
			</RenderIf>
	);
}

export default HomepageMain
