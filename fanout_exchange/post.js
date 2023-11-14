const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';
const amqp_url_docker = 'amqp://localhost:5672';

const postVid = async ({ msg }) => {
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

        // 4. publish video 
        await channel.publish(nameExchange, '', Buffer.from(msg));

        console.log(`[x] Sent ${msg}`);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000)
    } catch (error) {
        console.log(error);
    }
}

const msg = process.argv.slice(2).join(' ') || 'nedo'; 
postVid({ msg});