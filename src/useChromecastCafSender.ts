import { useEffect, useState } from 'react'
import type { SenderCast } from './sender-capture'
export { SenderCast }

export type Sender = {
	cast: SenderCast
	// @TODO: Add chrome
}

const load = (() => {
	let promise: Promise<Sender> | null = null

	return () => {
		if (promise === null) {
			promise = new Promise((resolve) => {
				const script = document.createElement('script')
				script.src =
					'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
				window.__onGCastApiAvailable = (isAvailable) => {
					if (isAvailable) {
						resolve({
							cast,
						})
					}
				}
				document.body.appendChild(script)
			})
		}
		return promise
	}
})()

export const useChromecastCafSender = () => {
	const [sender, setSender] = useState<
		| Sender
		| {
				cast: null
		  }
	>({
		cast: null,
	})

	useEffect(() => {
		load().then((sender) => {
			setSender(sender)
		})
	}, [])

	return sender
}
