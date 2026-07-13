const prisma = require("../config/prisma");

exports.createTask = async (req, res) => {
    try {

        const { projectId } = req.params;

        const {
            title,
            description,
            estimatedHours,
            assignedTo
        } = req.body;

        // Check project belongs to logged-in Project Manager
        const project = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                managerId: req.user.id,
                isDeleted: false
            }
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found or access denied."
            });
        }

        // Check Team Member belongs to this project
        const member = await prisma.projectMember.findFirst({
            where: {
                projectId: Number(projectId),
                userId: Number(assignedTo)
            }
        });

        if (!member) {
            return res.status(400).json({
                message: "Selected team member is not assigned to this project."
            });
        }

        // Create task
        const task = await prisma.task.create({
            data: {
                title,
                description,
                estimatedHours,
                projectId: Number(projectId),
                assignedTo: Number(assignedTo)
            }
        });

        // Notification
        await prisma.notification.create({
            data: {
                title: "New Task Assigned",
                message: `You have been assigned the task "${title}" in project "${project.name}".`,
                userId: Number(assignedTo)
            }
        });

        res.status(201).json({
            message: "Task created successfully.",
            task
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getProjectTasks = async (req, res) => {
    try {

        const { projectId } = req.params;
        const { search, status } = req.query;

        // Check project ownership
        const project = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                managerId: req.user.id,
                isDeleted: false
            }
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        let filter = {
            projectId: Number(projectId),
            isDeleted: false
        };

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.title = {
                contains: search,
                mode: "insensitive"
            };
        }

        const tasks = await prisma.task.findMany({

            where: filter,

            include: {

                member: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }

            },

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json({

            total: tasks.length,

            tasks

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }
};

exports.updateTask = async (req, res) => {
    try {

        const { taskId } = req.params;

        const {
            title,
            description,
            estimatedHours,
            assignedTo
        } = req.body;

        // Find task with project
        const task = await prisma.task.findUnique({
            where: {
                id: Number(taskId)
            },
            include: {
                project: true
            }
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        // Check project ownership
        if (task.project.managerId !== req.user.id) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        // Check new member belongs to project
        if (assignedTo) {

            const member = await prisma.projectMember.findFirst({
                where: {
                    projectId: task.projectId,
                    userId: Number(assignedTo)
                }
            });

            if (!member) {
                return res.status(400).json({
                    message: "Selected team member is not assigned to this project."
                });
            }

            // Notify new assignee if changed
            if (task.assignedTo !== Number(assignedTo)) {

                await prisma.notification.create({
                    data: {
                        title: "Task Reassigned",
                        message: `You have been assigned the task "${title || task.title}".`,
                        userId: Number(assignedTo)
                    }
                });

            }
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId)
            },
            data: {
                title,
                description,
                estimatedHours,
                assignedTo: assignedTo ? Number(assignedTo) : task.assignedTo
            }
        });

        res.json({
            message: "Task updated successfully.",
            task: updatedTask
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.deleteTask = async (req, res) => {

    try {

        const { taskId } = req.params;

        const task = await prisma.task.findUnique({

            where: {

                id: Number(taskId)

            },

            include: {

                project: true

            }

        });

        if (!task) {

            return res.status(404).json({

                message: "Task not found."

            });

        }

        if (task.project.managerId !== req.user.id) {

            return res.status(403).json({

                message: "Access denied."

            });

        }

        await prisma.task.update({

            where: {

                id: Number(taskId)

            },

            data: {

                isDeleted: true,

                deletedAt: new Date()

            }

        });

        res.json({

            message: "Task deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};