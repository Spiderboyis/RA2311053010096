import { Vehicle } from './types';
import { Log } from 'logging_middleware';

// solves the knapsack problem using dynamic programming
// picks best vehicles to maximize impact within available hours
export async function solveKnapsack(capacity: number, vehicles: Vehicle[]) {
    const n = vehicles.length;

    await Log('backend', 'info', 'service', 'Running knapsack for capacity: ' + capacity);

    // create dp table
    // dp[i][w] = best impact using first i vehicles with w hours
    const dp: number[][] = [];
    for (let i = 0; i <= n; i++) {
        dp[i] = [];
        for (let w = 0; w <= capacity; w++) {
            dp[i][w] = 0;
        }
    }

    // fill dp table
    for (let i = 1; i <= n; i++) {
        const vehicle = vehicles[i - 1];
        for (let w = 0; w <= capacity; w++) {
            if (vehicle.Duration <= w) {
                // either skip this vehicle or take it
                const skip = dp[i - 1][w];
                const take = dp[i - 1][w - vehicle.Duration] + vehicle.Impact;
                if (take > skip) {
                    dp[i][w] = take;
                } else {
                    dp[i][w] = skip;
                }
            } else {
                // cant fit this vehicle, skip it
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // find which vehicles were selected by going backwards
    const selected: Vehicle[] = [];
    let totalDuration = 0;
    let w = capacity;

    for (let i = n; i > 0; i--) {
        if (dp[i][w] != dp[i - 1][w]) {
            // this vehicle was picked
            const vehicle = vehicles[i - 1];
            selected.push(vehicle);
            totalDuration = totalDuration + vehicle.Duration;
            w = w - vehicle.Duration;
        }
    }

    const totalImpact = dp[n][capacity];

    await Log('backend', 'info', 'service', 'Knapsack done: picked ' + selected.length + ' vehicles, impact=' + totalImpact);

    return {
        selectedVehicles: selected,
        totalImpact: totalImpact,
        totalDuration: totalDuration
    };
}
