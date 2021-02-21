import { UsePlaylistDetailsType } from 'data/types';
import { FC } from 'react';
import 'twin.macro';
import { ParedownDetails } from '../';

const Summary: FC<{
	paredownDetails: ParedownDetails;
	playlist: UsePlaylistDetailsType['data'];
}> = ({ paredownDetails, playlist }) => {
	return (
		<div tw='flex flex-col'>
			<h2 tw='font-bold mt-1.5 mb-2 text-base text-white text-opacity-70'>Original Playlist</h2>
			<div tw='mb-1.5 flex'>
				<img tw='w-36 h-36 rounded flex-shrink-0' src={playlist.image} />
				<ul tw='px-5 py-1 my-auto w-2/3'>
					<li tw='text-lg font-semibold'>{playlist.name}</li>
					<li tw='break-words truncate whitespace-normal w-full max-h-12'>{playlist.description}</li>

					<li tw='mt-3'>{playlist.tracksTotal} songs</li>
					<li>{playlist.public ? 'Public playlist' : 'Private playlist'}</li>
				</ul>
			</div>

			<h2 tw='font-bold mt-6 mb-2 text-base text-white text-opacity-70'>Pared Down Playlist</h2>
			<div tw='mb-1.5 flex'>
				{paredownDetails.imgArr ? (
					paredownDetails.imgArr.length > 1 ? (
						<div tw='w-36 h-36 grid grid-cols-2 grid-rows-2 rounded flex-shrink-0  overflow-hidden'>
							{paredownDetails.imgArr.map((img: string, i: number) => (
								<img tw='h-full w-full' src={img} key={i} />
							))}
						</div>
					) : (
						<img tw='w-36 h-36 rounded flex-shrink-0' src={paredownDetails.imgArr[0]} />
					)
				) : (
					<div tw='rounded bg-bgray w-36 h-36' />
				)}

				<ul tw='px-5 py-1 my-auto w-2/3'>
					<li tw='text-lg font-semibold'>{paredownDetails.name}</li>
					<li tw='break-words truncate whitespace-normal w-full max-h-12'>{paredownDetails.description}</li>

					<li tw='mt-3'>{paredownDetails.tracksRealTotal} songs</li>
					<li>{paredownDetails.public ? 'Public playlist' : 'Private playlist'}</li>
				</ul>
			</div>
		</div>
	);
};
export default Summary;
