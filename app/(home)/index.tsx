import { ScrollView, View, Text, RefreshControl, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import Card from "@/components/card";
import { PostType } from "@/types/global";
import { API_BASE_URL } from "@/config";
import { queryClient } from "@/components/AppProvider";

async function fetchPosts() {
	const res = await fetch(`${API_BASE_URL}/posts`);
	return res.json();
}

export default function Home() {
	const [refreshing, setRefreshing] = useState(false);

	const { data: posts, isLoading, error } = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries({ queryKey: ["posts"] });
		setRefreshing(false);
	}, []);

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>{error.message}</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.center}>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (!posts || posts.length === 0) {
		return (
			<ScrollView
				contentContainerStyle={styles.center}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<Text style={styles.emptyText}>No posts yet</Text>
				<Text style={styles.emptySubtext}>Pull down to refresh</Text>
			</ScrollView>
		);
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{(posts as PostType[]).map((post) => (
				<Card post={post} key={post.id} />
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "red",
		fontSize: 16,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#666",
	},
	emptySubtext: {
		fontSize: 14,
		color: "#999",
		marginTop: 8,
	},
});
