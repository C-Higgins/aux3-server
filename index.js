const admin = require('firebase-admin')
const serviceAccount = require('./service-account-key.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://aux-radio.firebaseio.com',
})
const settings = {timestampsInSnapshots: true}

const db = admin.firestore()
db.settings(settings)


// New ones only
const roomDataRef = db.collection('room_data').where('createdAt', '>', new Date())
const roomsRef = db.collection('rooms')

roomDataRef.onSnapshot(ss => {
	ss.forEach(entry => {
		const newRoomData = entry.data()
		roomsRef.doc(newRoomData.id).set({
			id: newRoomData.id,
			name: newRoomData.name,
			createdAt: newRoomData.createdAt,
		})
	})
})