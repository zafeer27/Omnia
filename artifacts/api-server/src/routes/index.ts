import { Router, type IRouter } from "express";
import healthRouter from "./health";
import anthropicRouter from "./anthropic";
import { requireAuth } from "../middlewares/auth.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/anthropic", requireAuth, anthropicRouter);

export default router;
