import express, { Request, Response } from 'express';
import { fetchNotifications } from './api';
import { getTopPriorityNotifications } from './priorityInbox';
import { Log } from 'logging_middleware';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/priority-inbox', async (req: Request, res: Response) => {
    try {
        await Log('backend', 'info', 'route', 'Request');
        
        let n = 10;
        if (req.query.n) {
            n = parseInt(req.query.n as string);
        }
        
        const raw = await fetchNotifications();


        const topN = await getTopPriorityNotifications(raw, n);

        await Log('backend', 'info', 'route', 'Done');

        res.status(200).json({
            message: "Done",
            priorityInbox: topN
        });

    } catch (error: any) {
        await Log('backend', 'error', 'route', 'Error');
        res.status(500).json({
            error: "Error"
        });
    }
});

app.listen(PORT, async () => {
    await Log('backend', 'info', 'service', 'Start');
    console.log("Server run");
});
