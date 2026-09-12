import { TikTokLiveConnection } from 'tiktok-live-connector';

// const username = 'itsdeaann';
// const username = 'pinkydollreal';
// const username = 'sapoguapo316';
// const username = 'drakostl314';
// const username = 'toxicity.c';
// const username = 'melhardk1';
// const username = 'lookitsvicky';
// const username = 'loganmicke';
// const username = 'mariahandbill';

const connections = new Map();

export function getConnection(username) {
    if (!connections.has(username)) {
        const connection = new TikTokLiveConnection(username, {});

        connection.connect()
            .then(state => {
                console.log(
                    `Connected to @${username} - room ${state.roomId}`
                );
            })
            .catch(error => {
                console.error(
                    `Failed to connect to @${username}:`,
                    error
                );
            });

        connections.set(username, connection);
    }

    return connections.get(username);
}