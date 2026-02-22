# Use Chromecast SDK [![npm](https://img.shields.io/npm/v/react-chromecast-caf.svg)](https://www.npmjs.com/package/react-chromecast-caf) ![npm type definitions](https://img.shields.io/npm/types/react-chromecast-caf.svg)

React hook to use the [Chromecast sender SDK](https://developers.google.com/cast/docs/web_sender/integrate) and [Chromecast receiver SDK](https://developers.google.com/cast/docs/web_receiver) in your project.

## Installation

```bash
npm install react-chromecast-caf
```

## How to use

```jsx
import { useChromecastCafSender } from 'react-chromecast-caf'

const Component = () => {
	const { cast } = useChromecastCafSender()

	return <div>{cast === null ? 'Loading' : 'Cast sender sdk is loaded'}</div>
}
```

```jsx
import { useChromecastCafReceiver } from 'react-chromecast-caf'

const Component = () => {
	const { cast } = useChromecastCafReceiver()

	return <div>{cast === null ? 'Loading' : 'Cast receiver sdk is loaded'}</div>
}
```

## Development

- Install dependencies: `npm ci`
- Build the package: `npm run dev`
