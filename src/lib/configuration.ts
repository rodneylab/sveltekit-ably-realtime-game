import {
	PUBLIC_ABLY_CHANNEL,
	PUBLIC_COLUMNS,
	PUBLIC_ROWS,
	PUBLIC_GITHUB_PAGE,
	PUBLIC_TWITTER_USERNAME,
} from '$env/static/public';

const app = {
	ablyChannelName: PUBLIC_ABLY_CHANNEL,
	rowCount: Number.parseInt(PUBLIC_ROWS),
	columnCount: Number.parseInt(PUBLIC_COLUMNS),
	githubPage: PUBLIC_GITHUB_PAGE,
	twitterUsername: PUBLIC_TWITTER_USERNAME,
};

export default app;
