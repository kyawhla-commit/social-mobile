import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useApp, queryClient } from "@/components/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config";
import Card from "@/components/card";
import { PostType } from "@/types/global";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Profile() {
	const { user, setUser } = useApp();
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { data: posts } = useQuery({
		queryKey: ["userPosts", user?.id],
		queryFn: async () => {
			const res = await fetch(`${API_BASE_URL}/posts`);
			const allPosts = await res.json();
			return allPosts.filter((post: PostType) => post.user.id === user?.id);
		},
		enabled: !!user,
	});

	const login = async () => {
		if (!username || !password) {
			setError("Please fill in all fields");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			const res = await fetch(`${API_BASE_URL}/users/login`, {
				method: "POST",
				body: JSON.stringify({ username, password }),
				headers: { "Content-Type": "application/json" },
			});
			if (res.ok) {
				const { user, token } = await res.json();
				await AsyncStorage.setItem("token", token);
				setUser(user);
				setUsername("");
				setPassword("");
			} else {
				setError("Incorrect username or password");
			}
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const register = async () => {
		if (!name || !username || !password) {
			setError("Please fill in all required fields");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			const res = await fetch(`${API_BASE_URL}/users`, {
				method: "POST",
				body: JSON.stringify({ name, username, password, bio }),
				headers: { "Content-Type": "application/json" },
			});
			if (res.ok) {
				Alert.alert("Success", "Account created! Please login.", [
					{ text: "OK", onPress: () => setIsLogin(true) },
				]);
				setName("");
				setUsername("");
				setPassword("");
				setBio("");
			} else {
				const data = await res.json();
				setError(data.msg || "Registration failed");
			}
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem("token");
		setUser(null);
		queryClient.clear();
	};

	// Logged in profile view
	if (user) {
		return (
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Header with gradient */}
				<View style={styles.headerGradient}>
					<View style={styles.coverPhoto} />
					<View style={styles.avatarContainer}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
						</View>
					</View>
				</View>

				{/* Profile Info */}
				<View style={styles.profileInfo}>
					<Text style={styles.userName}>{user.name}</Text>
					<Text style={styles.userHandle}>@{user.username}</Text>
					{user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

					{/* Stats */}
					<View style={styles.statsContainer}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>{posts?.length || 0}</Text>
							<Text style={styles.statLabel}>Posts</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>
								{posts?.reduce((acc: number, p: PostType) => acc + p.likes.length, 0) || 0}
							</Text>
							<Text style={styles.statLabel}>Likes</Text>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>
								{posts?.reduce((acc: number, p: PostType) => acc + p.comments.length, 0) || 0}
							</Text>
							<Text style={styles.statLabel}>Comments</Text>
						</View>
					</View>

					{/* Action Buttons */}
					<View style={styles.actionButtons}>
						<TouchableOpacity style={styles.editButton}>
							<Ionicons name="create-outline" size={18} color="#007AFF" />
							<Text style={styles.editButtonText}>Edit Profile</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.logoutButton} onPress={logout}>
							<Ionicons name="log-out-outline" size={18} color="#fff" />
							<Text style={styles.logoutButtonText}>Logout</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Posts Section */}
				<View style={styles.postsSection}>
					<View style={styles.postsSectionHeader}>
						<Ionicons name="grid-outline" size={20} color="#333" />
						<Text style={styles.postsSectionTitle}>My Posts</Text>
					</View>
					{posts?.length === 0 ? (
						<View style={styles.emptyPosts}>
							<Ionicons name="document-text-outline" size={48} color="#ccc" />
							<Text style={styles.emptyText}>No posts yet</Text>
							<Text style={styles.emptySubtext}>Share your first thought!</Text>
						</View>
					) : (
						posts?.map((post: PostType) => <Card key={post.id} post={post} />)
					)}
				</View>
			</ScrollView>
		);
	}

	// Auth form (login/register)
	return (
		<KeyboardAvoidingView
			style={styles.authContainer}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={styles.authScroll}
				showsVerticalScrollIndicator={false}
			>
				{/* Logo/Brand */}
				<View style={styles.brandContainer}>
					<View style={styles.logoCircle}>
						<Ionicons name="chatbubbles" size={40} color="#fff" />
					</View>
					<Text style={styles.brandName}>Social</Text>
					<Text style={styles.brandTagline}>Connect with friends</Text>
				</View>

				{/* Form Card */}
				<View style={styles.formCard}>
					<Text style={styles.formTitle}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
					<Text style={styles.formSubtitle}>
						{isLogin ? "Sign in to continue" : "Join our community"}
					</Text>

					{error && (
						<View style={styles.errorBox}>
							<Ionicons name="alert-circle" size={18} color="#ff3b30" />
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					{!isLogin && (
						<>
							<View style={styles.inputContainer}>
								<Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
								<TextInput
									style={styles.input}
									value={name}
									onChangeText={setName}
									placeholder="Full Name"
									placeholderTextColor="#999"
									autoCapitalize="words"
								/>
							</View>
							<View style={styles.inputContainer}>
								<Ionicons name="document-text" size={20} color="#999" style={styles.inputIcon} />
								<TextInput
									style={[styles.input, styles.bioInput]}
									value={bio}
									onChangeText={setBio}
									placeholder="Bio (optional)"
									placeholderTextColor="#999"
									multiline
								/>
							</View>
						</>
					)}

					<View style={styles.inputContainer}>
						<Ionicons name="at" size={20} color="#999" style={styles.inputIcon} />
						<TextInput
							autoCapitalize="none"
							style={styles.input}
							value={username}
							onChangeText={setUsername}
							placeholder="Username"
							placeholderTextColor="#999"
						/>
					</View>

					<View style={styles.inputContainer}>
						<Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
						<TextInput
							secureTextEntry
							style={styles.input}
							value={password}
							onChangeText={setPassword}
							placeholder="Password"
							placeholderTextColor="#999"
						/>
					</View>

					<TouchableOpacity
						style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
						onPress={isLogin ? login : register}
						disabled={isLoading}
					>
						<Text style={styles.submitButtonText}>
							{isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
						</Text>
						{!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
					</TouchableOpacity>
				</View>

				{/* Switch Auth Mode */}
				<TouchableOpacity
					style={styles.switchButton}
					onPress={() => {
						setIsLogin(!isLogin);
						setError("");
					}}
				>
					<Text style={styles.switchText}>
						{isLogin ? "Don't have an account? " : "Already have an account? "}
						<Text style={styles.switchTextBold}>{isLogin ? "Sign Up" : "Sign In"}</Text>
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f8f9fa" },
	headerGradient: { position: "relative" },
	coverPhoto: {
		height: 140,
		backgroundColor: "#667eea",
		backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	},
	avatarContainer: {
		position: "absolute",
		bottom: -50,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#ff6b6b",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 4,
		borderColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	avatarText: { color: "#fff", fontSize: 42, fontWeight: "bold" },
	profileInfo: {
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: 20,
		paddingBottom: 20,
		backgroundColor: "#fff",
	},
	userName: { fontSize: 26, fontWeight: "bold", color: "#1a1a2e" },
	userHandle: { fontSize: 16, color: "#666", marginTop: 4 },
	userBio: {
		fontSize: 15,
		color: "#444",
		marginTop: 12,
		textAlign: "center",
		lineHeight: 22,
		paddingHorizontal: 20,
	},
	statsContainer: {
		flexDirection: "row",
		marginTop: 24,
		paddingVertical: 16,
		paddingHorizontal: 30,
		backgroundColor: "#f8f9fa",
		borderRadius: 16,
	},
	statItem: { alignItems: "center", flex: 1 },
	statNumber: { fontSize: 22, fontWeight: "bold", color: "#1a1a2e" },
	statLabel: { fontSize: 13, color: "#666", marginTop: 4 },
	statDivider: { width: 1, backgroundColor: "#ddd", marginHorizontal: 15 },
	actionButtons: {
		flexDirection: "row",
		marginTop: 20,
		gap: 12,
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 25,
		borderWidth: 2,
		borderColor: "#007AFF",
	},
	editButtonText: { color: "#007AFF", fontWeight: "600", fontSize: 15 },
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 25,
		backgroundColor: "#ff3b30",
	},
	logoutButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
	postsSection: { marginTop: 8 },
	postsSectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		padding: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	postsSectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
	emptyPosts: {
		alignItems: "center",
		padding: 40,
		backgroundColor: "#fff",
	},
	emptyText: { fontSize: 18, fontWeight: "600", color: "#666", marginTop: 16 },
	emptySubtext: { fontSize: 14, color: "#999", marginTop: 4 },

	// Auth styles
	authContainer: { flex: 1, backgroundColor: "#f0f4ff" },
	authScroll: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 24,
	},
	brandContainer: { alignItems: "center", marginBottom: 32 },
	logoCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#667eea",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
		shadowColor: "#667eea",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.4,
		shadowRadius: 16,
		elevation: 12,
	},
	brandName: { fontSize: 32, fontWeight: "bold", color: "#1a1a2e" },
	brandTagline: { fontSize: 16, color: "#666", marginTop: 4 },
	formCard: {
		backgroundColor: "#fff",
		borderRadius: 24,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 8,
	},
	formTitle: { fontSize: 24, fontWeight: "bold", color: "#1a1a2e" },
	formSubtitle: { fontSize: 15, color: "#666", marginTop: 4, marginBottom: 24 },
	errorBox: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#fff5f5",
		padding: 12,
		borderRadius: 12,
		marginBottom: 16,
	},
	errorText: { color: "#ff3b30", fontSize: 14, flex: 1 },
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#eee",
	},
	inputIcon: { paddingLeft: 16 },
	input: {
		flex: 1,
		padding: 16,
		fontSize: 16,
		color: "#333",
	},
	bioInput: { minHeight: 80, textAlignVertical: "top" },
	submitButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: "#667eea",
		padding: 16,
		borderRadius: 12,
		marginTop: 8,
	},
	submitButtonDisabled: { opacity: 0.6 },
	submitButtonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
	switchButton: { marginTop: 24, alignItems: "center" },
	switchText: { fontSize: 15, color: "#666" },
	switchTextBold: { color: "#667eea", fontWeight: "600" },
});
