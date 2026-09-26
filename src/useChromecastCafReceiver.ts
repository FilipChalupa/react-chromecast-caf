import { useEffect, useState } from 'react'
import type { ReceiverCast } from './receiver-capture'

export type Receiver = {
	cast: ReceiverCast
	error: null
	// @TODO: Add framework and debug
}

export type ReceiverUnavailable = {
	cast: null
	/** Set when the SDK script failed to load; `null` while loading. */
	error: Error | null
}

export type ReceiverState = Receiver | ReceiverUnavailable

const receiverScriptUrl =
	'https://www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js'

const pollIntervalMilliseconds = 100

let promise: Promise<Receiver | ReceiverUnavailable> | null = null

const isReceiverReady = () => 'cast' in window && 'framework' in cast

/**
 * Loads the Cast Web Receiver SDK once. Never rejects: resolves with `error`
 * set when the script fails to load.
 */
export const loadChromecastCafReceiver = () => {
	if (promise === null) {
		promise = new Promise((resolve) => {
			let isFailed = false
			const script = document.createElement('script')
			script.src = receiverScriptUrl
			script.onerror = () => {
				isFailed = true
				resolve({
					cast: null,
					error: new Error('Failed to load Chromecast receiver SDK.'),
				})
			}
			document.body.appendChild(script)

			const loop = () => {
				if (isFailed) {
					return
				}
				if (isReceiverReady()) {
					resolve({
						cast: cast as unknown as ReceiverCast,
						error: null,
					})
					return
				}
				setTimeout(loop, pollIntervalMilliseconds)
			}
			loop()
		})
	}
	return promise
}

export const useChromecastCafReceiver = () => {
	const [receiver, setReceiver] = useState<ReceiverState>({
		cast: null,
		error: null,
	})

	useEffect(() => {
		let isMounted = true
		loadChromecastCafReceiver().then((receiver) => {
			if (isMounted) {
				setReceiver(receiver)
			}
		})
		return () => {
			isMounted = false
		}
	}, [])

	return receiver
}
