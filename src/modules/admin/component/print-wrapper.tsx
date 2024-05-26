import React from 'react';

type Wrapper = {
	children?: React.ReactNode;
};

const PrintDocuments: React.FC<Wrapper> = React.memo(({ children }) => {
	return (
		<div>

				{children}

			<style>
				{`
					.printRecord{
						display:none;
					}
					

          @media print {
            /* Hide everything except the component to be printed */
            body > * { display: none; }
            div[role="printable"],printRecord { display: block; }

            /* Force landscape orientation */
            @page {
              size: landscape;
            }

				

			
        `}
			</style>
		</div>
	);
});

const withPrintDocument = <P extends object>(WrappedComponent: React.ComponentType<P & Wrapper>) => {
	const WithAdminWrapper: React.FC<P & Wrapper> = (props) => (
		<PrintDocuments>
			<WrappedComponent {...props} />
		</PrintDocuments>
	);

	return WithAdminWrapper;
};

export default withPrintDocument;
