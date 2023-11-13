const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';
const amqp_url_docker = 'amqp://localhost:5672';

const sendQueue = async ({ msg }) => {
    try {
    // 1. create connect 
    const conn = await amqplib.connect(amqp_url_docker);
    // 2. create channel 
    const channel = await conn.createChannel(); 
    // 3. create new queue
    const nameQueue = 'q2';
    // 4. assert queue 
    await channel.assertQueue(nameQueue, {
        durable: true // khi restart lai thi queue ko mat data 
    })         
    // 5. send message to queue
    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
        persistent: true  
    })
    
    // why buffer
    /**
     * 1. transfer super fast
     * 2. encrypt msg to byte through Buffer 
     */
    // 6. close conn & channel 
    } catch (error) {
        console.log(error);
    }
}

const msg = process.argv.slice(2).join(' ') || 'heh';

sendQueue({ msg });