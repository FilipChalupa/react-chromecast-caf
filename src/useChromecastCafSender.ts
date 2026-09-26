import { useEffect, useState } from 'react'
import type { SenderCast } from './sender-capture'
import { SenderChrome } from './sender-capture'

export type Sender = {
	cast: SenderCast
	chrome: SenderChrome
	isAvailable: true
	error: null
}

export type SenderUnavailable = {
	cast: null
	chrome: null
	/**
	 * `false` when the browser cannot cast (e.g. Firefox, Safari) or the SDK
	 * script failed to load.
	 */
	isAvailable: false
	/** Set when the SDK script failed to load. */
	error: Error | null
}

export type SenderLoading = {
	cast: null
	chrome: null
	isAvailable: null
	error: null
}

export type SenderState = Sender | SenderUnavailable | SenderLoading

const senderScriptUrl =
	'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'

const unavailable = (error: Error | null): SenderUnavailable => ({
	cast: null,
	chrome: null,
	isAvailable: false,
	error,
})

const ready = (): Sender => ({
	cast,
	chrome,
	isAvailable: true,
	error: null,
})

let promise: Promise<Sender | SenderUnavailable> | null = null

/**
 * Loads the Cast Web Sender SDK once and resolves when it reports whether
 * casting is available. Never rejects.
 */
export const loadChromecastCafSender = () => {
	if (promise === null) {
		promise = new Promise((resolve) => {
			if ('cast' in window && window.cast?.framework) {
				resolve(ready())
				return
			}
			// Keep any callback set by other code on the page.
			const previousCallback = window.__onGCastApiAvailable
			window.__onGCastApiAvailable = (isAvailable, reason) => {
				previousCallback?.(isAvailable, reason)
				resolve(isAvailable ? ready() : unavailable(null))
			}
			const script = document.createElement('script')
			script.src = senderScriptUrl
			script.onerror = () => {
				resolve(unavailable(new Error('Failed to load Chromecast sender SDK.')))
			}
			document.body.appendChild(script)
		})
	}
	return promise
}

export const useChromecastCafSender = () => {
	const [sender, setSender] = useState<SenderState>({
		cast: null,
		chrome: null,
		isAvailable: null,
		error: null,
	})

	useEffect(() => {
		let isMounted = true
		loadChromecastCafSender().then((sender) => {
			if (isMounted) {
				setSender(sender)
			}
		})
		return () => {
			isMounted = false
		}
	}, [])

	return sender
}
