/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key1 = url.pathname.slice(1);
		let key = `outputs/f6y92C/${key1}`;
		console.log(key1)

		switch (request.method) {
			// case 'PUT':
			// 	await env.MY_BUCKET.put(key, request.body);
			// 	return new Response(`Put ${key} successfully!`);
			case 'GET':
				try {
					console.log("Request came", request.url)
					const object = await env.MY_BUCKET.get(key);
					console.log(object);

					if (object === null) {
						return new Response('Object Not Found', { status: 404 });
					}
					const headers = new Headers();
					object.writeHttpMetadata(headers);
					headers.set('etag', object.httpEtag);

					// const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
					headers.set("Content-Type", 'text/html')

					return new Response(object.body, {
						headers,
					});
				} catch (error) {
					console.log(error);
				}

			// case 'DELETE':
			// 	await env.MY_BUCKET.delete(key);
			// 	return new Response('Deleted!');

			default:
				return new Response('Method Not Allowed', {
					status: 405,
					headers: {
						Allow: 'PUT, GET, DELETE',
					},
				});
		}
	},
};
