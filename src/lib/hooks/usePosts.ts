import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { postsService } from '../api/posts.service';
import { parseApiError } from '../utils/errorHandler';

export const usePosts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const res = await postsService.getPosts(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch posts');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // keep previous page visible while next page loads
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await postsService.getPost(slug);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch post');
      }
      return res.data;
    },
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => {
      console.error(parseApiError(err));
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => postsService.updatePost(id, data),
    onSuccess: () => {
      // Invalidate all post queries (list + any individual post by slug or id)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsService.publishPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsService.unpublishPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
