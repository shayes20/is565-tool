import schedule from 'node-schedule';
import catchAsyncJobs from '../utils/catch-async-jobs.js';

const sampleJob = schedule.scheduleJob(
    '00 01 * * *',
    catchAsyncJobs(async () => {
        // Do something
    })
);

export default sampleJob;
