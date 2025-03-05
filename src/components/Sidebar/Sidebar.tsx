import styles from "./Sidebar.module.scss";
import CaretDownIcon from "../../assets/icons/caret-down.svg";
import ProjectIcon from "../../assets/icons/project.svg";
import clsx from "clsx";

const items = [
  { name: "По проекту", isActive: false },
  { name: "Объекты", isActive: false },
  { name: "РД", isActive: false },
  { name: "МТО", isActive: false },
  { name: "СМР", isActive: true },
  { name: "График", isActive: false },
  { name: "МиМ", isActive: false },
  { name: "Рабочие", isActive: false },
  { name: "Капвложения", isActive: false },
  { name: "Бюджет", isActive: false },
  { name: "Финансирование", isActive: false },
  { name: "Панорамы", isActive: false },
  { name: "Камеры", isActive: false },
  { name: "Поручения", isActive: false },
  { name: "Контрагенты", isActive: false },
].map((item, index) => ({ ...item, id: index }));

interface SidebarProps {}

export function Sidebar({}: SidebarProps) {
  return (
    <div className={styles.wrapper}>
      <button className={styles.select}>
        <div className={styles.title}>Название проекта</div>
        <div className={styles.subtitle}>Аббревиатура</div>
        <CaretDownIcon className={styles.caretIcon} />
      </button>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <button
              className={clsx(styles.itemButton, item.isActive && styles.active)}
            >
              <ProjectIcon />
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
