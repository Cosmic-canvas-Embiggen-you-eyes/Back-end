import express from 'express';
const guestRouter = express.Router();

guestRouter.post('/register', (req, res) => {
    console.log("Guest registration endpoint hit");
    const guestId = "guest_" + Math.random().toString(36).substring(2, 15);
    const exp = req.body.experience || 'beginner';
    console.log("Generated guest ID:", guestId);
    res.status(200).json({ guestId, experience: exp });
});

export default guestRouter;