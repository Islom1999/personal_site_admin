export interface User extends IAdminUser
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}
