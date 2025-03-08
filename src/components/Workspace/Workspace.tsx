import clsx from 'clsx';
import styles from './Workspace.module.scss';
import { WorkItem } from '../WorkItem/WorkItem';
import { Item } from 'src/types/item';
import { useGetItemsQuery } from 'src/store/itemApi';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { produce } from 'immer';
import { treeToArray, createNewItemInstance, findItemInTreeById } from 'src/helpers/itemHelpers';

interface WorkspaceProps {}

export function Workspace({}: WorkspaceProps) {
  const { data: fetchedItemsNodes, isLoading } = useGetItemsQuery();
  const [itemNodes, setItemsNodes] = useState(fetchedItemsNodes || []);

  const { array: items } = useMemo(() => treeToArray(itemNodes), [itemNodes]);

  useEffect(() => {
    if (fetchedItemsNodes) setItemsNodes(fetchedItemsNodes);
  }, [fetchedItemsNodes]);

  useEffect(() => {
    if (!items.length) createLocalChildItem(null, 0);
  }, [items.length]);

  useLayoutEffect(() => {
    const maxLevel = items.reduce(
      (max, { level = 0 }) => (level > max ? level : max),
      0
    );
    document.documentElement.style.setProperty('--maxLevel', maxLevel + '');
  }, [items]);

  const createLocalChildItem = (
    id: Item['id'] | null,
    level: Item['level']
  ) => {
    setItemsNodes((nodes) =>
      produce(nodes, (draft) => {
        if (id) {
          const searchResult = findItemInTreeById(draft, id);
          if (!searchResult) throw `node with id ${id} was not found`;
          const foundNode = searchResult.foundNode;
          foundNode.children.push(createNewItemInstance(id, level));
        } else draft.push(createNewItemInstance(id, level));
      })
    );
  };

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

        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <ul>
            {items.map((item) => {
              return (
                <WorkItem
                  key={item.id}
                  item={item}
                  createChild={createLocalChildItem}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
