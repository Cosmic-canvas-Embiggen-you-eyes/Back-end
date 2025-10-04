import labelQueries from "../models/labelQueries.js";

export const CreateLabelController = async (req, res) => {
  try {
    console.log("CreateLabelController called with body:", req.body);
    const { name, x_axis, y_axis, imageName, user_id, visibility } = req.body;
    if (!name || !x_axis || !y_axis || !imageName || !user_id || !visibility) {
      return res.status(400).json({ message: "Name, x_axis, y_axis, imageName, user_id, and visibility are required" });
    }
    const newLabel = await labelQueries.AddLabel(name, x_axis, y_axis, user_id, imageName, visibility);
    return res.status(201).json(newLabel);
  }
  catch (err) {
    console.error("Error creating label:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetLabelsByImage= async(req, res) =>
    {
    try {
        const { imageName } = req.params;
        if (!imageName) {
            return res.status(400).json({ message: "Image name is required" });
        }
        const labels = await labelQueries.GetLabelsByImageName(imageName);
        return res.status(200).json(labels);
    }
    catch (err) {
        console.error("Error getting labels by image:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const GetAllLabels= async(req, res) =>{
    try{
        const labels = await labelQueries.GetAllLabels();
        return res.status(200).json(labels);
    }
    catch(err){
    console.error("Error getting labels:", err.message);
    return res.status(500).json({ message: "Internal server error" });
    }
}

export const GetLabelsByUser= async(req, res) =>{
    try{
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const labels = await labelQueries.GetLabelsByUserId(user_id);
        return res.status(200).json(labels);
    }
    catch(err){
        console.error("Error getting labels by user:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default { CreateLabelController, GetLabelsByImage, GetAllLabels, GetLabelsByUser };