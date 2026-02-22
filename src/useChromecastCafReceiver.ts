import { type Cast } from 'cast-receiver-module'
import { useEffect, useState } from 'react'

type Receiver = {
	cast: Cast
}

const load = (() => {
	let promise: Promise<Receiver> | null = null

	return () => {
		if (promise === null) {
			promise = new Promise((resolve) => {
				const script = document.createElement('script')
				script.src =
					'https://www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js'
				document.body.appendChild(script)

				const loop = () => {
					if ('cast' in window && 'framework' in cast) {
						resolve({
							cast,
						})
						return
					}
					setTimeout(() => {
						loop()
					}, 100)
				}
				loop()
			})
		}
		return promise
	}
})()

export const useChromecastCafReceiver = () => {
	const [receiver, setReceiver] = useState<Receiver | null>(null)

	useEffect(() => {
		load().then((sender) => {
			setReceiver(sender)
		})
	}, [])

	return receiver
}
