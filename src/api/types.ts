export interface IUser {
  username: string;
  email: string;
  roles: string;
  id: number;
}

export interface IUserResponse {
  token: string;
  user: {
    user: IUser;
  };
}

//task
export type Task = {
  id?: number;
  title: string;
  description: string;
  userId: number;
  categoryId: number;
  isCompleted: boolean;
  categoryName?: string;
  labels?: string[];
};

export type TaskCreate = {
  id?: number;
  title: string;
  description: string;
  userId: number;
  categoryId: number;
  isCompleted: boolean;
  labels?: number[];
};

//task-comments
export type TaskComments = {
  taskId: number;
  userId: number;
  content: string;
};

//tasklabel
export type TaskLabels = {
  taskId: number;
  labelId: number;
  labelName: string;
};
//category
export type Category = {
  id: number;
  name: string;
  description: string;
};

//task-attachment
export type TaskAttachments = {
  id: number;
  taskId: number;
  FileName: string;
  FileUrl: string;
};

//labels
export type Label = {
  id: number;
  name: string;
};
