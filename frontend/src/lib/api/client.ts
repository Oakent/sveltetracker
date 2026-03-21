export const api = {
	get: (url: string) => fetch(`http://localhost:3000${url}`).then((r) => r.json()),
	post: (url: string, body: any) =>
		fetch(`http://localhost:3000${url}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}).then((r) => r.json())
};
