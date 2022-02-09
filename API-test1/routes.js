import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {
    res.sendStatus(200);
});

router.get("/healthz", (req, res) => {
    res.sendStatus(200);
});

export default router;