import React from 'react';
import RenderIf from '../../../common/components/ui/render-if';
import CatalogDisplay from '../../../common/widget/slider';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import withLayoutWrapper from '../components/layout-wrapper';
import { Paragraph } from '../about';

const ContactUs: React.FC = () => {
	const [toggle] = onToggleNavHomepageMobile();

	return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[100%] sm:h-[60vh]  md:h-[60vh] lg:h-[50vh]'>
				<CatalogDisplay />
				<article>
					<center className='mt-10'>
						<h2 className='text-2xl font-semibold'>Contact Us</h2>
					</center>
					<Paragraph className='flex justify-center items-center leading-[3rem]'>
						<p className='max-w-[50ch]'>Contact Us FOR MORE INFORMATION CONTACT: Call us on: (02) 7954 8800 E-mail: roxasportmindoro@yahoo.com or contact: FRANCIS C. FAMERO Special Assistant on Arts and Cultural Affairs/ MUNICIPAL TOURISM COORDINATOR Roxas, Oriental Mindoro 09216253042</p>
					</Paragraph>
				</article>
			</main>
		</RenderIf>
	);
};

export default withLayoutWrapper(ContactUs);
