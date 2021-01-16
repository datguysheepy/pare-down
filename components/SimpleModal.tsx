import { Dispatch, SetStateAction, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import ReactDOM from 'react-dom';

const SimpleModalContent = styled.div(() => [
	`
		width: 34vw;
		height: 360px;
		min-width: 652px;
	`,
	tw`bg-bgray-light rounded-md overflow-hidden relative flex flex-col`,
]);

interface SimpleModalType {
	title: string;
	onClose: Dispatch<SetStateAction<boolean>>;
	isOpened: boolean;
	acceptText?: string;
	acceptAction?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const SimpleModal: React.FC<SimpleModalType> = ({
	title,
	onClose,
	children,
	acceptText,
	acceptAction,
	isOpened,
}) => {
	const closeOnEscapeKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'Escape') {
			onClose(false);
		}
	};

	useEffect(() => {
		document.body.addEventListener('keydown', closeOnEscapeKeyDown);

		return () => document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		// disabe scroll for the whole page when Modal is opened (but still display the scrollbar)
		const withScroll = document.body.scrollHeight > document.documentElement.clientHeight;
		document.body.style.top = `-${window.scrollY}px`;
		document.body.style.overflowY = withScroll ? 'scroll' : 'unset';
		document.body.style.position = 'fixed';
		document.body.style.width = '100%';

		// re-enable scroll for the whole page when Modal is about to be unmounted
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.overflow = 'auto';
			document.body.style.position = 'unset';
			window.scrollTo(0, parseInt(scrollY || '0') * -1);
		};
	}, []);

	if (!isOpened) {
		return null;
	}

	return ReactDOM.createPortal(
		<div
			tw='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white'
			onClick={() => onClose(false)}
		>
			<SimpleModalContent onClick={(e) => e.stopPropagation()}>
				<div tw='px-5 py-3 relative flex items-center justify-center'>
					<h2 tw='text-xl font-bold leading-relaxed'>{title}</h2>

					<button
						tw='absolute top-0 right-0 bottom-0 mx-4 text-white text-opacity-80 hover:text-opacity-100'
						onClick={() => onClose(false)}
					>
						<svg tw='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>
				<div tw='px-5 overflow-hidden'>{children}</div>
				<div tw='my-auto flex justify-center pb-2'>
					{acceptText && acceptAction ? (
						<button tw='tracking-wider font-bold bg-bblue rounded-sm px-5 py-0.5 hover:bg-bblue-dark'>
							{acceptText}
						</button>
					) : null}
				</div>
			</SimpleModalContent>
		</div>,
		document.getElementById('__next'),
	);
};
