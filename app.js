require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const setupTenantRoutes = require('./routes/tenant-routes')

const app = express()
const httpServer = http.createServer(app)

// Socket.IO sozlamalari
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

// CORS sozlamalari
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type'],
	})
)

app.use(express.json())
app.use('/api', setupTenantRoutes(io))

// WebSocket for notifications
io.on('connection', socket => {
	console.log('Client connected')
	socket.on('disconnect', () => console.log('Client disconnected'))
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
