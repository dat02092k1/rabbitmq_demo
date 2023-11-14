const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';

const sendGameResult = async (topic, score) => {
    try {
        console.log(score);
        // 1. create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        // 2. create channel
        const channel = await conn.createChannel();

        // 3. create exchange
        const nameExchange = 'game_results';

        await channel.assertExchange(nameExchange, "topic", {
            durable: false
        })
        
        // 4. publish video 
        await channel.publish(nameExchange, topic, Buffer.from(score.score.toString()));

        console.log(`[x] Sent game result: ${score} for topic: ${topic}`);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000)
    } catch (error) {
        console.log(error);
    }
}

const args = process.argv.slice(2);
const topic = args[0] || 'default_topic';

const score = args[1] || Math.floor(Math.random() * 100) + 1;

const payload = {
    topic: args[0] || 'default_topic',
    score: args[1] || Math.floor(Math.random() * 100) + 1,
  };

sendGameResult(topic, payload);
        