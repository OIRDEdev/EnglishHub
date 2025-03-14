import Bull from "bull";
import { Queue } from "bullmq";

class Bullqueue{
    private static instance Bullqueue;
    private queue: Queue;

    private constructor(){
        this.queue = new Queue('GetHistories', {
            connection: {
                host: '127.0.0.1',
                port: 6379,
            },
        });
    }

    public static getInstace(): Bullqueue {
        if(!Bullqueue.instance){
            Bullqueue.instance = new Bullqueue();
        }


        return Bullqueue.instance;
    }

    public async addjob(job: {task: string; data: any}){
        await this.queue.add(job.task, job.data);
    }
}


export default Bullqueue.getInstace();