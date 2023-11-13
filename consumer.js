const amqp = require('amqplib');
const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';

// Kết nối đến RabbitMQ server
async function connect() {
  try {
    const connection = await amqp.connect(amqp_url_cloud);
    const channel = await connection.createChannel();

    // Định nghĩa topic exchange
    const exchange = 'game_results';
    await channel.assertExchange(exchange, 'topic', { durable: false });

    return { connection, channel, exchange };
  } catch (error) {
    throw error;
  }
}

// Hàm lắng nghe kết quả từ RabbitMQ và hiển thị thưởng tương ứng
async function receiveResults() {
    const { connection, channel, exchange } = await connect();
  
    // Định nghĩa queue và binding key
    const queue = 'game_results_queue';
    const bindingKey = 'score.#';
    const assertQueue = await channel.assertQueue(queue);
    await channel.bindQueue(assertQueue.queue, exchange, bindingKey);
  
    // Lắng nghe kết quả từ RabbitMQ
    console.log('Đang lắng nghe kết quả...');
    channel.consume(assertQueue.queue, (msg) => {
      const score = msg.content.toString();
      console.log(`Chúc mừng! Bạn đã nhận được thưởng với điểm số: ${score}`);
    }, { noAck: true });
  }

 (async () => await receiveResults());