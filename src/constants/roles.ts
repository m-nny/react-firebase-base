export interface IRoles {
	ADMIN?: string,

	[key: string]: string | undefined,
}

const ROLES = {
	ADMIN: 'ADMIN'
};

export default ROLES;
