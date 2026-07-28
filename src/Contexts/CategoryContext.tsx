import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './api/axios';

interface Category {
  id: string;
  name: string;
  menuItems?: any[];
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: (restaurantId?: string) => Promise<void>;
  createCategory: (data: { id?: string; name: string }) => Promise<void>;
  updateCategory: (id: string, data: { name: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Chache tout kategori yo (ou ka pase restaurantId si w vle filtre)
  const fetchCategories = async (restaurantId?: string) => {
    try {
      setLoading(true);
      const url = restaurantId ? `/categories?restaurantId=${restaurantId}` : '/categories';
      const response = await api.get<Category[]>(url);
      setCategories(response.data);
    } catch (error: any) {
      console.error("Erè pandan y ap chache kategori yo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Kreye yon nouvo kategori
  const createCategory = async (data: { id?: string; name: string }) => {
    try {
      setLoading(true);
      const response = await api.post<Category>('/categories', data);
      setCategories((prev) => [...prev, response.data]);
    } catch (error: any) {
      console.error("Erè pandan y ap kreye kategori a:", error);
      throw error.response?.data || { message: "Erè nan kreye kategori a." };
    } finally {
      setLoading(false);
    }
  };

  // 3. Mete ajou yon kategori
  const updateCategory = async (id: string, data: { name: string }) => {
    try {
      setLoading(true);
      const response = await api.patch<Category>(`/categories/${id}`, data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
    } catch (error: any) {
      console.error("Erè pandan y ap modifye kategori a:", error);
      throw error.response?.data || { message: "Erè nan modifye kategori a." };
    } finally {
      setLoading(false);
    }
  };

  // 4. Efase yon kategori
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error: any) {
      console.error("Erè pandan y ap efase kategori a:", error);
      throw error.response?.data || { message: "Erè nan efase kategori a." };
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory dwe itilize anndan yon CategoryProvider");
  }
  return context;
};