const TaskModel = require("../model/TaskModel");

exports.addTaskPage = (req, res) => {
    
    res.render("addTask");
};


exports.addTask = async (req, res) => {

    let { title, description } = req.body;

    try {

        const errors = [];

        if (!title || !description) {
            errors.push({
                message: "All fields are required",
            });
        }

        if (errors.length > 0) {
            return res.render("addTask", {
                errors,
                title,
                description,
            });
        }

        const task = new TaskModel({
            title,
            description,
            userId: req.session.user._id,
        });

        await task.save();

        return res.redirect("/home");

    } catch (error) {

        console.error(error);

        return res.render("addTask", {
            errors: [
                {
                    message: "Internal server error",
                },
            ],
            title,
            description,
        });
    }
};

exports.deleteTask = async (req, res) => {

    try {

        await TaskModel.findByIdAndDelete(
            req.params.id
        );

        return res.redirect("/home");

    } catch (error) {

        console.error(error);

        return res.redirect("/home");
    }
};
exports.completeTask = async (req, res) =>{
    try{
        await TaskModel.findByIdAndUpdate(
                req.params.id,{
                   title: req.body.title,
                   description: req.body.description,
                   status: "Completed"
                }
        );
        return res.redirect("/home");
    }catch(error){
        console.error(error);
        return res.redirect("/home");
    }
}
exports.editTaskPage = async (req, res) => {
    try {

        const task = await TaskModel.findById(
            req.params.id
        );

        if (!task) {
            return res.redirect("/home");
        }

        return res.render("editTask", {
            task
        });

    } catch (error) {

        console.error(error);

        return res.redirect("/home");
    }
};
exports.editTask = async (req, res) => {
   let {title, description, status} = req.body;
   try{
        const errors  = [];
        if(!title || !description){
            errors.push({
                message: "All fields are required"
            });
        }
        if(errors.length > 0){
            const task = await TaskModel.findById(req.params.id);
            return res.render("editTask", {
                errors,
                task: {
                    ...task.toObject(),
                    title,
                    description,
                    status
                }
            });
        }
        await TaskModel.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status
            }
        );
        return res.redirect("/home");
   }catch(error){
        console.error(error);
        return res.redirect("/home");
   }
};

