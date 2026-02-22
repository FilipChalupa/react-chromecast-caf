import { ReceiverCast as CastReceiver } from './receiver-capture'
import { SenderCast as CastSender } from './sender-capture'

// This function will only compile if the types are DIFFERENT.
// If they merged into one global type, this test would pass silently (which is bad).
function assertIsolated() {
	const receiver = {} as CastReceiver
	const sender = {} as CastSender

	// @ts-expect-error - This SHOULD fail if isolation worked.
	// If this line does NOT throw a TS error, the types have merged.
	const collisionCheck: CastSender = receiver

	// Check for specific unique properties
	// Receiver (CAF) usually has 'framework' while Sender has different structures
	console.log(receiver)
	console.log(sender)
}
