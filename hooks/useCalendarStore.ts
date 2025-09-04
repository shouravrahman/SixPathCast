
import { create } from 'zustand';
import { posts as mockPosts } from '@/data/mockCalendarData';

const useCalendarStore = create((set) => ({
  posts: mockPosts,
  setPosts: (posts) => set({ posts }),
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    })),
  addPost: (newPost) => set((state) => ({ posts: [...state.posts, newPost] })),
  updatePostScheduleDate: (postId, newDate) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, scheduleDate: newDate.toISOString(), status: 'scheduled' }
          : post
      ),
    })),
}));

export default useCalendarStore;
