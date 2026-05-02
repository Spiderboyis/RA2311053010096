import express from 'express';
import { fetchDepots, fetchVehicles } from './api';
import { solveKnapsack } from './knapsack';
import { Log } from 'logging_middleware';
import { ScheduleResult } from './types';

const app = express();
const PORT = 3000;

app.use(express.json());

// main route - get the schedule
app.get('/schedule', async function (req, res) {
    try {
        await Log('backend', 'info', 'route', 'GET /schedule called');
        
        // get data from test server
        const depots = await fetchDepots();
        const vehicles = await fetchVehicles();

        await Log('backend', 'info', 'handler', 'Got ' + depots.length + ' depots and ' + vehicles.length + ' vehicles');

        const results: ScheduleResult[] = [];

        // run knapsack for each depot
        for (let i = 0; i < depots.length; i++) {
            const depot = depots[i];
            await Log('backend', 'info', 'service', 'Processing depot ' + depot.ID);
            
            const solution = await solveKnapsack(depot.MechanicHours, vehicles);

            results.push({
                depotID: depot.ID,
                mechanicHoursAvailable: depot.MechanicHours,
                mechanicHoursUsed: solution.totalDuration,
                totalImpactScore: solution.totalImpact,
                selectedVehicles: solution.selectedVehicles
            });
        }

        await Log('backend', 'info', 'route', 'Schedule done for ' + depots.length + ' depots');

        res.status(200).json({
            message: "Schedule computed",
            depotsProcessed: depots.length,
            totalVehiclesAvailable: vehicles.length,
            schedules: results
        });

    } catch (error: any) {
        await Log('backend', 'error', 'route', 'Schedule failed: ' + error.message);
        res.status(500).json({
            error: "Failed to compute schedule",
            details: error.message
        });
    }
});

app.listen(PORT, async function () {
    await Log('backend', 'info', 'config', 'Server started on port ' + PORT);
    console.log("Server running on http://localhost:" + PORT);
});
