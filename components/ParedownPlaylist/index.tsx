import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Modal, Tracklist, Details, Summary } from '@/components';
import { UsePlaylistDetailsType } from '../../data/types';
import 'twin.macro';
import { nextStepIcon, nextStepText, stepIcon, stepText } from '../../styles';
import { Icons } from '@/icons';
import { UsePlaylistTracksPages } from 'data';

export interface ParedownDetails {
	name: string;
	description: string;
	tracksTotal: number;
	tracksMax: number;
	tracksIsPercent: boolean;
	tracksRealTotal: number;
	public: boolean;
	imgArr: Array<string> | undefined;
}

export interface ParedownStep {
	done: Array<number>;
	active: number;
}

const ParedownPlaylist: FC<{
	playlist: UsePlaylistDetailsType['data'];
	playlistId: string;
	setDisplayPDModal: Dispatch<SetStateAction<boolean>>;
	displayPDModal: boolean;
}> = ({ playlist, playlistId, setDisplayPDModal, displayPDModal }) => {
	const [paredownDetails, setParedownDetails] = useState<ParedownDetails>({
		name: playlist.name,
		description: playlist.description,
		tracksTotal: playlist.tracksTotal,
		tracksRealTotal: playlist.tracksTotal,
		tracksMax: playlist.tracksTotal,
		tracksIsPercent: false,
		public: playlist.public,
		imgArr: undefined,
	});
	const [paredownStep, setParedownStep] = useState<ParedownStep>({
		done: [],
		active: 1,
	});

	const { data: paredownTracks, size, setSize } = UsePlaylistTracksPages(
		paredownStep.done.indexOf(3) > -1 ? playlistId : null,
	);

	function handleParedown() {
		setParedownStep((prevState) => {
			return {
				...prevState,
				done: [...prevState.done, prevState.active],
			};
		});
	}

	useEffect(() => {
		if (paredownTracks && paredownTracks.length > 0) {
			// call API as long as number of tracks typed by an user is bigger than the "next" param on the last data object retrieved from API
			if (paredownDetails.tracksRealTotal > paredownTracks[paredownTracks.length - 1].next) {
				const tracksLimitDif = paredownDetails.tracksRealTotal - paredownTracks[paredownTracks.length - 1].next;
				// change "limit" value on the last data object from API in order to make the last call to an API with the proper limit param value
				// example: for 320 of tracks, the last call should have the limit set to 20
				paredownTracks[paredownTracks.length - 1].limit =
					tracksLimitDif > 0 ? (tracksLimitDif < 100 ? tracksLimitDif : 100) : 100;
				setSize((size) => size + 1);
			}
		}
	}, [paredownDetails.tracksRealTotal, paredownTracks, setSize]);

	useEffect(() => {
		if (paredownTracks && paredownTracks.length > 0) {
			const pages = Math.ceil(paredownDetails.tracksRealTotal / 100);
			// when the last call to the API to retrieve the tracks was called, then make a different call to an API
			// in order to create the Pared Down playlist
			if (pages === size) {
				console.log('call here');
			}
		}
	}, [paredownDetails.tracksRealTotal, size, paredownTracks]);

	return (
		<Modal
			onClose={() => {
				setDisplayPDModal(false);
			}}
			title='Pare Down'
			description='Duplicate your playlist with a pared down number of songs.'
			isOpen={displayPDModal}
			fullWidthAction={() => {
				paredownStep.active === 3
					? handleParedown()
					: paredownStep.active < 3 && paredownStep.active >= 1
					? setParedownStep((prevState) => {
							return {
								...prevState,
								done:
									prevState.done.indexOf(prevState.active) > -1
										? [...prevState.done]
										: [...prevState.done, prevState.active],
								active: prevState.active + 1,
							};
					  })
					: setParedownStep((prevState) => {
							return { ...prevState, active: prevState.active - 1 };
					  });
			}}
			fullWidthText={
				(paredownStep.active === 1 && 'Save Details') ||
				(paredownStep.active === 2 && 'Save Tracklist') ||
				(paredownStep.active === 3 &&
					// make sure that both the first and second step were completed by the user in order to
					// display the pare down button
					([1, 2].every((val) => paredownStep.done.includes(val)) ? 'Pare Down' : undefined))
			}
		>
			<div tw='flex h-full flex-col px-6'>
				<ul tw='flex col-gap-4 pt-6 pb-8'>
					<li
						className='group'
						tw='flex items-center cursor-pointer'
						onClick={() =>
							setParedownStep((prevState) => {
								return { ...prevState, active: 1 };
							})
						}
					>
						<span css={[paredownStep.done.indexOf(1) > -1 || paredownStep.active === 1 ? stepIcon : nextStepIcon]}>
							{paredownStep.done.indexOf(1) > -1 && paredownStep.active !== 1 ? <Icons.Check tw='w-6 h-6' /> : '1'}
						</span>
						<span css={[paredownStep.done.indexOf(1) > -1 || paredownStep.active === 1 ? stepText : nextStepText]}>
							Details
						</span>
					</li>
					<li tw='inline border-b-2 border-bgray-lightest flex-grow mb-3' />
					<li
						className='group'
						tw='flex items-center  cursor-pointer'
						onClick={() =>
							setParedownStep((prevState) => {
								return { ...prevState, active: 2 };
							})
						}
					>
						<span css={[paredownStep.done.indexOf(2) > -1 || paredownStep.active === 2 ? stepIcon : nextStepIcon]}>
							{paredownStep.done.indexOf(2) > -1 && paredownStep.active !== 2 ? <Icons.Check tw='w-6 h-6' /> : '2'}
						</span>
						<span css={[paredownStep.done.indexOf(2) > -1 || paredownStep.active === 2 ? stepText : nextStepText]}>
							Tracklist
						</span>
					</li>
					<li tw='inline border-b-2 border-bgray-lightest flex-grow mb-3' />
					<li
						className='group'
						tw='flex items-center cursor-pointer'
						onClick={() =>
							setParedownStep((prevState) => {
								return { ...prevState, active: 3 };
							})
						}
					>
						<span css={[paredownStep.done.indexOf(3) > -1 || paredownStep.active === 3 ? stepIcon : nextStepIcon]}>
							{paredownStep.done.indexOf(3) > -1 ? <Icons.Check tw='w-6 h-6' /> : '3'}
						</span>
						<span css={[paredownStep.done.indexOf(3) > -1 || paredownStep.active === 3 ? stepText : nextStepText]}>
							Pare Down
						</span>
					</li>
				</ul>
				{paredownStep.active === 1 && (
					<Details paredownDetails={paredownDetails} setParedownDetails={setParedownDetails} />
				)}
				{paredownStep.active === 2 && (
					<Tracklist
						paredownDetails={paredownDetails}
						setParedownDetails={setParedownDetails}
						playlistId={playlistId}
					/>
				)}
				{paredownStep.active === 3 && (
					<Summary paredownDetails={paredownDetails} playlist={playlist} paredownStep={paredownStep} />
				)}
			</div>
		</Modal>
	);
};
export default ParedownPlaylist;
