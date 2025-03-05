import styles from "./Header.module.scss";
import MenuIcon from "../../assets/icons/menu.svg";
import UndoIcon from "../../assets/icons/undo.svg";
import clsx from "clsx";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.buttons}>
        <button className={styles.button}>
          <MenuIcon />
        </button>
        <button className={styles.button}>
          <UndoIcon />
        </button>
      </div>
      <nav className={styles.nav}>
        <a href="" className={clsx(styles.link, styles.active)}>
          Просмотр
        </a>
        <a href="" className={styles.link}>
          Управление
        </a>
      </nav>
    </div>
  );
}
