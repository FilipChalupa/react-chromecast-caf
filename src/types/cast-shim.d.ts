declare module 'chromecast-caf-receiver-module' {
	import '@types/chromecast-caf-receiver'
	export type Cast = typeof window.cast
}

declare module 'chromecast-caf-sender-module' {
	import '@types/chromecast-caf-sender'
	export type Cast = typeof window.cast
	export type Chrome = typeof window.chrome
}
