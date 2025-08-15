export const UserRoleEnums = { // Object
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    USER: "user"
}

export const AvailableUserRoles = Object.values(UserRoleEnums); // Array

export const TaskStatusEnums = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
};

export const TaskStatusOptions = Object.values(TaskStatusEnums);