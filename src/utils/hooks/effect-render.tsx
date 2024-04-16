import { useRef, useEffect, DependencyList } from 'react';

const useSafeRender = (callback: () => void, dependencies: DependencyList) => {
	const mounted = useRef<boolean>(false);

	useEffect(() => {
		mounted.current = true;
		callback();
		return () => {
			mounted.current = false;
		};
	}, dependencies);

	return mounted;
};

export default useSafeRender;
