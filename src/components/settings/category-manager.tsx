"use client";

import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { COLOR_PRESETS, EMOJI_ICONS } from "@/constants/indian-states";
import { Trash2, Edit2, Plus, Archive, RotateCcw } from "lucide-react";

interface CategoryManagerProps {
  userId: string;
}

interface NewCategoryForm {
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  parentId: string | null;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ userId }) => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } =
    useCategories(userId);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<NewCategoryForm>({
    name: "",
    type: "expense",
    icon: "💰",
    color: COLOR_PRESETS[0],
    parentId: null,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const expenseCategories = categories.filter(
    (c) => c.type === "expense" && !c.parent_id
  );
  const incomeCategories = categories.filter(
    (c) => c.type === "income" && !c.parent_id
  );

  const handleSaveCategory = async () => {
    if (!form.name.trim()) {
      setToast({
        type: "error",
        message: "Category name is required",
      });
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name,
          icon: form.icon,
          color: form.color,
        });
        setToast({
          type: "success",
          message: "Category updated successfully",
        });
      } else {
        await addCategory({
          name: form.name,
          type: form.type,
          icon: form.icon,
          color: form.color,
          user_id: userId,
        });
        setToast({
          type: "success",
          message: "Category created successfully",
        });
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to save category",
      });
    }
  };

  const handleArchiveCategory = async (id: string, isArchived: boolean) => {
    try {
      await updateCategory(id, {
        is_archived: !isArchived,
      });
      setToast({
        type: "success",
        message: isArchived ? "Category restored" : "Category archived",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to update category",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);
      setToast({
        type: "success",
        message: "Category deleted successfully",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to delete category",
      });
    }
  };

  const handleEditCategory = (category: any) => {
    setForm({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      parentId: category.parent_id,
    });
    setEditingId(category.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "expense",
      icon: "💰",
      color: COLOR_PRESETS[0],
      parentId: null,
    });
    setEditingId(null);
  };

  const CategoryList = ({ categories, type }: any) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {type === "expense" ? "Expense Categories" : "Income Categories"} (
        {categories.length})
      </h3>
      <div className="space-y-2">
        {categories.map((category: any) => (
          <div
            key={category.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              "hover:bg-gray-50 dark:hover:bg-gray-900/50",
              category.is_archived
                ? "bg-gray-100 dark:bg-gray-900/30 opacity-60"
                : ""
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">{category.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </p>
                  {category.is_archived && (
                    <Badge variant="secondary" className="text-xs">
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditCategory(category)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  handleArchiveCategory(category.id, category.is_archived)
                }
                className="h-8 w-8 p-0"
              >
                {category.is_archived ? (
                  <RotateCcw className="w-4 h-4" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteCategory(category.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No {type === "expense" ? "expense" : "income"} categories
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Manage Categories</h2>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <div className="space-y-6">
          <CategoryList categories={expenseCategories} type="expense" />
          <div className="border-t dark:border-gray-800" />
          <CategoryList categories={incomeCategories} type="income" />
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingId ? "Edit Category" : "Add New Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Groceries"
            />
          </div>

          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <Select
                value={form.type}
                onChange={(value) =>
                  setForm({ ...form, type: value as "income" | "expense" })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon Emoji
            </label>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full justify-between"
              >
                <span className="text-2xl">{form.icon}</span>
                <span className="text-xs text-gray-500">Click to change</span>
              </Button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 grid grid-cols-6 gap-2">
                  {EMOJI_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setForm({ ...form, icon: emoji });
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full justify-between"
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: form.color }}
                />
                <span className="text-xs text-gray-500">{form.color}</span>
              </Button>
              {showColorPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 grid grid-cols-5 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setForm({ ...form, color });
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} className="flex-1">
              {editingId ? "Update" : "Create"} Category
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
