import styles from "./WorkItem.module.scss";
import CreateIcon from "../../assets/icons/create.svg";

export type Item = {
  level: number;
  name: string;
  salary: number;
  equipment: number;
  overhead: number;
  profit: number;
};

interface WorkItemProps {
  item: Item;
  cellClassName: string;
}

export function WorkItem({ item, cellClassName }: WorkItemProps) {
  const {level, name,salary,equipment,overhead,profit} = item
  return (
    <>
      <div className={cellClassName}>
        <div className={styles.iconsWrapper}>
          <CreateIcon />
        </div>
      </div>
      <div className={cellClassName}>{name}</div>
      <div className={cellClassName}>{salary}</div>
      <div className={cellClassName}>{equipment}</div>
      <div className={cellClassName}>{overhead}</div>
      <div className={cellClassName}>{profit}</div>
    </>
  );
}
