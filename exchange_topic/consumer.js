const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';

const receiveGameResult = async (topics) => {
    try {
        // 1. create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        // 2. create channel
        const channel = await conn.createChannel();

        // 3. create exchange
        const nameExchange = 'game_results';

        await channel.assertExchange(nameExchange, "topic", {
            durable: false
        })

        // 4. create queue
        const {queue} = await channel.assertQueue('', {
            exclusive: true
        })

        // 5. bind queue
        console.log(`Waiting for game results in queue ${queue} for topics: ${topics}`);

        /**
         * meaning: phù hợp với bất kỳ từ nào
         # meaning: phù hợp với 1 or nhiều từ bất kỳ
         */
        console.log(`waiting queue ${queue} for topic ${topics}`);

        topics.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key);
        })

        // 4. publish  
        await channel.consume(queue, (msg) => {
            console.log(`User received a reward with a score: ${msg.content.toString()} for topic: ${msg.fields.routingKey}`);
        });
    } catch (error) {
        console.error(error);
    }
}

const args = process.argv.slice(2);
const topics = args.length ? args : ['default_topic'];
const text = {
    item_id: "macbook",
    text: "This is a sample message to send receiver to check the ordered Item Availablility",
  };
receiveGameResult(topics);
