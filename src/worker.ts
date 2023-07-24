export interface Env {
	telegram_secret: string;
}

const testflight_url = new URL('https://testflight.apple.com/join/u6iogfd0');

const new_message = (token: string, text: string) =>
	new URL(`https://api.telegram.org/bot${token}/sendMessage?` + new URLSearchParams({ chat_id: '@betaslotsworker', text }));

const check_testflight = (token: string) =>
	fetch(testflight_url)
		.then((response) => response.text())
		.then(async (response_text) => {
			if (!response_text.includes('beta is full.')) {
				await fetch(new_message(token, testflight_url.toString())).then(() => new Response('open'));
			}
			return new Response('full');
		});

export default {
	async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<Response> {
		return await check_testflight(env.telegram_secret);
	},
	async fetch(_request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		return await check_testflight(env.telegram_secret);
	},
};
