import bodyParser from 'koa-bodyparser'
import Koa        from 'koa'
import cors       from 'kcors';
import logger     from 'koa-logger'
import mongoose   from 'mongoose'

import routing from './routes/'

import { port, connectionString } from './config'

mongoose.connect(connectionString)
mongoose.connection.on('error', console.error)

// create a Koa2 application
const app = new Koa()

app
  .use(logger())
  .use(bodyParser())
  // enable cross-origin resource sharing (very important ;o)
  .use(cors())

routing(app)

// start the application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))

export default app