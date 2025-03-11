export interface IUser {
    username: string;
    email: string;
    roles: string;
    id: string;
  }
  
  export interface IUserResponse {
    token: string;
    user: {
      user: IUser;
    };
  }
  