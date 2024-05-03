export type AccessTokenRequestBody = {
	grant_type?: string | null;
	username: string;
	password: string;
	scope?: string;
	client_id?: string | null;
	client_secret?: string | null;
}

export type AccessTokenResponseBody = {
	access_token: string;
	token_type?: string;
}
