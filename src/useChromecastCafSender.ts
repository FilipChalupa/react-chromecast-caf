import { useEffect, useState } from 'react'
import type { Cast, Chrome } from 'cast-sender-module'

type Sender = {
	chrome: Chrome
	cast: Cast
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
							chrome,
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
				chrome: null
				cast: null
		  }
	>({
		chrome: null,
		cast: null,
	})

	useEffect(() => {
		load().then((sender) => {
			setSender(sender)
		})
	}, [])

	return sender
}
