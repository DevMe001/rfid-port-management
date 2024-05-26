import moment from "moment";

function dateArrival(arrivalSchedule: string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	};
	// 	timeZone: 'UTC'
	// timeZoneName: 'short'

	let dateLocale = new Date(arrivalSchedule);

	if (isNaN(dateLocale.getTime())) {
		return 'Invalid Date';
	}

	return dateLocale.toLocaleString('en-US', options);
}




export default dateArrival;