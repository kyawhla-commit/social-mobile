import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withSequence,
	runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { PostType } from "@/types/global";
import { useApp, queryClient } from "@/components/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Card({ post }: { post: PostType }) {
	const { user } = useApp();
	
	// Optimistic state for instant feedback
	const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
	const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
	const [isLiking, setIsLiking] = useState(false);

	// Animation values
	const likeScale = useSharedValue(1);
	const heartScale = useSharedValue(1);

	// Determine actual like state
	const isLiked = optimisticLiked ?? post.likes.some((like) => like.userId === user?.id);
	const likeCount = optimisticCount ?? post.likes.length;

	const animatedLikeStyle = useAnimatedStyle(() => ({
		transform: [{ scale: likeScale.value }],
	}));

	const animatedHeartStyle = useAnimatedStyle(() => ({
		transform: [{ scale: heartScale.value }],
	}));

	const triggerHaptic = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}, []);

	const handleLike = async () => {
		if (!user) {
			Alert.alert("Login Required", "Please login to like posts", [
				{ text: "Cancel", style: "cancel" },
				{ text: "Login", onPress: () => router.push("/(home)/profile") },
			]);
			return;
		}

		if (isLiking) return;
		setIsLiking(true);

		const wasLiked = isLiked;
		const previousCount = likeCount;

		// Optimistic update
		setOptimisticLiked(!wasLiked);
		setOptimisticCount(wasLiked ? previousCount - 1 : previousCount + 1);

		// Animate
		if (!wasLiked) {
			// Like animation - bounce effect
			heartScale.value = withSequence(
				withSpring(1.4, { damping: 4, stiffness: 300 }),
				withSpring(1, { damping: 6, stiffness: 200 })
			);
			likeScale.value = withSequence(
				withSpring(0.8, { damping: 4 }),
				withSpring(1, { damping: 6 })
			);
			runOnJS(triggerHaptic)();
		} else {
			// Unlike animation
			heartScale.value = withSequence(
				withSpring(0.6, { damping: 4 }),
				withSpring(1, { damping: 6 })
			);
		}

		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) throw new Error("Not authenticated");

			const response = await fetch(`${API_BASE_URL}/posts/${post.id}/like`, {
				method: wasLiked ? "DELETE" : "POST",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new Error(wasLiked ? "Failed to unlike" : "Failed to like");
			}

			// Sync with server
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", post.id.toString()] });
			queryClient.invalidateQueries({ queryKey: ["userPosts"] });
		} catch (error) {
			// Revert optimistic update on error
			setOptimisticLiked(wasLiked);
			setOptimisticCount(previousCount);
			const message = error instanceof Error ? error.message : "Something went wrong";
			Alert.alert("Error", message);
		} finally {
			setIsLiking(false);
			// Clear optimistic state after server sync
			setTimeout(() => {
				setOptimisticLiked(null);
				setOptimisticCount(null);
			}, 500);
		}
	};

	const handleDelete = () => {
		Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						const token = await AsyncStorage.getItem("token");
						if (!token) throw new Error("Not authenticated");

						const response = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
							method: "DELETE",
							headers: { Authorization: `Bearer ${token}` },
						});

						if (!response.ok) throw new Error("Failed to delete post");

						queryClient.invalidateQueries({ queryKey: ["posts"] });
						queryClient.invalidateQueries({ queryKey: ["userPosts"] });
					} catch (error) {
						const message = error instanceof Error ? error.message : "Something went wrong";
						Alert.alert("Error", message);
					}
				},
			},
		]);
	};

	// Double tap to like
	const lastTap = useSharedValue(0);
	const handleDoubleTap = () => {
		const now = Date.now();
		if (now - lastTap.value < 300) {
			if (!isLiked) handleLike();
		}
		lastTap.value = now;
	};

	return (
		<Pressable style={styles.card} onPress={handleDoubleTap}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>{post.user.name[0].toUpperCase()}</Text>
					</View>
					<View>
						<Text style={styles.userName}>{post.user.name}</Text>
						<Text style={styles.timestamp}>{post.created}</Text>
					</View>
				</TouchableOpacity>

				{user?.id === post.user.id && (
					<TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
						<Ionicons name="ellipsis-horizontal" size={20} color="#666" />
					</TouchableOpacity>
				)}
			</View>

			{/* Content */}
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => router.push(`/post/${post.id}`)}
			>
				<Text style={styles.content}>{post.content}</Text>
			</TouchableOpacity>

			{/* Actions */}
			<View style={styles.actions}>
				{/* Like Button */}
				<AnimatedPressable
					style={[styles.actionBtn, animatedLikeStyle]}
					onPress={handleLike}
				>
					<Animated.View style={animatedHeartStyle}>
						<Ionicons
							name={isLiked ? "heart" : "heart-outline"}
							size={24}
							color={isLiked ? "#ff2d55" : "#666"}
						/>
					</Animated.View>
					<Text style={[styles.actionText, isLiked && styles.likedText]}>
						{likeCount > 0 ? likeCount : ""}
					</Text>
				</AnimatedPressable>

				{/* Comment Button */}
				<TouchableOpacity
					style={styles.actionBtn}
					onPress={() => router.push(`/post/${post.id}`)}
				>
					<Ionicons name="chatbubble-outline" size={22} color="#666" />
					<Text style={styles.actionText}>
						{post.comments.length > 0 ? post.comments.length : ""}
					</Text>
				</TouchableOpacity>

				{/* Share Button */}
				<TouchableOpacity style={styles.actionBtn}>
					<Ionicons name="share-outline" size={22} color="#666" />
				</TouchableOpacity>

				{/* Bookmark Button */}
				<TouchableOpacity style={styles.actionBtn}>
					<Ionicons name="bookmark-outline" size={22} color="#666" />
				</TouchableOpacity>
			</View>

			{/* Like indicator text */}
			{likeCount > 0 && (
				<Text style={styles.likeIndicator}>
					{likeCount === 1 ? "1 like" : `${likeCount} likes`}
				</Text>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#667eea",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
	userName: {
		fontWeight: "600",
		fontSize: 15,
		color: "#1a1a2e",
	},
	timestamp: {
		color: "#999",
		fontSize: 13,
		marginTop: 2,
	},
	deleteBtn: {
		padding: 8,
	},
	content: {
		fontSize: 15,
		lineHeight: 22,
		color: "#333",
		marginBottom: 12,
	},
	actions: {
		flexDirection: "row",
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#f5f5f5",
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginRight: 8,
	},
	actionText: {
		fontSize: 14,
		color: "#666",
		fontWeight: "500",
	},
	likedText: {
		color: "#ff2d55",
	},
	likeIndicator: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1a1a2e",
		marginTop: 4,
	},
});
