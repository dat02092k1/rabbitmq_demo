const amqplib = require('amqplib');
const amqp_url_cloud = 'amqps://bwmvojah:MTVr-RxMmrPWcv02TIbUaF3Z0X8uVVNA@octopus.rmq3.cloudamqp.com/bwmvojah';
const amqp_url_docker = 'amqp://localhost:5672';
var amqp = require('amqplib/callback_api');

const sendQueue = async ({ msg }) => {
    try {
        amqp.connect(amqp_url_cloud, function(error0, connection) {
            if (error0) {
              throw error0;
            }
            connection.createChannel(function(error1, channel) {
              if (error1) {
                throw error1;
              }
              var exchange = 'direct_logs';
              var args = process.argv.slice(2);
              var msg = args.slice(1).join(' ') || 'Hello World!';
              var severity = (args.length > 0) ? args[0] : 'info';
          
              channel.assertExchange(exchange, 'direct', {
                durable: false
              });
              channel.publish(exchange, severity, Buffer.from(msg));
              console.log(" [x] Sent %s: '%s'", severity, msg);
            });
          
            setTimeout(function() {
              connection.close();
              process.exit(0)
            }, 500);
          });
    } catch (error) {
        console.log(error);
    }
}

const msg = process.argv.slice(2).join(' ') || 'heh';

sendQueue(msg); 
 
