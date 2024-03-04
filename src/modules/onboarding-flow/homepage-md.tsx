import Hero from '../../assets/home/hero.jpg';
import Ship from '../../assets/home/ship01.jpg';
import Logo from '../../assets/home/logo.png';

const HomePage = () => {
  return (
		<div className='mx-auto w-full max-w-[90rem] grid grid-cols-2 gap-[1rem] justify-center px-[2rem]'>
			{/* Header */}
			<header className='col-start-1 col-end-3 row-start-1 row-end-2 bg-red-100 h-[80px]'>
				<div className='grid grid-cols-2 gap-[2rem] justify-between p-5'>
					<div className='logo'>
						<img src={Logo} alt="logo" width='80' height='80'/>
					</div>
					{/* navigation */}
					<nav>
						<ul className='ul flex justify-between items-center h-full'>
							<li>Home</li>
							<li>Book</li>
							<li>Schedule</li>
							<li>About us</li>
							<li>Contact Us</li>
							<li>Log in</li>
						</ul>
					</nav>
					{/* end navigation */}`
				</div>
			</header>

			{/* Hero */}
			<div className='hero col-start-1 col-end-3 row-start-2 row-end-3 h-[50vh]' style={{ background: `url(${Hero})`, backgroundSize: 'cover' }}>
				Hero
			</div>

			{/* Thumbnail */}
			<div className='thumbnail col-start-1 col-end-2 row-start-3 row-end-4 bg-red-200 h-[50vh]' style={{ background: `url(${Ship})`, backgroundSize: 'contain' }}>
				Box 1
			</div>

			{/* Details */}
			<div className='details col-start-2 col-end-3 row-start-3 row-end-4 bg-red-200 h-[50vh'>Box 2</div>

			{/* Footer */}
			<footer className='col-start-1 col-end-3 row-start-4 row-end-5 bg-red-100 h-[30vh]'>
				<div className='list grid grid-cols-3 gap-[2rem]'>
					<div className='list-item col-span-1 bg-red-300 h-[40vh]'>Box 1</div>
					<div className='list-item col-span-1 bg-red-700 h-[40vh]'>Box 2</div>
					<div className='list-item col-span-1 bg-red-800 h-[40vh]'>Box 3</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;

