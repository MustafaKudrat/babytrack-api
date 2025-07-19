import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, TextInput, Button, FlatList, View, TouchableOpacity } from 'react-native'
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const API_BASE_URL = Constants.manifest?.extra?.apiUrl || 'http://localhost:8000'

interface SleepLog {
  id: number
  start_time: string
  end_time: string
  notes?: string
}

interface FeedingLog {
  id: number
  start_time: string
  end_time: string
  food_type?: string
  amount?: string
  notes?: string
}

interface DiaperLog {
  id: number
  time: string
  type: string
  notes?: string
}

const LoginScreen = ({ onLogin }: { onLogin: (t: string) => void }) => {
  const [email, setEmail] = useState('mu@gmail.com')
  const [password, setPassword] = useState('Ku')
  const login = async () => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password })
    })
    if (res.ok) {
      const data = await res.json()
      onLogin(data.access_token)
    } else {
      alert('Login failed')
    }
  }
  return (
    <SafeAreaView style={{ padding: 16 }}>
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Login" onPress={login} />
    </SafeAreaView>
  )
}

const SleepScreen = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<SleepLog[]>([])
  useEffect(() => {
    fetch(`${API_BASE_URL}/sleep-logs`, { headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json()).then(setLogs)
  }, [])
  return (
    <FlatList data={logs} keyExtractor={l => l.id.toString()} renderItem={({ item }) => (
      <View style={{ padding: 12, borderBottomWidth: 1 }}>
        <Text>{new Date(item.start_time).toLocaleString()} - {new Date(item.end_time).toLocaleString()}</Text>
      </View>
    )} />
  )
}

const FeedingScreen = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<FeedingLog[]>([])
  useEffect(() => {
    fetch(`${API_BASE_URL}/feeding-logs`, { headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json()).then(setLogs)
  }, [])
  return (
    <FlatList data={logs} keyExtractor={l => l.id.toString()} renderItem={({ item }) => (
      <View style={{ padding: 12, borderBottomWidth: 1 }}>
        <Text>{new Date(item.start_time).toLocaleString()} - {item.food_type}</Text>
      </View>
    )} />
  )
}

const DiaperScreen = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<DiaperLog[]>([])
  useEffect(() => {
    fetch(`${API_BASE_URL}/diaper-logs`, { headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json()).then(setLogs)
  }, [])
  return (
    <FlatList data={logs} keyExtractor={l => l.id.toString()} renderItem={({ item }) => (
      <View style={{ padding: 12, borderBottomWidth: 1 }}>
        <Text>{new Date(item.time).toLocaleString()} - {item.type}</Text>
      </View>
    )} />
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  if (!token) return <LoginScreen onLogin={setToken} />
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Sleep">
          {() => <SleepScreen token={token} />}
        </Tab.Screen>
        <Tab.Screen name="Feeding">
          {() => <FeedingScreen token={token} />}
        </Tab.Screen>
        <Tab.Screen name="Diaper">
          {() => <DiaperScreen token={token} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
