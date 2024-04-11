import { isEmpty} from 'lodash';
import './styles/navigation.style.css';
import useNavigationHandler from '../../../utils/hooks/useNavigationHandler';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import React, { useCallback, useReducer } from 'react';
import RenderIf from './render-if';
import multipleReducerState, { initialMultipleState } from '../../../utils/hooks/useMultipleToggleState';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const liTag = [
	{
		label: 'Port Management',
		iconLeft: `<svg fill="#ffffff" height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-49 -49 588.00 588.00" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-49" y="-49" width="588.00" height="588.00" rx="294" fill="#1707f2" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M483.983,280.212l-35.787-16.899V113.052c0-5.758-4.669-10.425-10.426-10.425H344.2V10.426C344.2,4.668,339.532,0,333.775,0 H156.133c-5.757,0-10.426,4.668-10.426,10.426v92.201H52.143c-5.757,0-10.426,4.667-10.426,10.425V263.31L5.925,280.212 c-8.425,4.782-5.819,13-4.007,15.515l136.647,189.936c1.955,2.723,5.105,4.337,8.46,4.337h195.855c3.355,0,6.505-1.614,8.46-4.337 l136.647-189.936C489.801,293.213,492.67,285.096,483.983,280.212z M166.559,20.851h156.791v81.776H166.559V20.851z M26.155,293.717 l208.373-98.396v273.828h-82.156L26.155,293.717z M240.516,169.434c-0.005,0.002-0.011,0.004-0.016,0.007L62.568,253.464V123.478 h364.777v129.989l-177.937-84.026C244.509,167.101,240.571,169.409,240.516,169.434z M337.536,469.149h-82.157V195.321 l208.374,98.396L337.536,469.149z"></path> <path d="M297.865,268.254l-21.625-15.47l12.136-16.961l21.625,15.47L297.865,268.254z M179.907,251.292l12.136,16.962l21.625-15.47 l-12.136-16.961L179.907,251.292z"></path> </g></svg>`,
	},
	{
		label: 'Dashboard',
		iconLeft: `<svg fill="#1707f2" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-56.32 -56.32 624.64 624.64" xml:space="preserve" stroke="#1707f2" stroke-width="3.5840000000000005" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-56.32" y="-56.32" width="624.64" height="624.64" rx="312.32" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M504.533,379.733h-9.6v-282.7c0-18.8-14.242-33.033-33.062-33.033H52.262c-18.821,0-35.196,14.233-35.196,33.033v282.7 H9.6c-4.713,0-9.6,2.75-9.6,7.467v25.6C0,431.625,16.362,448,35.167,448h443.8C497.771,448,512,431.625,512,412.8v-25.6 C512,382.483,509.246,379.733,504.533,379.733z M34.133,97.033c0-9.392,8.721-15.967,18.129-15.967h409.609 c9.408,0,15.996,6.575,15.996,15.967v282.7h-144c-4.713,0-9.6,2.75-9.6,7.467v9.6h-128v-9.6c0-4.717-2.754-7.467-7.467-7.467 H34.133V97.033z M494.933,412.8c0,9.408-6.575,18.133-15.967,18.133h-443.8c-9.392,0-18.1-8.725-18.1-18.133v-16H179.2v7.467 c0,4.717,4.887,9.6,9.6,9.6h145.067c4.713,0,7.467-4.883,7.467-9.6V396.8h153.6V412.8z"></path> </g> </g> <g> <g> <path d="M453.333,98.133H60.8c-4.713,0-9.6,2.75-9.6,7.467v247.467c0,4.717,4.887,9.6,9.6,9.6h392.533 c4.713,0,7.467-4.883,7.467-9.6V105.6C460.8,100.883,458.046,98.133,453.333,98.133z M443.733,345.6H68.267V115.2h375.467V345.6z"></path> </g> </g> <g> <g> <path d="M393.6,285.867h-240v-25.6h26.667c2.854,0,5.517-1.958,7.1-4.333l25.975-39.234l19.025,37.917 c1.479,2.95,4.479,4.658,7.829,4.65c3.3-0.075,6.262-2.083,7.6-5.1l26.338-59.275l26.337,59.25c1.196,2.692,3.7,4.571,6.621,4.979 c0.392,0.058,0.783,0.081,1.175,0.081c2.512,0,4.921-1.109,6.554-3.067l85.333-102.402c3.017-3.625,2.529-9.008-1.092-12.025 c-3.621-3-9.004-2.525-12.017,1.092l-76.554,91.867L281.929,170.4c-1.367-3.083-4.425-5.067-7.796-5.067 c-3.371,0-6.429,1.983-7.796,5.067l-26.792,60.275l-17.513-35.025c-1.362-2.717-4.067-4.508-7.104-4.7 c-3.054-0.117-5.942,1.792-7.629,4.317L175.7,243.2h-22.1V139.733c0-4.717-3.821-8.533-8.533-8.533 c-4.713,0-8.533,3.817-8.533,8.533v146.133h-16c-4.713,0-8.533,3.817-8.533,8.533c0,4.717,3.821,8.533,8.533,8.533h16v16.2 c0,4.717,3.821,8.533,8.533,8.533c4.713,0,8.533-3.817,8.533-8.533v-16.2h240c4.713,0,8.533-3.817,8.533-8.533 C402.133,289.683,398.313,285.867,393.6,285.867z"></path> </g> </g> </g></svg>`,
		iconRight: false,
		
	},
	{
		label: 'Booking',
		iconLeft: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle style="fill:#FFC130ffffffffff;" cx="255.89" cy="255.998" r="255.89"></circle> <path style="fill:#FFC130fffff;" d="M230.115,510.624L74.169,353.622l337.037-212.999l100.371,101.005c0.212,4.65,0.423,9.51,0.423,14.37 c0,141.365-114.529,255.894-255.894,255.894c-8.664,0-17.327-0.423-25.78-1.268L230.115,510.624L230.115,510.624z"></path> <path style="fill:#1707f2;" d="M132.913,133.439h264.135c9.453,0,17.116,7.663,17.116,17.116v176.654 c0,9.453-7.663,17.116-17.116,17.116H132.913c-9.453,0-17.116-7.663-17.116-17.116V150.555 C115.797,141.102,123.46,133.439,132.913,133.439z"></path> <path style="fill:#1707f2;" d="M410.995,140.624c1.902,2.747,3.17,6.128,3.17,9.72v176.865c0,9.298-7.607,17.116-17.116,17.116 H132.702c-0.845,0-1.902,0-2.747-0.211l280.829-203.49L410.995,140.624L410.995,140.624z"></path> <rect x="139.89" y="150.348" style="fill:#FDFDFD;" width="250.19" height="159.12"></rect> <circle style="fill:#FEFEFE;" cx="264.98" cy="326.368" r="11.411"></circle> <path style="fill:#FFC130;" d="M97.836,339.042l42.896,32.541c7.184-10.143,9.509-9.298,18.595-13.946 c27.47-13.524,55.363-21.342,33.598-42.05c3.804-4.226,6.339-7.607,4.649-12.467c-1.69-5.071-5.494-5.494-9.086-9.509 c14.158-22.399-4.649-20.286-12.89-23.878c14.158-19.652,13.735-16.271,30.428-34.866c2.536-2.958,8.241-8.875,9.509-12.256 c2.324-5.283-2.536-8.664-6.973-7.607c-5.705,1.479-35.922,30.851-42.262,37.402c-8.241,8.452-11.199,11.411-20.92,16.905 c-10.565,6.128-13.735,5.705-20.074,18.173c-8.875,17.327-16.059,35.711-27.681,51.559h0.211V339.042z"></path> <path style="fill:#006775;" d="M91.074,331.224l57.476,43.741c1.057,0.845,1.268,2.536,0.423,3.592l-13.946,18.173 c-0.845,1.057-2.536,1.268-3.592,0.423l-57.476-43.741c-1.057-0.845-1.268-2.536-0.423-3.592l13.946-18.173 C88.327,330.59,90.017,330.379,91.074,331.224z"></path> <path style="fill:#E87D04;" d="M253.359,181.829v-21.765h4.437v8.664h8.664v-8.664h4.438v21.765h-4.438v-9.509h-8.664v9.509H253.359 z M274.489,171.052c0-2.324,0.423-4.015,1.057-5.705c0.423-1.057,1.268-2.113,2.113-2.958s1.902-1.479,2.747-1.902 c1.268-0.634,2.958-0.845,4.649-0.845c3.17,0,5.705,1.057,7.818,2.958c1.902,1.902,2.958,4.86,2.958,8.241 c0,3.592-1.057,6.339-2.958,8.241c-1.902,1.902-4.437,2.958-7.607,2.958s-5.917-1.057-7.818-2.958 c-1.902-1.902-2.958-4.649-2.958-8.241v0.211H274.489z M278.927,170.841c0,2.536,0.634,4.437,1.69,5.705 c1.057,1.268,2.536,1.902,4.437,1.902c1.69,0,3.17-0.634,4.437-1.902c1.057-1.268,1.69-3.17,1.69-5.705s-0.634-4.437-1.69-5.705 s-2.536-1.902-4.437-1.902c-1.902,0-3.381,0.634-4.437,1.902C279.561,166.403,278.927,168.305,278.927,170.841z M303.861,181.829 v-18.173h-6.551v-3.592h17.327v3.592h-6.339v18.173H303.861z M317.596,181.829v-21.765h16.059v3.592h-11.833v4.86h10.988v3.592 h-10.988v5.917h12.256v3.592h-16.482V181.829z M338.093,181.829v-21.553h4.438v17.961h10.988v3.592H338.093z"></path> <path style="fill:#FFC130ffffffffff;" d="M261.811,191.972h83.467c5.283,0,9.72,4.437,9.72,9.72v81.565H252.302v-81.565 c0-5.283,4.437-9.72,9.72-9.72H261.811z"></path> <rect x="252.09" y="280.088" style="fill:#FFC130fffff;" width="102.7" height="8.241"></rect> <path style="fill:#663333;" d="M256.106,273.537l1.479,21.342h-6.551l2.958-21.342H256.106z"></path> <path style="fill:#17BF41;" d="M254.838,247.123c5.283,0,9.72,4.226,9.72,9.72c0,1.902-0.634,3.592-1.479,5.071 c4.649,0.634,8.241,4.86,8.241,9.72c0,5.283-4.437,9.72-9.72,9.72c-2.747,0-5.071-1.057-6.762-2.747 c-1.69,2.113-4.226,3.381-6.973,3.381c-4.86,0-8.875-4.015-8.875-8.875s4.015-8.875,8.875-8.875c0.423,0,0.634,0,1.057,0 c-2.113-1.69-3.592-4.437-3.592-7.396c0-5.283,4.226-9.72,9.72-9.72L254.838,247.123L254.838,247.123z"></path> <path style="fill:#663333;" d="M355.421,273.537l1.479,21.342h-6.551l2.958-21.342H355.421z"></path> <path style="fill:#17BF41;" d="M354.153,247.123c5.283,0,9.72,4.226,9.72,9.72c0,1.902-0.634,3.592-1.479,5.071 c4.649,0.634,8.241,4.86,8.241,9.72c0,5.283-4.437,9.72-9.72,9.72c-2.747,0-5.071-1.057-6.762-2.747 c-1.69,2.113-4.226,3.381-6.973,3.381c-4.86,0-8.875-4.015-8.875-8.875s4.015-8.875,8.875-8.875c0.423,0,0.634,0,1.057,0 c-2.113-1.69-3.592-4.437-3.592-7.396c0-5.283,4.226-9.72,9.72-9.72L354.153,247.123L354.153,247.123z"></path> <rect x="248.5" y="287.488" style="fill:#B3B3B3;" width="110.09" height="11.411"></rect> <g> <rect x="281.46" y="253.458" style="fill:#999999;" width="44.16" height="26.625"></rect> <path style="fill:#999999;" d="M262.234,220.71h13.524v9.509h-13.524V220.71z M311.468,220.71h13.524v9.509h-13.524V220.71z M331.331,220.71h13.524v9.509h-13.524V220.71z M331.331,236.346h13.524v9.509h-13.524V236.346z M311.468,236.346h13.524v9.509 h-13.524V236.346z M282.097,220.71h13.524v9.509h-13.524V220.71z M282.097,236.346h13.524v9.509h-13.524V236.346z M262.234,236.346 h13.524v9.509h-13.524V236.346z"></path> </g> <path style="fill:#E87D04;" d="M269.418,197.677l1.479,4.649h4.86l-4.015,2.747l1.479,4.649l-4.015-2.747l-4.015,2.747l1.479-4.649 l-4.015-2.747h4.86l1.479-4.649H269.418z M284.421,196.409l1.902,5.494h5.917l-4.649,3.381l1.902,5.494l-4.649-3.381l-4.649,3.381 l1.902-5.494l-4.649-3.381h5.917l1.902-5.494H284.421z M337.459,197.677l-1.479,4.649h-4.86l4.015,2.747l-1.479,4.649l4.015-2.958 l4.015,2.958l-1.479-4.649l4.015-2.747h-4.86l-1.479-4.649H337.459z M322.456,196.409l-1.902,5.494h-5.917l4.649,3.381l-1.902,5.494 l4.649-3.381l4.649,3.381l-1.902-5.494l4.649-3.381h-5.917l-1.902-5.494H322.456z M303.439,195.141l-2.113,6.551h-6.973l5.494,4.015 l-2.113,6.551l5.494-4.015l5.494,4.015l-2.113-6.551l5.494-4.015h-6.973l-2.113-6.551H303.439z"></path> <path style="fill:#999999;" d="M266.671,253.251h9.72v7.607h-9.72V253.251z M330.486,253.251h9.72v7.607h-9.72V253.251z"></path> <g> <rect x="151.72" y="165.768" style="fill:#808080;" width="82.83" height="5.917"></rect> <rect x="151.72" y="181.408" style="fill:#808080;" width="82.83" height="5.917"></rect> <rect x="151.72" y="197.038" style="fill:#808080;" width="61.913" height="5.917"></rect> </g> </g></svg>`,
		booking: true,
	},
	{
		label: 'Schedule',
		iconLeft: `<svg viewBox="-4.75 -4.75 34.50 34.50" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-4.75" y="-4.75" width="34.50" height="34.50" rx="17.25" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#1707f2;}</style> </defs> <g id="schedule"> <path class="cls-1" d="M22.5,3H21V2a1,1,0,0,0-1-1H19a1,1,0,0,0-1,1V3H14V2a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1V3H7V2A1,1,0,0,0,6,1H5A1,1,0,0,0,4,2V3H2.5A1.5,1.5,0,0,0,1,4.5v18A1.5,1.5,0,0,0,2.5,24h16A5.51,5.51,0,0,0,24,18.5s0-.08,0-.13,0,0,0,0V4.5A1.5,1.5,0,0,0,22.5,3ZM19,2l1,0,0,3L19,5ZM12,2l1,0V3.44s0,0,0,.06,0,0,0,.07L13,5,12,5ZM5,2,6,2,6,5,5,5ZM2.5,4H4V5A1,1,0,0,0,5,6H6A1,1,0,0,0,7,5V4h4V5a1,1,0,0,0,1,1H13a1,1,0,0,0,1-1V4h4V5a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V4h1.5a.5.5,0,0,1,.5.5V8H2V4.5A.5.5,0,0,1,2.5,4Zm16,19A4.5,4.5,0,1,1,23,18.5,4.51,4.51,0,0,1,18.5,23Zm0-10a5.49,5.49,0,0,0-3.15,10H2.5a.5.5,0,0,1-.5-.5V9H23v6.35A5.49,5.49,0,0,0,18.5,13Z"></path> <path class="cls-1" d="M20.72,19.05,19,18.19V16.5a.5.5,0,0,0-1,0v2a.51.51,0,0,0,.28.45l2,1a.54.54,0,0,0,.22.05.5.5,0,0,0,.22-.95Z"></path> </g> </g></svg>`,
		schedule: true,
	},

	{
		label: 'Wallet',
		iconLeft: `<svg viewBox="-0.73 -0.73 74.46 74.46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-0.73" y="-0.73" width="74.46" height="74.46" rx="37.23" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>the-modern-web/payment-request-api</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="the-modern-web/payment-request-api" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="container" transform="translate(2.000000, 2.000000)" fill="#FFFFFF" fill-rule="nonzero" stroke="#fffffffffffff" stroke-width="2"> <rect id="mask" x="-1" y="-1" width="71" height="71" rx="14"> </rect> </g> <g id="debit-card" transform="translate(15.000000, 14.000000)" fill-rule="nonzero"> <path d="M41.3153241,12.5251003 L33.3794605,4.57413959 L33.3794605,36.4360484 L44,36.4360484 L44,18.9808646 C44,16.5571949 43.0334935,14.2336887 41.3153241,12.5251003 Z" id="Shape" fill="#FFB782"> </path> <path d="M6.20288744,30.6303315 L0.203520885,15.0559016 C-0.398622236,13.4924778 0.380331541,11.7362753 1.94462623,11.1338418 L30.2616132,0.226456926 C31.8250369,-0.37568627 33.5812394,0.403267507 34.1833826,1.96756227 L40.1827492,17.5419922 C40.7848924,19.105416 40.0059386,20.8616185 38.4416438,21.4640519 L10.1255279,32.3714369 C8.56123311,32.97358 6.80590157,32.1937553 6.20288744,30.6303315 Z" id="Shape" fill="#DE4C3C"> </path> <polygon id="Shape" fill="#7A4930" points="36.3454656 7.57817782 2.39289481 20.7388091 4.6536898 26.6075275 38.6077122 13.452993"> </polygon> <path d="M0.000290329392,19.7464633 L0.000290329392,3.05687815 C0.000290329392,1.3810969 1.35903186,0.0223553446 3.03481311,0.0223553446 L33.3794605,0.0223553446 C35.0552418,0.0223553446 36.4139833,1.3810969 36.4139833,3.05687815 L36.4139833,19.7464633 C36.4139833,21.4222445 35.0552418,22.780986 33.3794605,22.780986 L3.03481311,22.780986 C1.35903186,22.780986 0.000290329392,21.4222445 0.000290329392,19.7464633 Z" id="Shape" fill="#1707f2"> </path> <path d="M33.3794605,0.0223553446 L30.1553526,0.0223553446 L7.3967219,22.780986 L33.3794605,22.780986 C35.0552418,22.780986 36.4139833,21.4222445 36.4139833,19.7464633 L36.4139833,3.05687815 C36.4139833,1.3810969 35.0552418,0.0223553446 33.3794605,0.0223553446 Z" id="Shape" fill="#1707f2"> </path> <polygon id="Shape" fill="#ffffffff" points="3.03481311 12.1601562 6.06933592 12.1601562 6.06933592 13.6774177 3.03481311 13.6774177"> </polygon> <polygon id="Shape" fill="#ffffffff" points="3.03481311 16.7119404 6.06933592 16.7119404 6.06933592 18.2292019 3.03481311 18.2292019"> </polygon> <polygon id="Shape" fill="#ffffffff" points="16.6898755 16.7119404 19.7243982 16.7119404 19.7243982 18.2292019 16.6898755 18.2292019"> </polygon> <polygon id="Shape" fill="#ffffffff" points="7.58659736 12.1601562 10.6208299 12.1601562 10.6208299 13.6774177 7.58659736 13.6774177"> </polygon> <polygon id="Shape" fill="#ffffffff" points="12.1380912 12.1601562 15.172614 12.1601562 15.172614 13.6774177 12.1380912 13.6774177"> </polygon> <polygon id="Shape" fill="#ffffffff" points="16.6898755 12.1601562 19.7243982 12.1601562 19.7243982 13.6774177 16.6898755 13.6774177"> </polygon> <polygon id="Shape" fill="#ffffffff" points="31.1035684 3.05687815 32.6208299 3.05687815 32.6208299 5.33277027 31.1035684 5.33277027"> </polygon> <polygon id="Shape" fill="#ffffffff" points="28.0690456 3.05687815 29.586307 3.05687815 29.586307 5.33277027 28.0690456 5.33277027"> </polygon> <polygon id="Shape" fill="#ffffffff" points="25.0345228 3.05687815 26.5517842 3.05687815 26.5517842 5.33277027 25.0345228 5.33277027"> </polygon> <polygon id="Shape" fill="#ffffffff" points="22.0002903 3.05687815 23.5172614 3.05687815 23.5172614 5.33277027 22.0002903 5.33277027"> </polygon> <polygon id="Shape" fill="#1707f2" points="30.3449377 36.4360484 44 36.4360484 44 44.022065 30.3449377 44.022065"> </polygon> <path d="M28.1184016,13.7267736 C26.8316617,12.4446791 24.7494194,12.4484533 23.4673248,13.7351932 C22.2276182,14.9792546 22.1846495,16.9781725 23.3694837,18.2747836 L29.586307,25.0568781 C27.7177471,28.3271484 27.7975876,32.3598237 29.7933119,35.5537373 L30.3449377,36.4360484 L40.2068465,36.4360484 L40.2068465,25.8155089 L28.1184016,13.7267736 Z" id="Shape" fill="#FFB782"> </path> <polygon id="Shape" fill="#fff" points="32.6208299 38.7119404 34.1380912 38.7119404 34.1380912 40.2292019 32.6208299 40.2292019"> </polygon> <path d="M3.03481311,7.91205659 L3.03481311,4.27074539 C3.03481311,3.60008446 3.57801943,3.05687815 4.24868028,3.05687815 L7.88999155,3.05687815 C8.56065249,3.05687815 9.10356841,3.60008446 9.10356841,4.27074539 L9.10356841,7.91205659 C9.10356841,8.58271745 8.56065249,9.12592376 7.88999155,9.12592376 L4.24868028,9.12592376 C3.57801943,9.12592376 3.03481311,8.58271745 3.03481311,7.91205659 Z" id="Shape" fill="#FDB62F"> </path> <polygon id="Shape" fill="#FD7B2F" points="3.03481311 5.33277027 5.31070524 5.33277027 5.31070524 6.85003164 3.03481311 6.85003164"> </polygon> <polygon id="Shape" fill="#FD7B2F" points="6.82796668 5.33277027 9.10356841 5.33277027 9.10356841 6.85003164 6.82796668 6.85003164"> </polygon> <path d="M39.4482158,25.8155089 C39.2473079,25.8155089 39.0539485,25.7356683 38.9119774,25.5931166 L35.8774546,22.5585938 C35.5862542,22.2575222 35.5946738,21.7773173 35.8966163,21.4858266 C36.1910104,21.2021748 36.6566987,21.2021748 36.9502217,21.4858266 L39.9847445,24.5203494 C40.2805901,24.8170661 40.2805901,25.2972709 39.9847445,25.5931166 C39.8419025,25.7356683 39.6494141,25.8155089 39.4482158,25.8155089 Z" id="Shape" fill="#F2A46F"> </path> </g> </g> </g></svg>`,
		iconRight: false,
	},
	{
		label: 'Settings',
		iconLeft: `<svg fill="#1707f2" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="-261.01 -261.01 1454.20 1454.20" xml:space="preserve" stroke="#1707f2" stroke-width="0.932179"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-261.01" y="-261.01" width="1454.20" height="1454.20" rx="727.1" fill="#fafafa" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M61.2,341.538c4.9,16.8,11.7,33,20.3,48.2l-24.5,30.9c-8,10.1-7.1,24.5,1.9,33.6l42.2,42.2c9.1,9.1,23.5,9.899,33.6,1.899 l30.7-24.3c15.8,9.101,32.6,16.2,50.1,21.2l4.6,39.5c1.5,12.8,12.3,22.4,25.1,22.4h59.7c12.8,0,23.6-9.601,25.1-22.4l4.4-38.1 c18.8-4.9,36.8-12.2,53.7-21.7l29.7,23.5c10.1,8,24.5,7.1,33.6-1.9l42.2-42.2c9.1-9.1,9.9-23.5,1.9-33.6l-23.1-29.3 c9.6-16.601,17.1-34.3,22.1-52.8l35.6-4.1c12.801-1.5,22.4-12.3,22.4-25.1v-59.7c0-12.8-9.6-23.6-22.4-25.1l-35.1-4.1 c-4.801-18.3-12-35.8-21.199-52.2l21.6-27.3c8-10.1,7.1-24.5-1.9-33.6l-42.1-42.1c-9.1-9.1-23.5-9.9-33.6-1.9l-26.5,21 c-17.2-10.1-35.601-17.8-54.9-23l-4-34.3c-1.5-12.8-12.3-22.4-25.1-22.4h-59.7c-12.8,0-23.6,9.6-25.1,22.4l-4,34.3 c-19.8,5.3-38.7,13.3-56.3,23.8l-27.5-21.8c-10.1-8-24.5-7.1-33.6,1.9l-42.2,42.2c-9.1,9.1-9.9,23.5-1.9,33.6l23,29.1 c-9.2,16.6-16.2,34.3-20.8,52.7l-36.8,4.2c-12.8,1.5-22.4,12.3-22.4,25.1v59.7c0,12.8,9.6,23.6,22.4,25.1L61.2,341.538z M277.5,180.038c54.4,0,98.7,44.3,98.7,98.7s-44.3,98.7-98.7,98.7c-54.399,0-98.7-44.3-98.7-98.7S223.1,180.038,277.5,180.038z"></path> <path d="M867.699,356.238l-31.5-26.6c-9.699-8.2-24-7.8-33.199,0.9l-17.4,16.3c-14.699-7.1-30.299-12.1-46.4-15l-4.898-24 c-2.5-12.4-14-21-26.602-20l-41.1,3.5c-12.6,1.1-22.5,11.4-22.9,24.1l-0.799,24.4c-15.801,5.7-30.701,13.5-44.301,23.3 l-20.799-13.8c-10.602-7-24.701-5-32.9,4.7l-26.6,31.7c-8.201,9.7-7.801,24,0.898,33.2l18.201,19.399 c-6.301,14.2-10.801,29.101-13.4,44.4l-26,5.3c-12.4,2.5-21,14-20,26.601l3.5,41.1c1.1,12.6,11.4,22.5,24.1,22.9l28.1,0.899 c5.102,13.4,11.801,26.101,19.9,38l-15.699,23.7c-7,10.6-5,24.7,4.699,32.9l31.5,26.6c9.701,8.2,24,7.8,33.201-0.9l20.6-19.3 c13.5,6.3,27.699,11,42.299,13.8l5.701,28.2c2.5,12.4,14,21,26.6,20l41.1-3.5c12.6-1.1,22.5-11.399,22.9-24.1l0.9-27.601 c15-5.3,29.199-12.5,42.299-21.399l22.701,15c10.6,7,24.699,5,32.9-4.7l26.6-31.5c8.199-9.7,7.799-24-0.9-33.2l-18.301-19.399 c6.701-14.2,11.602-29.2,14.4-44.601l25-5.1c12.4-2.5,21-14,20-26.601l-3.5-41.1c-1.1-12.6-11.4-22.5-24.1-22.9l-25.1-0.8 c-5.201-14.6-12.201-28.399-20.9-41.2l13.699-20.6C879.4,378.638,877.4,364.438,867.699,356.238z M712.801,593.837 c-44.4,3.801-83.602-29.3-87.301-73.699c-3.801-44.4,29.301-83.601,73.699-87.301c44.4-3.8,83.602,29.301,87.301,73.7 C790.301,550.938,757.199,590.138,712.801,593.837z"></path> <path d="M205,704.438c-12.6,1.3-22.3,11.899-22.4,24.6l-0.3,25.3c-0.2,12.7,9.2,23.5,21.8,25.101l18.6,2.399 c3.1,11.301,7.5,22.101,13.2,32.301l-12,14.8c-8,9.899-7.4,24.1,1.5,33.2l17.7,18.1c8.9,9.1,23.1,10.1,33.2,2.3l14.899-11.5 c10.5,6.2,21.601,11.101,33.2,14.5l2,19.2c1.3,12.6,11.9,22.3,24.6,22.4l25.301,0.3c12.699,0.2,23.5-9.2,25.1-21.8l2.3-18.2 c12.601-3.101,24.601-7.8,36-14l14,11.3c9.9,8,24.101,7.4,33.201-1.5l18.1-17.7c9.1-8.899,10.1-23.1,2.301-33.2L496.6,818.438 c6.6-11,11.701-22.7,15.201-35l16.6-1.7c12.6-1.3,22.299-11.9,22.4-24.6l0.299-25.301c0.201-12.699-9.199-23.5-21.799-25.1 l-16.201-2.1c-3.1-12.2-7.699-24-13.699-35l10.1-12.4c8-9.9,7.4-24.1-1.5-33.2l-17.699-18.1c-8.9-9.101-23.102-10.101-33.201-2.3 l-12.101,9.3c-11.399-6.9-23.6-12.2-36.399-15.8l-1.601-15.7c-1.3-12.601-11.899-22.3-24.6-22.4l-25.3-0.3 c-12.7-0.2-23.5,9.2-25.101,21.8l-2,15.601c-13.199,3.399-25.899,8.6-37.699,15.399l-12.5-10.2c-9.9-8-24.101-7.399-33.201,1.5 l-18.2,17.801c-9.1,8.899-10.1,23.1-2.3,33.199l10.7,13.801c-6.2,11-11.1,22.699-14.3,35L205,704.438z M368.3,675.837 c36.3,0.4,65.399,30.301,65,66.601c-0.4,36.3-30.301,65.399-66.601,65c-36.3-0.4-65.399-30.3-65-66.601 C302.1,704.538,332,675.438,368.3,675.837z"></path> </g> </g></svg>`,
		setting: true,
	},
	{
		label: 'Sign out',
		iconLeft: `<svg viewBox="-3.6 -3.6 31.20 31.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-3.6" y="-3.6" width="31.20" height="31.20" rx="15.6" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z" fill="#1707f2"></path> <path d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z" fill="#1707f2"></path> </g></svg>`,
		iconRight: false,
	},
];

