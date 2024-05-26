import React from 'react'
import RenderIf from '../../../common/components/ui/render-if';
import LoaderSpinner from '../../../common/widget/loader';
import Chatbot from '../../buyers/chatbot';
import FooterMd from '../layout/homepage-footer-md';
import FooterXS from '../layout/homepage-footer-sm';
import HomepageMain from '../layout/homepage-main';
import { onToggleNavHomepageMobile } from '../../../utils/hooks/globa.state';
import Headers from '../layout/homepage-headers';

type WrapperProps={
  children?:React.ReactNode
}


const Layout: React.FC<WrapperProps> = ({ children }) => {
	const [toggle] = onToggleNavHomepageMobile();

	return (
	
			<div className='relative'>
				<div className='grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 max-w-[90rem] mx-auto h-screen sm:h-[100%]' style={{ gridTemplateRows: '10vh repeat(2,1fr) 10vh' }}>
					<Headers />

					{children}

					<RenderIf value={!toggle}>
						<FooterMd />
						<FooterXS />
					</RenderIf>
				</div>
				<Chatbot />
			</div>

	);
};

let LayoutWrapper = React.memo(Layout);



const withLayoutWrapper = <P extends object>(WrapperComponent: React.ComponentType<P & WrapperProps>) => {

    const WithLayoutWrapper: React.FC<P & WrapperProps> = (props) =>(
        <LayoutWrapper>
          <WrapperComponent {...props}/>
        </LayoutWrapper>
    );

    return WithLayoutWrapper;

};



export default withLayoutWrapper;