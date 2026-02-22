# react-chromecast-caf ⚛️📺

[![npm](https://img.shields.io/npm/v/react-chromecast-caf.svg)](https://www.npmjs.com/package/react-chromecast-caf)
![npm type definitions](https://img.shields.io/npm/types/react-chromecast-caf.svg)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A collection of React hooks designed to simplify integration with the Google Chromecast CAF (Cast Application Framework) Sender and Receiver SDKs. Build Chromecast-enabled web applications with ease, leveraging React's declarative power.

## ✨ Features

- **`useChromecastCafSender`**: Seamlessly integrate the Chromecast Web Sender SDK into your React components.
- **`useChromecastCafReceiver`**: Easily develop custom Chromecast Receiver applications using the Web Receiver SDK.
- **TypeScript Support**: Fully typed for a robust development experience.

## 🚀 Installation

Install the package using npm:

```bash
npm install react-chromecast-caf
```

## 📖 How to Use

### Chromecast Sender

The `useChromecastCafSender` hook loads the Chromecast Web Sender SDK and provides access to the `cast` object once it's ready.

```jsx
import React from 'react'
import { useChromecastCafSender } from 'react-chromecast-caf'

const SenderComponent = () => {
	const { cast, chrome } = useChromecastCafSender()

	if (!cast) {
		return <div>Loading Chromecast Sender SDK…</div>
	}

	return (
		<div>
			<h1>Chromecast Sender Example</h1>
			<p>Chromecast Sender SDK is loaded.</p>
			{/* You can now use the 'cast' object */}
		</div>
	)
}
```

### Chromecast Receiver

The `useChromecastCafReceiver` hook initializes the Chromecast Web Receiver SDK.

```jsx
import React from 'react'
import { useChromecastCafReceiver } from 'react-chromecast-caf'

const ReceiverComponent = () => {
	const { cast } = useChromecastCafReceiver()

	if (!cast) {
		return <div>Loading Chromecast Receiver SDK…</div>
	}

	return (
		<div>
			<h1>Chromecast Receiver Example</h1>
			<p>Chromecast Receiver SDK is loaded.</p>
			{/* You can now use the 'cast' object to handle receiver events */}
		</div>
	)
}
```

## ⚙️ API

### `useChromecastCafSender(): { chrome: Chrome | null, cast: Cast | null }`

A React hook that loads the Chromecast Web Sender SDK.

- **`chrome`**: The `chrome` object from the SDK, or `null` otherwise.
- **`cast`**: The `cast` object from the SDK, or `null` otherwise.

### `useChromecastCafReceiver(): { cast: Cast | null }`

A React hook that initializes the Chromecast Web Receiver SDK.

- **`cast`**: The `cast` object from the SDK, or `null` otherwise.