type ListItem={
		label:string,
		url:string
	};
type ListProps = {
	list: ListItem[];
};

type Icon = {
	dropUpShow: boolean;
	dropDownShow: boolean;
};


const RenderDropdown: React.FC<ListProps> = ({ list }) => {

	const navigate = useNavigate();

	return (
		<>
			{list &&
				list.map((item, index) => (
					<li
						onClick={() => navigate(item.url)}
						className={clsx('bg-lite text-center leading-7 font-medium !rounded-none hover:bg-transparent border-b border-1 border-gray-300 mb-1 py-1 cursor-pointer', {
							'mt-2': index === 0,
						})}
						key={index}
					>
						{item.label}
					</li>
				))}
		</>
	);
};



const RenderDropdownIcon: React.FC<Icon> = ({ dropUpShow, dropDownShow }) => {
	return (
		<>
			<RenderIf value={dropUpShow}>
				<IoIosArrowDropup size={30} />
			</RenderIf>
			<RenderIf value={dropDownShow}>
				<IoIosArrowDropdown size={30} />
			</RenderIf>
		</>
	);
};


const Navigation:React.FC = ()=>{

    const [onHandlerNavigationEvent] = useNavigationHandler();
		const [{ booking, settings, schedule }, dispatch] = useReducer(multipleReducerState, initialMultipleState);

  

		const onTabToggle = useCallback(
			(label: string) => {
				onHandlerNavigationEvent(label);
				if (label.toLowerCase().includes('booking')) {
					dispatch({ type: 'booking' });
				}
				if (label.toLowerCase().includes('settings')) {
					dispatch({ type: 'setting' });
				}

				if (label.toLowerCase().includes('schedule')) {
					dispatch({ type: 'schedule' });
				}
			},
			[booking, settings, schedule],
		);






    return (
			<div data-title='navigation' className='navigation'>
				<ul>
					{!isEmpty(liTag) &&
						liTag.map((list, i) => (
							<>
								<li key={i} onClick={() => onTabToggle(list.label)}>
									<a href='#' className='flex gap-5 items-center pr-5'>
										<span className='w-2/12 icon px-2 py-2' dangerouslySetInnerHTML={{ __html: list.iconLeft }}></span>
										<span className='w-7/12 title'>{list.label} </span>

										<RenderDropdownIcon dropUpShow={(list.booking as boolean) && booking} dropDownShow={(list.booking as boolean) && !booking} />
										<RenderDropdownIcon dropUpShow={(list.schedule as boolean) && schedule} dropDownShow={(list.schedule as boolean) && !schedule} />
										<RenderDropdownIcon dropUpShow={(list.setting as boolean) && settings} dropDownShow={(list.setting as boolean) && !settings} />
									</a>
								</li>

								<RenderIf value={(list.booking as boolean) && booking}>
									<RenderDropdown
										list={[
											{ label: 'Booking Record', url: '#' },
											{ label: 'RFID slot', url: '/admin-dasboard/rfid-slot' },
											{ label: 'Passengers', url: '#' },
										]}
									/>
								</RenderIf>

								<RenderIf value={(list.schedule as boolean) && schedule}>
									<RenderDropdown
										list={[
											{ label: 'Schedule Record', url: '#' },
											{ label: 'Vehicle', url: '#' },
										]}
									/>
								</RenderIf>
								<RenderIf value={(list.setting as boolean) && settings}>
									<RenderDropdown list={[{label:'User',url:'#'}]} />
								</RenderIf>
							</>
						))}
				</ul>
			</div>
		);
}


export default Navigation