import styles from "./WorkItem.module.scss";
import CreateIcon from "../../assets/icons/create.svg";
import TrashIcon from "../../assets/icons/trash.svg";
import { Item } from "src/types/item";
import { EditableCell } from "../EditableCell/EditableCell";
import { useState } from "react";

interface WorkItemProps {
  item: Item;
  isEditMode?: boolean;
}

export function WorkItem({
  item,
  isEditMode: initialEditMode = false,
}: WorkItemProps) {
  const {
    level,
    rowName,
    salary,
    equipmentCosts,
    overheads,
    estimatedProfit,
    parentId,
  } = item;

  const [isEditMode, setIsEditMode] = useState(initialEditMode);

  const onDoubleClick = () => {
    if (!isEditMode) setIsEditMode(true);
  };

  return (
    <div className={styles.wrapper} onDoubleClick={onDoubleClick}>
      <div className={styles.cell}>
        <div className={styles.buttonsWrapper}>
          <button className={styles.createBtn}>
            <CreateIcon />
          </button>
          <button>
            <TrashIcon />
          </button>
        </div>
      </div>

      <EditableCell
        onChange={() => {}}
        value={rowName}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={() => {}}
        value={salary}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={() => {}}
        value={equipmentCosts}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={() => {}}
        value={overheads}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={() => {}}
        value={estimatedProfit}
        isEditMode={isEditMode}
      />
    </div>
  );
}
