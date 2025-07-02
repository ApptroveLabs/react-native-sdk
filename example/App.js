import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'react-native-trackier';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

export default function App() {
  const [dynamicLinkResult, setDynamicLinkResult] = useState(null);
  const [dynamicLinkError, setDynamicLinkError] = useState(null);
  const [launchUrl, setLaunchUrl] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [deferredDeepLink, setDeferredDeepLink] = useState(null);
  const [resolverResult, setResolverResult] = useState(null);
  const [resolverError, setResolverError] = useState(null);
  const [uninstallTrackingStatus, setUninstallTrackingStatus] = useState(null);

  // Set up Firebase Analytics for uninstall tracking
  const setupUninstallTracking = async () => {
    try {
      const trackierId = await TrackierSDK.getTrackierId();
      await Analytics.setUserProperty('ct_objectId', trackierId);
      setUninstallTrackingStatus('Uninstall tracking set up successfully!');
    } catch (err) {
      setUninstallTrackingStatus('Failed to set up uninstall tracking: ' + (err?.message || err));
    }
  };

  useEffect(() => {
    // For testing, use a hardcoded URL
    const getUrlAsync = async () => {
      const initialUrl = "https://trackier58.u9ilnk.me/d/PGJ2m4NtPd";
      if (initialUrl) {
        // Send this url to Trackier Sdk
        TrackierSDK.parseDeepLink(initialUrl);
        setLaunchUrl(initialUrl);
        setProcessing(false);
      } else {
        setProcessing(false);
      }
    };
    getUrlAsync();

    // Set up deferred deep link callback
    var trackierConfig = new TrackierConfig("67607dc5-8dc2-4bdc-99f1-b577324d97ce", TrackierConfig.EnvironmentDevelopment);
    trackierConfig.setAppSecret("640710587f41ea36ac0cb370","9e043b7e-7f44-403c-ae11-8cf6bfe8daa0");
    trackierConfig.setRegion('IN');
    trackierConfig.setDeferredDeeplinkCallbackListener(function(uri) {
      // Only set deferred deep link if there is no normal launch link
      if (!launchUrl) {
        setDeferredDeepLink(uri);
      }
    });
    TrackierSDK.initialize(trackierConfig);

    // Set up Firebase Analytics uninstall tracking
    setupUninstallTracking();
  }, []);

  function _onPress_trackSimpleEvent() {
    var trackierEvent = new TrackierEvent(TrackierEvent.UPDATE);
    trackierEvent.param1 = "XXXXXX";
    trackierEvent.param2 = "kkkkkkk";
    trackierEvent.couponCode = "testReact";
    trackierEvent.discount = 2.0;
    TrackierSDK.setUserName('abc');
    TrackierSDK.setUserPhone("813434721");
    trackierEvent.setEventValue("param", "8130300721");
    let customData = new Map();
    customData.set("name", "sanu");
    customData.set("phone", "8130300784");
    var jsonData = [
      { "id": 1, "phone": "+91-8130300721" },
      { "id": 2, "name": "Embassies" }
    ];
    trackierEvent.setEventValue("param", jsonData);
    TrackierSDK.trackEvent(trackierEvent);
  }

  function _onPress_trackRevenueEvent() {
    var trackierEvent1 = new TrackierEvent(TrackierEvent.PURCHASE);
    trackierEvent1.param1 = "XXXXXX";
    trackierEvent1.param2 = "kkkkkkk";
    trackierEvent1.couponCode = "testReact";
    trackierEvent1.revenue = 2.5;
    trackierEvent1.currency = "USD";
    TrackierSDK.trackEvent(trackierEvent1);
    TrackierSDK.setEnabled(true);
    TrackierSDK.setUserEmail("anuj@trackier.com");
    TrackierSDK.setUserName("Sanu");
    TrackierSDK.setUserPhone("8130300721");
    TrackierSDK.setUserId("abcd");
    TrackierSDK.trackAsOrganic(false);
    TrackierSDK.setLocalRefTrack(true, "test");
  }

  function _onPress_createDynamicLink() {
    setDynamicLinkResult(null);
    setDynamicLinkError(null);
    const linkConfig = {
      templateId: 'your-template-id',
      link: 'https://yourdomain.com/somepath',
      domainUriPrefix: 'https://yourdomain.page.link',
      deepLinkValue: 'deeplink-value',
      androidParameters: { redirectLink: 'https://yourdomain.com/android' },
      iosParameters: { redirectLink: 'https://yourdomain.com/ios' },
      desktopParameters: { redirectLink: 'https://yourdomain.com/desktop' },
      socialMetaTagParameters: {
        title: 'Trackier Dynamic Link',
        description: 'Test dynamic link from example app',
        imageLink: 'https://yourdomain.com/image.png',
      },
      sdkParameters: { foo: 'bar' },
      attributionParameters: {
        channel: 'test-channel',
        campaign: 'test-campaign',
        mediaSource: 'test-source',
        p1: 'p1',
        p2: 'p2',
        p3: 'p3',
        p4: 'p4',
        p5: 'p5',
      },
    };
    console.log('[Trackier] Creating dynamic link with config:', linkConfig);
    TrackierSDK.createDynamicLink(linkConfig)
      .then((result) => {
        console.log('[Trackier] Dynamic link created:', result);
        setDynamicLinkResult(result);
      })
      .catch((err) => {
        console.error('[Trackier] Error creating dynamic link:', err);
        setDynamicLinkError(err?.message || JSON.stringify(err));
      });
  }

  function _onPress_resolveDeeplink() {
    setResolverResult(null);
    setResolverError(null);
    const url = "https://trackier58.u9ilnk.me/d/PGJ2m4NtPd";
    TrackierSDK.resolveDeeplinkUrl(url)
      .then((result) => {
        setResolverResult(result);
      })
      .catch((err) => {
        setResolverError(err?.message || JSON.stringify(err));
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Trackier React-Native SDK</Text>
        {processing && <Text>Processing...</Text>}
        {launchUrl && (
          <View style={styles.linkBox}>
            <Text style={styles.linkLabel}>Normal Launch Link:</Text>
            <Text style={styles.linkValue}>{launchUrl}</Text>
          </View>
        )}
        {deferredDeepLink && (
          <View style={styles.linkBox}>
            <Text style={styles.linkLabel}>Deferred Deep Link:</Text>
            <Text style={styles.linkValue}>{deferredDeepLink}</Text>
          </View>
        )}
        {!processing && !launchUrl && !deferredDeepLink && (
          <Text>No deep link detected.</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={_onPress_trackSimpleEvent}>
          <Text style={styles.buttonText}>Track Simple Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={_onPress_trackRevenueEvent}>
          <Text style={styles.buttonText}>Track Revenue Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPrimary}
          activeOpacity={0.8}
          onPress={_onPress_createDynamicLink}>
          <Text style={styles.buttonPrimaryText}>Create Dynamic Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPrimary}
          activeOpacity={0.8}
          onPress={_onPress_resolveDeeplink}>
          <Text style={styles.buttonPrimaryText}>Resolve Deep Link (Test)</Text>
        </TouchableOpacity>
        {dynamicLinkResult && (
          <Text style={styles.successText}>Dynamic Link: {dynamicLinkResult}</Text>
        )}
        {dynamicLinkError && (
          <Text style={styles.errorText}>Error: {dynamicLinkError}</Text>
        )}
        {resolverResult && (
          <View style={{marginVertical: 10}}>
            <Text style={styles.successText}>Resolver Success:</Text>
            {resolverResult.url && (
              <Text style={styles.linkValue}>URL: {resolverResult.url}</Text>
            )}
            {resolverResult.sdkParams && Object.keys(resolverResult.sdkParams).length > 0 && (
              <View style={{marginTop: 4}}>
                <Text style={styles.linkLabel}>SDK Params:</Text>
                {Object.entries(resolverResult.sdkParams).map(([key, value]) => (
                  <Text key={key} style={styles.linkValue}>{key}: {value}</Text>
                ))}
              </View>
            )}
          </View>
        )}
        {resolverError && (
          <Text style={styles.errorText}>Resolver Error: {resolverError}</Text>
        )}
        {uninstallTrackingStatus && (
          <Text style={styles.successText}>{uninstallTrackingStatus}</Text>
        )}
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f6f8fa',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#023C69',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#e0e7ef',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    width: 240,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#023C69',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#023C69',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 18,
    width: 240,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successText: {
    color: 'green',
    margin: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    margin: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  linkValue: {
    color: '#333',
  },
});
