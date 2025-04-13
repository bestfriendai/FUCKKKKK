// WhatToDoAI/web/src/types/category.ts

export interface Category {
  category_id: string;
  name: string;
  description?: string;
  icon?: string; // Icon name or URL
  color?: string; // Color code for UI
  parent_id?: string; // For hierarchical categories
}

export default Category;
