// This file has been split into separate modules:
// - app.ts: Express app configuration
// - server.ts: Server startup
// - routes/: Route definitions
import app from './app'

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
