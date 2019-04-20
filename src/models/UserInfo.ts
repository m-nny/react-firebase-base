import { IRoles } from '../constants/roles';

type UserInfo = {
	uid: string,
	email: string,
	roles: IRoles,
	emailVerified: boolean,
	providerData: (firebase.UserInfo | null)[]
};

export default UserInfo;
