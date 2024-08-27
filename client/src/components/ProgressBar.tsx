import { FC } from "react";

interface ProgressBarProps {
  categoryId: string;
  budgetAmount: number;
  totalExpenses: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ budgetAmount, totalExpenses }) => {
  const progressPercentage = Math.min(
    (totalExpenses / budgetAmount) * 100,
    100
  );

  return (
    <div className="relative pt-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Spent: ${totalExpenses.toFixed(2)}
        </span>
        <span className="text-sm font-medium">
          Budget: ${budgetAmount.toFixed(2)}
        </span>
      </div>
      <div className="flex h-4 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-medium">
          {progressPercentage.toFixed(2)}%
        </span>
        {progressPercentage >= 100 && (
          <span className="text-xs font-medium text-red-500">Overspent</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
