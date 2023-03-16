import { PUBLIC_ABLY_CHANNEL, PUBLIC_COLUMNS, PUBLIC_ROWS } from '$env/static/public';

const app = {
	ablyChannelName: PUBLIC_ABLY_CHANNEL,
	rowCount: Number.parseInt(PUBLIC_ROWS),
	columnCount: Number.parseInt(PUBLIC_COLUMNS)
};

export default app;
