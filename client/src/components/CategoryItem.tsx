import React from "react";
import { Category } from "@/app/Record/page";
import { useState } from "react";

type CategoryItemProps = {
  categories: Category[];
  handleCategorySelect: (categoryID: string) => void;
};

const CategoryItem: React.FC<CategoryItemProps> = ({
  categories,
  handleCategorySelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleClick = (categoryId: string) => {
    const newSelectedCategory =
      selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelectedCategory);

    if (newSelectedCategory) {
      handleCategorySelect(newSelectedCategory);
    } else {
      handleCategorySelect("");
    }
  };
  return (
    <div>
      {categories.map((category: any) => (
        <div
          key={category._id}
          className={`hover:bg-indigo-100 p-2 flex gap-3 items-center cursor-pointer ${
            selectedCategory === category._id ? "bg-indigo-200" : ""
          }`}
          onClick={() => handleClick(category._id)}
        >
          <span>
            <img
              src={`http://localhost:3109/${category.icons}`}
              width={30}
              height={30}
              alt={category.title}
            />
          </span>
          <span>{category.title}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryItem;
