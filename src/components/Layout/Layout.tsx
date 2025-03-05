import { Header } from "../Header/Header";
import styles from "./Layout.module.scss";

interface LayoutProps {}

export function Layout({}: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header />
      SideBar Workspace
    </div>
  );
}
