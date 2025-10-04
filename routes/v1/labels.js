import express from "express";
import labelController from "../../controllers/labelController.js";

const labelRouter = express.Router();

labelRouter.post('/add', labelController.CreateLabelController);
labelRouter.get('/image/:imageName', labelController.GetLabelsByImage);
labelRouter.get('/all', labelController.GetAllLabels);
labelRouter.get('/user/:user_id', labelController.GetLabelsByUser);

export default labelRouter;