import React, {useEffect, useMemo, useState} from 'react';
import {NativeModules, Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const FALLBACK_APPS = [
  {label:'Weather', packageName:'', icon:'☀️'}, {label:'Camera', packageName:'', icon:'📷'},
  {label:'Maps', packageName:'', icon:'🗺️'}, {label:'Music', packageName:'', icon:'🎵'},
  {label:'Messages', packageName:'', icon:'💬'}, {label:'Phone', packageName:'', icon:'📞'},
  {label:'Browser', packageName:'', icon:'🧭'}, {label:'Notes', packageName:'', icon:'📝'},
  {label:'Calendar', packageName:'', icon:'📅'}, {label:'Compass', packageName:'', icon:'🧭'},
  {label:'Store', packageName:'', icon:'🛍️'}, {label:'Settings', packageName:'', icon:'⚙️'},
];

const DOCK = [
  {label:'Phone', icon:'📞'}, {label:'Messages', icon:'💬'},
  {label:'Browser', icon:'🧭'}, {label:'Music', icon:'🎵'},
];

function iconFor(label) {
  const value = label.toLowerCase();
  if (value.includes('camera')) return '📷';
  if (value.includes('map')) return '🗺️';
  if (value.includes('music') || value.includes('spotify')) return '🎵';
  if (value.includes('message') || value.includes('chat')) return '💬';
  if (value.includes('phone') || value.includes('dialer')) return '📞';
  if (value.includes('browser') || value.includes('chrome') || value.includes('firefox')) return '🧭';
  if (value.includes('setting')) return '⚙️';
  if (value.includes('calendar')) return '📅';
  if (value.includes('note')) return '📝';
  if (value.includes('store') || value.includes('play')) return '🛍️';
  return '✨';
}

function Glass({children, style}) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

export default function App() {
  const {width, height} = useWindowDimensions();
  const [now, setNow] = useState(new Date());
  const [focus, setFocus] = useState(false);
  const [toast, setToast] = useState('');
  const [apps, setApps] = useState(FALLBACK_APPS);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadApps = async () => {
      try {
        if (!NativeModules.LauncherModule?.getInstalledApps) return;
        const nativeApps = await NativeModules.LauncherModule.getInstalledApps();
        if (!mounted || !Array.isArray(nativeApps)) return;
        const filtered = nativeApps
          .filter(app => app.packageName !== 'com.beatrice.liquidglasslauncher')
          .slice(0, 16)
          .map(app => ({...app, icon: iconFor(app.label || '')}));
        if (filtered.length) setApps(filtered);
      } catch (_) {}
    };
    loadApps();
    return () => { mounted = false; };
  }, []);

  const time = useMemo(() => now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), [now]);
  const date = useMemo(() => now.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'}), [now]);

  const openApp = async app => {
    if (app.packageName && NativeModules.LauncherModule?.launchApp) {
      try {
        await NativeModules.LauncherModule.launchApp(app.packageName);
        return;
      } catch (_) {}
    }
    setToast(`${app.label} tapped`);
    setTimeout(() => setToast(''), 1400);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.screen, focus && styles.focus]}>
        <View style={[styles.orb, styles.orb1, {left: width*.08, top: height*.16}]} />
        <View style={[styles.orb, styles.orb2, {right: width*.05, top: height*.42}]} />
        <View style={[styles.orb, styles.orb3, {left: width*.28, bottom: height*.08}]} />
        <View style={styles.status}><Text style={styles.statusText}>{time}</Text><Text style={styles.statusText}>▮▮▮  Wi‑Fi  ◉</Text></View>
        <Glass style={styles.hero}>
          <View><Text style={styles.kicker}>{date}</Text><Text style={styles.bigTime}>{time}</Text><Text style={styles.location}>Cupertino  ·  22°  Sunny</Text></View>
          <Pressable onPress={() => setFocus(v => !v)} style={styles.focusButton}><Text style={styles.focusText}>{focus ? 'Focus on' : 'Focus'}</Text></Pressable>
        </Glass>
        <View style={styles.grid}>
          {apps.map(app => (
            <Pressable key={app.packageName || app.label} onPress={() => openApp(app)} style={({pressed}) => [styles.app, pressed && styles.pressed]}>
              <View style={styles.icon}><Text style={styles.emoji}>{app.icon}</Text></View>
              <Text numberOfLines={1} style={styles.appName}>{app.label}</Text>
            </Pressable>
          ))}
        </View>
        <Glass style={styles.dock}>{DOCK.map(app => <Pressable key={app.label} onPress={() => openApp(app)} style={styles.dockIcon}><Text style={styles.emoji}>{app.icon}</Text></Pressable>)}</Glass>
        {!!toast && <Glass style={styles.toast}><Text style={styles.toastText}>{toast}</Text></Glass>}
        <View style={styles.home}><View style={styles.homeBar}/></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({safe:{flex:1,backgroundColor:'#03040a'},screen:{flex:1,overflow:'hidden',backgroundColor:'#070915',paddingHorizontal:18},focus:{backgroundColor:'#020307'},status:{height:34,flexDirection:'row',justifyContent:'space-between',alignItems:'center',zIndex:5},statusText:{color:'#fff',fontWeight:'700',fontSize:12},orb:{position:'absolute',borderRadius:999,opacity:.55},orb1:{width:220,height:220,backgroundColor:'#6b5cff'},orb2:{width:280,height:280,backgroundColor:'#24d9ff'},orb3:{width:240,height:240,backgroundColor:'#ff4fc3'},glass:{overflow:'hidden',borderRadius:28,borderWidth:1,borderColor:'rgba(255,255,255,.24)',backgroundColor:'rgba(255,255,255,.12)',shadowColor:'#000',shadowOpacity:.35,shadowRadius:22,shadowOffset:{width:0,height:12},elevation:10},hero:{minHeight:154,padding:22,marginTop:6,justifyContent:'space-between',flexDirection:'row',alignItems:'flex-end'},kicker:{color:'rgba(255,255,255,.7)',fontSize:14,fontWeight:'600'},bigTime:{color:'#fff',fontSize:46,fontWeight:'300',letterSpacing:-2,marginTop:4},location:{color:'rgba(255,255,255,.8)',fontSize:13},focusButton:{paddingHorizontal:14,paddingVertical:8,borderRadius:18,backgroundColor:'rgba(255,255,255,.16)',borderWidth:1,borderColor:'rgba(255,255,255,.22)'},focusText:{color:'#fff',fontWeight:'700'},grid:{flex:1,flexDirection:'row',flexWrap:'wrap',alignContent:'center',justifyContent:'space-between',paddingVertical:18},app:{width:'23%',alignItems:'center',marginVertical:8},icon:{width:58,height:58,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.16)',borderWidth:1,borderColor:'rgba(255,255,255,.22)',shadowColor:'#000',shadowOpacity:.3,shadowRadius:10,elevation:5},emoji:{fontSize:28},appName:{color:'#fff',fontSize:11,marginTop:6,fontWeight:'600'},pressed:{transform:[{scale:.92}],opacity:.75},dock:{height:76,borderRadius:26,marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},dockIcon:{width:58,height:58,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,.15)'},toast:{position:'absolute',bottom:96,alignSelf:'center',paddingHorizontal:18,paddingVertical:12,borderRadius:18},toastText:{color:'#fff',fontWeight:'700'},home:{height:28,alignItems:'center',justifyContent:'center'},homeBar:{width:110,height:4,borderRadius:4,backgroundColor:'#fff',opacity:.8}}
