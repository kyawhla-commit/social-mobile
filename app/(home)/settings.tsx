import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Linking } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp, queryClient } from "@/components/AppProvider";

type SettingItemProps = {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	rightElement?: React.ReactNode;
};

function SettingItem({ icon, title, subtitle, onPress, rightElement }: SettingItemProps) {
	return (
		<TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
			<View style={styles.settingIcon}>
				<Ionicons name={icon} size={22} color="#007AFF" />
			</View>
			<View style={styles.settingContent}>
				<Text style={styles.settingTitle}>{title}</Text>
				{subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
			</View>
			{rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color="#ccc" />)}
		</TouchableOpacity>
	);
}

export default function Settings() {
	const { user, setUser } = useApp();
	const [notifications, setNotifications] = useState(true);

	const clearCache = async () => {
		Alert.alert(
			"Clear Cache",
			"This will clear all cached data. You may need to reload the app.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear",
					style: "destructive",
					onPress: async () => {
						queryClient.clear();
						Alert.alert("Success", "Cache cleared successfully");
					},
				},
			]
		);
	};

	const logout = async () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					await AsyncStorage.removeItem("token");
					setUser(null);
					queryClient.clear();
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Settings</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Account</Text>
				{user ? (
					<>
						<SettingItem
							icon="person-outline"
							title={user.name}
							subtitle={`@${user.username}`}
						/>
						<SettingItem
							icon="log-out-outline"
							title="Logout"
							onPress={logout}
						/>
					</>
				) : (
					<SettingItem
						icon="log-in-outline"
						title="Login"
						subtitle="Sign in to access all features"
					/>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Preferences</Text>
				<SettingItem
					icon="notifications-outline"
					title="Notifications"
					subtitle="Receive push notifications"
					rightElement={
						<Switch
							value={notifications}
							onValueChange={setNotifications}
							trackColor={{ true: "#007AFF" }}
						/>
					}
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Data</Text>
				<SettingItem
					icon="trash-outline"
					title="Clear Cache"
					subtitle="Free up storage space"
					onPress={clearCache}
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>About</Text>
				<SettingItem
					icon="information-circle-outline"
					title="Version"
					subtitle="1.0.0"
				/>
				<SettingItem
					icon="document-text-outline"
					title="Terms of Service"
					onPress={() => Linking.openURL("https://example.com/terms")}
				/>
				<SettingItem
					icon="shield-outline"
					title="Privacy Policy"
					onPress={() => Linking.openURL("https://example.com/privacy")}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		padding: 20,
		paddingTop: 60,
		backgroundColor: "#fff",
	},
	section: {
		marginTop: 20,
		backgroundColor: "#fff",
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: "#666",
		paddingHorizontal: 16,
		paddingVertical: 8,
		textTransform: "uppercase",
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	settingIcon: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: "#f0f8ff",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	settingContent: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
	},
	settingSubtitle: {
		fontSize: 13,
		color: "#666",
		marginTop: 2,
	},
});
