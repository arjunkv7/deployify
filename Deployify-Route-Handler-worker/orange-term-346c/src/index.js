/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Client } from 'pg';

export default {
	async fetch(request, env) {
		console.log('Requeist cam herer');
		const client = new Client(env.DB_URL);
		await client.connect();

		const url = new URL(request.url);
		let endPoint = url.pathname;
		let hostname = url.hostname;
		const subdomain = hostname.split('.')[0];
		console.log('this is sub domain', subdomain);
		// Remove starting slash
		// if (endPoint.startsWith('/')) {
		// 	endPoint = endPoint.slice(1);
		// }

		// // Remove ending slash
		// if (endPoint.endsWith('/')) {
		// 	endPoint = endPoint.slice(0, -1);
		// }
		let keysArr = endPoint.split('/');
		// let key = keysArr[0];

		let data = await client.query('SELECT * FROM "websiteKey" WHERE LOWER("uniqueId") = $1', [subdomain]);
		console.log(data.rows);
		let filePath;
		if (endPoint == '/') {
			filePath = data.rows[0]?.defaultPath;
		} else {
			filePath = `${data.rows[0]?.objectPath}/${endPoint}`;
		}

		console.log('filepath', filePath);

		switch (request.method) {
			case 'GET':
				try {
					console.log('Request came', request.url);
					const object = await env.MY_BUCKET.get(filePath);
					console.log(object);
					const headers = new Headers();
					object.writeHttpMetadata(headers);
					headers.set('etag', object.httpEtag);
					if (object === null) {
						// return new Response(data.rows, {
						// 	headers,
						// });
						return new Response('Object Not Found', { status: 404 });
					}

					const type = filePath.endsWith('html') ? 'text/html' : filePath.endsWith('css') ? 'text/css' : 'application/javascript';
					headers.set('Content-Type', type);
					console.log('thisis succ');
					return new Response(object.body, {
						headers,
					});
				} catch (error) {
					console.log('this is error case');
					const headers = new Headers();
					headers.set('Content-Type', 'application/json');

					return new Response(JSON.stringify(data.rows), {
						headers,
					});
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
