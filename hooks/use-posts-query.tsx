"use client"

import { getCurrentLocation } from "@/lib/geolocation";
import { Post } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function usePostsQuery() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const location = await getCurrentLocation();

    const { data, error } = await supabase.rpc('get_nearby_posts', {
      user_lat: location.lat,
      user_long: location.lng,
      radius_meters: 10000
    })

    if (error || !data) {
      console.error("Error fetching posts:", error);
      return;
    }
    
    let myLikedPostIds = new Set();
    if (user) {
      const {data: likesData} = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id);

        if (likesData) {
          likesData.forEach(like => myLikedPostIds.add(like.post_id));
        }
    }

    const formattedPosts: Post[] = data.map((post: any) => ({
      id: post.id,
      author_id: post.author_id,
      author_name: post.anon_id,
      content: post.content,
      likesCount: post.like_count || 0,
      isLikedByMe: myLikedPostIds.has(post.id),
      created_at: post.created_at,
      canManagePost: user ? post.author_id === user.id : false,
      distance: post.dist_meters
    }));

    setPosts(formattedPosts);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, refetch: fetchPosts }
}