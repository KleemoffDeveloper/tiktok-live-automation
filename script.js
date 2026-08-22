import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const username = 'pressurewashingstories';

export const connection = new TikTokLiveConnection(username, {});

connection.connect()
    .then(state => {
        console.log(`Connected to room ${state.roomId}`);
    })
    .catch(error => {
        console.error('Failed to connect:', error);
    });

// connection.on('chat', data => {
//     // console.log(data);
//     // console.log(data.displayId);
//     // console.log(data.content);
//     // console.log(data.avatarThumb?.urlList);
// });
// connection.on('gift', data => {
//     console.log(data);
//     // console.log(data.displayId);
//     // console.log(data.content);
//     // console.log(data.avatarThumb?.urlList);
// });