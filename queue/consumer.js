const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';
const amqp_url_docker = 'amqp://localhost:5672';

const receiveQueue = async () => {
    try {
    // 1. create connect 
    const conn = await amqplib.connect(amqp_url_docker);
    // 2. create channel 
    const channel = await conn.createChannel(); 
    // 3. create new queue
    const nameQueue = 'q2';
    // 4. assert queue 
    await channel.assertQueue(nameQueue, {
        durable: true
    })         
    // 5. receive from queue
    await channel.consume(nameQueue, (msg) => {
        console.log(`msg: ${msg.content.toString()}`);
    }, {
        noAck: true 
    });
    
    // 6. close conn & channel 
    } catch (error) {
        console.log(error);
    }
}

receiveQueue();