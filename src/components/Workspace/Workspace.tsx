import clsx from "clsx";
import styles from "./Workspace.module.scss";
import { WorkItem } from "../WorkItem/WorkItem";
import { Item, ItemNode } from "src/types/item";
import { useCreateItemMutation, useGetItemsQuery } from "src/store/itemApi";
import { useMemo } from "react";

// const items: Item[] = [
//   {
//     level: 0,
//     rowName: "Южная строительная площадка",
//     salary: 20_348,
//     equipmentCosts: 1_750,
//     overheads: 108.07,
//     estimatedProfit: 1_209_122.5,
//     parentId: 0
//   },
// ];

interface WorkspaceProps {}

export function Workspace({}: WorkspaceProps) {
  const { data: itemNodes = [], isLoading } = useGetItemsQuery();
  const [createItemApi] = useCreateItemMutation();

  const items = useMemo(() => treeToArray(itemNodes), [itemNodes]);

  const createItem = () =>
    createItemApi({
      rowName: "test name" + (Date.now() + "").slice(-3),
      equipmentCosts: 0,
      estimatedProfit: 0,
      level: 0,
      overheads: 0,
      salary: 0,
      parentId: null,
    });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Строительно-монтажные работы</h1>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={clsx(styles.cell, styles.headerCell)}>Уровень</div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Наименование работ
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Основная з/п
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Оборудование
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Накладные расходы
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Сметная прибыль
          </div>
        </div>

        {/* TODO: <ul><li></li></ul> */}
        
        {items?.map((item, index) => (
          <WorkItem item={item} isEditMode={index%2==0} />
        ))}
      </div>

      <button onClick={createItem}>CREATE</button>
    </div>
  );
}

function treeToArray(nodes: ItemNode[]): Item[] {
  const array: Item[] = [];

  nodes.forEach((node) => {
    array.push(node);
    if (node.children.length) array.push(...treeToArray(node.children));
  });

  return array;
}
