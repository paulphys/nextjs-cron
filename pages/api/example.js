export default function handler(req, res) {

  const { APP_KEY } = process.env;
  const { ACTION_KEY } = req.headers.authorization.split(" ")[1];
  
  if (ACTION_KEY === APP_KEY) {
    // Process the POST request
    res.status(200).json({ success: 'true' })
  }
}
