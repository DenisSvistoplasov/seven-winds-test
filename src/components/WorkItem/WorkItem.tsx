import styles from './WorkItem.module.scss';
import CreateIcon from '../../assets/icons/create.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import { Item, ItemNode } from 'src/types/item';
import { EditableCell } from '../EditableCell/EditableCell';
import {
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from 'src/store/itemApi';
import clsx from 'clsx';

interface WorkItemProps {
  item: Item;
  createChild: (id: Item['id'], level: Item['level']) => void;
}

export function WorkItem({ item, createChild }: WorkItemProps) {
  const [currentItem, setCurrentItem] = useState(item);
  const [isEditMode, setIsEditMode] = useState(item.isCreation);
  const [createItemApi] = useCreateItemMutation();
  const [updateItemApi] = useUpdateItemMutation();
  const [deleteItemApi] = useDeleteItemMutation();
  const buttonsWrapperRef = useRef<HTMLDivElement>(null);
  const {
    id,
    level = 0,
    rowName,
    salary,
    equipmentCosts,
    overheads,
    estimatedProfit,
    parentId,
    isCreation,
    hasChildren,
    descendantsTillLastChild,
  } = currentItem;
  const hasParent = parentId !== null;

  useLayoutEffect(() => {
    if (buttonsWrapperRef.current) {
      buttonsWrapperRef.current.style.setProperty(
        '--descendantsTillLastChild',
        descendantsTillLastChild + ''
      );
    }
  }, [descendantsTillLastChild]);

  useLayoutEffect(() => {
    if (buttonsWrapperRef.current) {
      buttonsWrapperRef.current.style.setProperty('--level', level + '');
    }
  }, [level]);

  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  const createItem = () => createItemApi(currentItem);
  const updateItem = () => updateItemApi(currentItem);
  const accept = isCreation ? createItem : updateItem;

  const onDoubleClick = () => {
    if (!isEditMode) setIsEditMode(true);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentItem !== item) {
      accept();
      setIsEditMode(false);
    }
  };

  const onCreateChildClick = () => {
    if (!isEditMode) createChild(id, level + 1);
  };

  const onDeleteClick = () => deleteItemApi(id);

  const onBlur = (e: FocusEvent) => {
    if (!isCreation && !e.currentTarget.contains(e.relatedTarget)) {

      setIsEditMode(false);
    }
  };

  // Edit cells
  const changeName = (rowName: string) => {
    setCurrentItem((item) => ({ ...item, rowName }));
  };
  const changeSalary = (salary: string) => {
    const value = isFinite(parseInt(salary)) ? parseInt(salary) : item.salary;
    setCurrentItem((item) => ({ ...item, salary: value }));
  };
  const changeEquipmentCosts = (equipmentCosts: string) => {
    const value = isFinite(parseInt(equipmentCosts))
      ? parseInt(equipmentCosts)
      : item.equipmentCosts;
    setCurrentItem((item) => ({ ...item, equipmentCosts: value }));
  };
  const changeOverheads = (overheads: string) => {
    const value = isFinite(parseInt(overheads))
      ? parseInt(overheads)
      : item.overheads;
    setCurrentItem((item) => ({ ...item, overheads: value }));
  };
  const changeEstimatedProfit = (estimatedProfit: string) => {
    const value = isFinite(parseInt(estimatedProfit))
      ? parseInt(estimatedProfit)
      : item.estimatedProfit;
    setCurrentItem((item) => ({ ...item, estimatedProfit: value }));
  };

  return (
    <li
      className={styles.wrapper}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <div className={styles.cell}>
        <div
          className={clsx(
            styles.buttonsWrapper,
            hasParent && styles.hasParent,
            hasChildren && styles.hasChildren
          )}
          ref={buttonsWrapperRef}
        >
          <button className={styles.createBtn} onClick={onCreateChildClick}>
            <CreateIcon />
          </button>
          <button onClick={onDeleteClick}>
            <TrashIcon />
          </button>
        </div>
      </div>

      <EditableCell
        onChange={changeName}
        value={rowName}
        isEditMode={isEditMode}
        autoFocus
      />
      <EditableCell
        onChange={changeSalary}
        value={salary}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={changeEquipmentCosts}
        value={equipmentCosts}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={changeOverheads}
        value={overheads}
        isEditMode={isEditMode}
      />
      <EditableCell
        onChange={changeEstimatedProfit}
        value={estimatedProfit}
        isEditMode={isEditMode}
      />
    </li>
  );
}
