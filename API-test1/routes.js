import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {
    res.status(200).send('');
});

router.get("/healthz", (req, res) => {
    res.status(200).send('');
});

export default router;