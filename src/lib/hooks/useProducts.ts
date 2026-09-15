import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../api/products.service';

export const useProducts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await productsService.getProducts(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch products');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await productsService.getProduct(id);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch product');
      }
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => productsService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
