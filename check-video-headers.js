import http from 'http';

const files = ['/simulation video.mov', '/final video.mp4'];
const port = 5173;

files.forEach(file => {
  const options = {
    hostname: 'localhost',
    port: port,
    path: file,
    method: 'HEAD'
  };

  const req = http.request(options, (res) => {
    console.log(`\nFile: ${file}`);
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
  });

  req.on('error', (e) => {
    console.error(`Problem with request for ${file}: ${e.message}`);
  });

  req.end();
});
