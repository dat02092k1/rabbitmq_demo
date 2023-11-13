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

// Hàm gửi điểm số qua RabbitMQ
async function sendScore(score) {
  const { connection, channel, exchange } = await connect();

  // Người chơi nhập điểm số từ console
  const playerName = 'Player'; // Bạn có thể thay đổi tên người chơi
  console.log(`Chào mừng ${playerName}! Nhập điểm số:`);
  const scoreInput = Number.parseInt(await getUserInput(), 10);

  // Gửi điểm số đến RabbitMQ
  channel.publish(exchange, `score.${playerName}`, Buffer.from(scoreInput.toString()));
  console.log(`Đã gửi điểm số ${scoreInput} đến RabbitMQ`);

  // Đóng kết nối sau khi gửi điểm số
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}


// Hàm để nhập dữ liệu từ console
function getUserInput() {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', (key) => {
      if (key === '\u0003') {
        process.exit(); // Nếu nhấn Ctrl+C, thoát ứng dụng
      } else if (key === '\r') {
        stdin.pause(); // Nếu nhấn Enter, dừng đọc input 
        resolve(buffer);
      } else {
        process.stdout.write(key); // Hiển thị input lên console
        buffer += key;
      }
    });

    let buffer = '';
  });
}

// Chạy chương trình
(async () => {
  // Chạy sendScore để người chơi nhập điểm số
  await sendScore();

  // Sau đó, chạy receiveResults để lắng nghe kết quả từ RabbitMQ
})();
