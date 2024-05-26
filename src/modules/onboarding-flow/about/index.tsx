import React from 'react'
import RenderIf from '../../../common/components/ui/render-if';
import CatalogDisplay from '../../../common/widget/slider';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import withLayoutWrapper from '../components/layout-wrapper';
import { Interpolation, Theme } from '@emotion/react';

type ParagraphProps = {
	children?: string | React.ReactNode;
	css?: Interpolation<Theme>;
} & React.ComponentProps<'div'>;

export const Paragraph: React.FC<ParagraphProps> = ({ children, ...props }) => {
	return (
		<section className='my-5 text-center'>
			<div {...props}>{children}</div>
		</section>
	);
};



const AboutUs:React.FC = () => {
  
  	const [toggle] = onToggleNavHomepageMobile();

  return (
		<RenderIf value={!toggle}>
			<main className='col-start-1 -col-end-1 row-start-2 row-end-2 h-[100%] sm:h-[60vh]  md:h-[140vh] lg:h-[100vh]'>
				<CatalogDisplay />
				<article>
					<center className='mt-5'>
						<h2 className='text-2xl font-semibold'>About Us</h2>
					</center>
					<Paragraph className='indent-[4rem]'>
						Roxas dubbed as <span className='font-medium'> “Center of Trade</span>, Commerce & Industry in Southern Mindoro, A Promising City” the Municipality of Roxas in Oriental Mindoro, is the transient point for local and foreign tourist, vacationers, and backpackers who want to travel in a less expensive way to reach Caticlan, the jump off points to the fine beach of Boracay Island & Southern Philippine Islands.
					</Paragraph>

					<Paragraph>
						<span>Named after the late President Manuel Roxas, this town was formerly known as “Paclasan”, originally part of Bulalacao, in Oriental Mindoro but was transferred as barrio in Mansalay, Oriental Mindoro.Founded on 1948. </span>
					</Paragraph>
					<Paragraph>The Municipality of Roxas is accessible by all types of vehicle from the southern and northern parts of Mindoro via the national road. It is approximately 148 km or 2 to 3 hours drive on a scenic and smooth road to the City of Calapan.</Paragraph>
					<Paragraph>The town is bounded in the north by the town of Bongabong, Tablas Strait in the east, the town of Mansalay in the south, and in the west is the portion of the town of Bongabong and Mansalay.</Paragraph>
					<Paragraph>The town’s top Industries include tourism, agri-business, aquaculture, and services (shuttle buses and for hire vans that ferries locals and tourist alike to and from the city of Calapan). And because of the growing number of people and cargo transiting in this once laid back community, several commercial establishments mushroomed. The once sleepy town turned into boomtown and is fast urbanizing, it becomes a haven for commerce and eco-tourism business. Thanks to the development of the RORO Port and its inclusion in the western nautical highway it definitely created positive growth.</Paragraph>
					<Paragraph>
						<span className='font-medium'>POINT OF ENTRY:</span> Port of Roxas Located in Barangay Dangay, approximately one (1) kilometer from town proper. Its geographical coordinates consist of;
					</Paragraph>
					<Paragraph>
						<p>LAT: 12° 35′ 30” N </p>
						<p>LONG: 121° 30′ 45″ E</p>
					</Paragraph>
					<Paragraph>
						<p>Roxas Port form part of PGMA’s Strong Republic Nautical Highway (SRNH) project. The Western Nautical seaboard consists of the Ports in:</p>
						<ol type='1' className='mt-5'>
							<li>Batangas</li>
							<li>Calapan, Oriental Mindoro</li>
							<li>Roxas, Oriental Mindoro</li>
							<li>Caticlan, Malay Aklan</li>
							<li>Dumangas, Iloilo</li>
							<li>Bredco Port, Bacolod</li>
							<li>Dumaguete Negros Oriental</li>
							<li>Dapitan, Zamboanga del Norte</li>
						</ol>
					</Paragraph>
					<Paragraph>The SNRH’s western nautical project facilitated the south/north bound movement of people and goods from Batangas City all the way down to Dapitan City and vice versa. Data from source says that from 2003 to 2006, vehicular traffic in Roxas Port increased to 46,218 from 9,269. On 2003 RORO shipping operator in this port is one shipping company alone, but by 2006 it reaches to three (3), as of the month of April 2012 there are four (4) shipping operators in Roxas Port.</Paragraph>
					<Paragraph>TMO Roxas is under the jurisdiction of PMO Calapan/PDO Luzon. Their facilities includes a 7,270 sq. meters of well fenced lot area. Past the gate is a building that housed the office of TMO Roxas, a ticketing booth, and nice passenger waiting lounge complete with amenities such feeding area for nursing mothers, diaper changing area, hot and cold water dispenser, cable television and air-conditioning units and of course clean comfort room (that was clean when I used it). A food kiosk for hungry travelers is available upstairs.</Paragraph>
					<Paragraph>The port has a two (2), 9×9 meter fixed protruding ramp with depth of 4.5 meters designed to accommodate RORO vessels. It also has berthing space for motorized outrigger (banca) that ferries passenger in and out of Odiongan, Romblon (approximate distance of 30 nautical miles) for minimum fare of 335 pesos per person one way.</Paragraph>
					<Paragraph>The port has secured parking provision for travelers called “Park and Sail” so much like one in Domestic Airport. Travelers from Manila or Batangas who brought along their vehicle here, and does not wish to bring their vehicle to Caticlan may leave them at the port for a fee of 40 pesos/hour.</Paragraph>
					<Paragraph>Caticlan Jetty Port in Malay, Aklan is approximately 47 nautical miles from here, a four (4) hours journey for a minimum fare of 400 pesos per person one way. The following are Shipping companies and their corresponding vessels that plies between Roxas and Caticlan (note: vessel departs every two hours at most, from early in the morning until 10PM).</Paragraph>
					<Paragraph>
						<ol type='1' className='mt-5'>
							<li>Montenegro Shipping’s M/V Reina Timotea, M/V Reina Del Cielo, and M/V Reina de los Angeles.</li>
							<li>Starlite’s M/V Starlite Atlantic</li>
							<li>.Asia Marine’s M/V Super Shuttle Ferry 18</li>
							<li>Philharbor’s (Navios Lines) M/V Grand Unity</li>
						</ol>
					</Paragraph>
				</article>
			</main>
		</RenderIf>
	);
}

export default withLayoutWrapper(AboutUs);
