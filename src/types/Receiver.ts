// import { cast } from '@types/chromecast-caf-receiver'
/// <reference types="@types/chromecast-caf-receiver" />

export type Cast = Window['cast']

// @ts-expect-error CastContext shouldn't be defined since it belongs to sender only.
type SenderTest = Cast['framework']['CastContext']
type ReceiverTest = Cast['debug']
