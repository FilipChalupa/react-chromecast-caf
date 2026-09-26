// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The Cast SDK globals are typed on `Window`; tests need to set and remove fakes.
const testWindow = window as unknown as {
	cast?: unknown
	chrome?: unknown
	__onGCastApiAvailable?: (isAvailable: boolean, reason?: string) => void
}

const lastScript = () => {
	const scripts = document.body.querySelectorAll('script')
	return scripts[scripts.length - 1] as HTMLScriptElement
}

beforeEach(() => {
	vi.resetModules()
})

afterEach(() => {
	vi.useRealTimers()
	delete testWindow.cast
	delete testWindow.chrome
	delete testWindow.__onGCastApiAvailable
	document.body.innerHTML = ''
})

describe('loadChromecastCafSender', () => {
	it('resolves as available when the SDK reports it', async () => {
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		const loading = loadChromecastCafSender()
		testWindow.cast = { framework: {} }
		testWindow.chrome = { cast: {} }
		testWindow.__onGCastApiAvailable?.(true)
		const sender = await loading
		expect(sender.isAvailable).toBe(true)
		expect(sender.cast).toBe(testWindow.cast)
		expect(sender.chrome).toBe(testWindow.chrome)
	})

	it('resolves as unavailable when the browser cannot cast', async () => {
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		const loading = loadChromecastCafSender()
		testWindow.__onGCastApiAvailable?.(false, 'NO_BROWSER_SUPPORT')
		expect(await loading).toEqual({
			cast: null,
			chrome: null,
			isAvailable: false,
			error: null,
		})
	})

	it('resolves with an error when the script fails to load', async () => {
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		const loading = loadChromecastCafSender()
		lastScript().dispatchEvent(new Event('error'))
		const sender = await loading
		expect(sender.isAvailable).toBe(false)
		expect(sender.error).toBeInstanceOf(Error)
	})

	it('keeps a callback set by other code on the page', async () => {
		const previous = vi.fn()
		testWindow.__onGCastApiAvailable = previous
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		const loading = loadChromecastCafSender()
		testWindow.__onGCastApiAvailable?.(false, 'NO_BROWSER_SUPPORT')
		await loading
		expect(previous).toHaveBeenCalledWith(false, 'NO_BROWSER_SUPPORT')
	})

	it('does not inject the script again when the SDK is already loaded', async () => {
		testWindow.cast = { framework: {} }
		testWindow.chrome = { cast: {} }
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		expect((await loadChromecastCafSender()).isAvailable).toBe(true)
		expect(document.body.querySelectorAll('script')).toHaveLength(0)
	})

	it('loads the SDK only once', async () => {
		const { loadChromecastCafSender } = await import('./useChromecastCafSender')
		expect(loadChromecastCafSender()).toBe(loadChromecastCafSender())
		expect(document.body.querySelectorAll('script')).toHaveLength(1)
	})
})

describe('loadChromecastCafReceiver', () => {
	it('resolves once the framework appears', async () => {
		vi.useFakeTimers()
		const { loadChromecastCafReceiver } =
			await import('./useChromecastCafReceiver')
		const loading = loadChromecastCafReceiver()
		testWindow.cast = { framework: {} }
		await vi.advanceTimersByTimeAsync(100)
		const receiver = await loading
		expect(receiver.cast).toBe(testWindow.cast)
		expect(receiver.error).toBeNull()
	})

	it('resolves with an error and stops polling when the script fails to load', async () => {
		vi.useFakeTimers()
		const { loadChromecastCafReceiver } =
			await import('./useChromecastCafReceiver')
		const loading = loadChromecastCafReceiver()
		lastScript().dispatchEvent(new Event('error'))
		const receiver = await loading
		expect(receiver.cast).toBeNull()
		expect(receiver.error).toBeInstanceOf(Error)
		await vi.advanceTimersByTimeAsync(100)
		expect(vi.getTimerCount()).toBe(0)
	})
})
