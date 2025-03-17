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
export type TaskStore = {
  tasks: Array<Task>;
  getTasks: () => Promise<void>;
  getTaskById: (id: number) => Promise<void>;
  createTask: (value: TaskCreate) => Promise<void>;
  updateTask: (value: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

//task
export type Task = {
  id?: number;
  title: string;
  description: string;
  userId: number;
  categoryId: number;
  isCompleted: boolean;
};
export type TaskCreate = {
  title: string;
  description: string;
  userId: number;
  categoryId: number;
  isCompleted: boolean;
  // createdAt: Date | string;
};

//task-comments
export type TaskComments = {
  taskId: number;
  userId: number;
  content: string;
  // createdAt: Date;
};
export type TaskCommentsStore = {
  taskComments: Array<TaskComments>;
  getTaskCommentsByTaskId: (id: number) => Promise<void>;
  createTaskComments: (value: TaskComments) => Promise<void>;
  deleteTaskComments: (id: number) => Promise<void>;
};

//tasklabel
export type TaskLabels = {
  taskId: number;
  labelId: number;
  labelName: string;
};
export type TaskLabelsStore = {
  taskLabels: Array<TaskLabels>;
  getTaskLabels: () => Promise<void>;
  getTaskLabelsByTaskId: (id: number) => Promise<void>;
  createTaskLabels: (value: TaskLabels) => Promise<void>;
  deleteTaskLabels: (taskId: number, labelId: number) => Promise<void>;
};

//category
export type Category = {
  id: number;
  name: string;
  description: string;
};

export type CategoryStore = {
  categories: Array<Category>;
  getCategories: () => Promise<void>;
};

//task-attachment
export type TaskAttachments = {
  id: number;
  taskId: number;
  FileName: string;
  FileUrl: string;
  // createdAt: Date;
};
export type TaskAttachmentsStore = {
  taskAttachments: Array<TaskAttachments>;
  getTaskAttachmentsByTaskId: (id: number) => Promise<void>;
  createTaskAttachments: (id: number, files: File[]) => Promise<void>;
  deleteTaskAttachments: (id: number) => Promise<void>;
};
