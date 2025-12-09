"use client"

import { Post } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function usePostsQuery() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        anon_users!posts_author_id_fkey1 (
          anon_id 
        )
      `)
      .order('created_at', { ascending: false });

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
      author_name: post.anon_users?.anon_id || 'Anonymous',
      content: post.content,
      likesCount: post.like_count || 0,
      isLikedByMe: myLikedPostIds.has(post.id),
      created_at: post.created_at,
      canManagePost: user ? post.author_id === user.id : false,
    }));

    setPosts(formattedPosts);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, refetch: fetchPosts }
}