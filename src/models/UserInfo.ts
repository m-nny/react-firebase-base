import { IRoles } from '../constants/roles';

type UserInfo = {
	uid: string,
	email: string,
	roles: IRoles,
};

export default UserInfo;
