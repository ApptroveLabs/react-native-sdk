declare module 'react-native-trackier' {
    type Environment = 'development' | 'production' | 'testing'

    type AttributionParams = {
        ad?: string;
        partnerId?: string;
        channel?: string;
        adId?: string;
        siteId?: string;
    }

    export class TrackierConfig {
        constructor(appToken: string, environment: Environment)
        setAppSecret: (secretId: string, secretKey: string) => void
        setManualMode: (value: boolean) => void
        disableOrganicTracking: (value: boolean) => void
        setAttributionParams: (params: AttributionParams) => void
        setRegion: (value: string) => void
    }
 
    export class TrackierSDK {
        constructor(trackierEvent:TrackierEvent)
        initialize: (trackierConfig: TrackierConfig) => void
        trackEvent: (trackierEvent: TrackierEvent) => void
        setEnabled: (value:boolean) => void 
        getTrackierId: () => Promise<string> 
        setUserId: (userId: string) => void
        setUserEmail: (userEmail: string) => void
        setUserName: (userName: string) => void
        setUserPhone: (userPhone: string) => void
        trackAsOrganic: (value: boolean) => void
        setLocalRefTrack: (value: boolean, delimeter: string) => void 
        setUserAdditionalDetails: (key: string, value: string) => void
        waitForATTUserAuthorization: (timeoutInterval: int) => void
        updateAppleAdsToken: (value: string) => void
        storeRetargetting: (value: string) => void
        parseDeepLink: (value: string) => void
        setIMEI: (imei1: string, imei2: string) => void
        setMacAddress: (value: string) => void
        fireInstall: () => void 
        createDynamicLink: () => void
        resolveDeeplinkUrl: () => void
    }

    export class TrackierEvent {
        constructor(eventId: string)
        setEventValue: (key: string, value: string) => void
    }
}