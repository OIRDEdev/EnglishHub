import { Queue, Worker, Job } from 'bullmq';
import { EmailService } from './emailService';

import dotenv from 'dotenv';  
dotenv.config();



interface emailjob{
    to: string;
    subject:string,
    text?: string,
    html?:string,
    attachments?: Array<{
        filename: string,
        content: string | Buffer;
    }>;
}

export class Emailwoker {
    private static Queue_name = 'email-queue';
    private queue: Queue<emailjob>;
    private worker!: Worker<emailjob>;
    private emailService!: EmailService;

    constructor() {
        this.queue = new Queue(Emailwoker.Queue_name, {
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            },
            defaultJobOptions: {
                attempts: 2,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete:true,
                removeOnFail:false
            }
        });

        this.emailService = new EmailService();

        this.worker = new Worker<emailjob>(
            Emailwoker.Queue_name,
            this.processJob.bind(this),
            {
                connection: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT)
                },
                concurrency: 5,
                limiter: {
                    max:100,
                    duration: 60000
                }
            }
            
        );

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.worker.on('completed', (job: Job<emailjob>) => {
           console.log(`email job ${job.id} is completed`);     
        });

        this.worker.on('failed', (job: Job<emailjob> | undefined) => {
            if (job) {
                console.log(`failed in job ${job.id}`);
            }
        });

        this.worker.on('error', (error: Error) => {
            console.log(`job error code: ${error.message}`);
        });

        this.worker.on('drained', () => {
            console.log(`email queue drained`)
        })
    }

    private async processJob(job: Job<emailjob>): Promise<{success: boolean , messageId?:string}>{
        try{
            const result = await this.emailService.sendEmail({
                to:job.data.to,
                subject: job.data.subject, 
                text: job.data.text,
                html:job.data.html,
                attachments: job.data.attachments
            });

            return { success: true, messageId: result.messageid }
        }catch(error){
            throw error;
        }
    }

    public async queueemail(emailData: emailjob, Options?:{
        priority?:number;
        delay?: number;
        jobId?: string; 
    }): Promise<string | undefined> {
        const job = await this.queue.add('send-email', emailData, {
            priority: Options?.priority,
            delay: Options?.delay,
            jobId: Options?.jobId
        });

        console.log(`Email queued with job: ${job.id}`);


        return job.id;
    }

    public async ScheduleEmail(emailData: emailjob, scheduleTime: Date): Promise<string | undefined> {
        const delay:number = scheduleTime.getTime() - Date.now();

        if(delay <= 0){
            return this.queueemail(emailData);
        }

        return this.queueemail(emailData, { delay });
    }

    public static async getstatics(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    } | undefined> {
        try {
            const queue = new Queue(Emailwoker.Queue_name);
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                queue.getWaitingCount(),
                queue.getActiveCount(),
                queue.getCompletedCount(),
                queue.getFailedCount(),
                queue.getDelayedCount()
            ]);
            
            return { waiting, active, completed, failed, delayed };
        } catch (error) {
            console.error('Error getting queue statistics:', error);
            return undefined;
        }
    }

    public async shutdown(): Promise<void>{
        console.log(`shutdown the worker email`);
        await this.worker.close();
        await this.queue.close();
    }
}
