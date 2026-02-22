declare module 'cast-receiver-module' {
	import '@types/chromecast-caf-receiver'
	export const cast: typeof window.cast
}

declare module 'cast-sender-module' {
	import '@types/chromecast-caf-sender'
	export const cast: typeof window.cast
	export const chrome: typeof window.chrome
}
