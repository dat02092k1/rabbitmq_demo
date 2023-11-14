const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';
const amqp_url_docker = 'amqp://localhost:5672';

const receiveNoti = async () => {
    try {
        // 1. create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        // 2. create channel
        const channel = await conn.createChannel();

        // 3. create exchange
        const nameExchange = 'video';

        await channel.assertExchange(nameExchange, "fanout", {
            durable: false
        })

        // 4. create queue 
        const {
            queue // name queue
        } = await channel.assertQueue('', {
            exclusive: true // only one consumer 
        })

        console.log(queue);

        // 5. bind queue to exchange 
        await channel.bindQueue(queue, nameExchange, '');

        await channel.consume(queue, (msg) => {
            console.log(`msg: ${msg.content.toString()}`);
        }, {
            noAck: true 
        }); 

    } catch (error) {
        console.log(error);
    }
}

receiveNoti(); 