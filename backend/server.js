const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const authenticate = require("./middleware/auth.middleware");
const adminRoutes = require("./routes/admin.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const teamRoutes = require("./routes/team.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminProjectRoutes = require("./routes/admin.project.routes");
const adminTaskRoutes = require("./routes/admin.task.routes");
const adminDashboardRoutes = require("./routes/admin.dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/admin/tasks", adminTaskRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.get(
    "/api/profile",
    authenticate,
    (req,res)=>{

        res.json({
            message:"Protected route",
            user:req.user
        });

    }
);

app.get("/", (req, res) => {
  res.json({
    message: "Project & Team Task Management API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});