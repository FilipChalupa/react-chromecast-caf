// import '@types/chromecast-caf-sender'
/// <reference types="@types/chromecast-caf-sender" />

export type Cast = Window['cast']

type SenderTest = Cast['framework']['CastContext']
// @ts-expect-error Debug shouldn't be defined since it belongs to receiver only.
type ReceiverTest = Cast['debug']
