import clsx from "clsx";
import styles from "./Workspace.module.scss";
import { WorkItem } from "../WorkItem/WorkItem";

const items = [
  {
    level: 0,
    name:'Южная строительная площадка',
    salary:20_348,
    equipment:1_750,
    overhead:108.07,
    profit:1_209_122.5,
  }
]

interface WorkspaceProps {}

export function Workspace({}: WorkspaceProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Строительно-монтажные работы</h1>
      </div>

      <div className={styles.table}>
        {/* <div className={styles.tableHeader}> */}
          <div className={clsx(styles.cell, styles.headerCell)}>Уровень</div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Наименование работ
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>Основная з/п</div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Оборудование
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Накладные расходы
          </div>
          <div className={clsx(styles.cell, styles.headerCell)}>
            Сметная прибыль
          </div>
        {/* </div> */}

        {/* <div className={styles.tableRow}> */}
          {/* <div className={clsx(styles.cell)}><div className={styles.iconsWrapper}><CreateIcon/></div></div>
          <div className={clsx(styles.cell)}>
          Южная строительная площадка
          </div>
          <div className={clsx(styles.cell)}>20 348</div>
          <div className={clsx(styles.cell)}>
            1 750
          </div>
          <div className={clsx(styles.cell)}>
            108,07
          </div>
          <div className={clsx(styles.cell)}>
            1 209 122,5
          </div> */}
        {/* </div> */}
        {items.map(item => <WorkItem item={item} cellClassName={styles.cell} />)}
      </div>
    </div>
  );
}
