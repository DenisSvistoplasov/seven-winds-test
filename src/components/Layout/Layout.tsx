import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import { Workspace } from "../Workspace/Workspace";
import styles from "./Layout.module.scss";

interface LayoutProps {}

export function Layout({}: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Sidebar />
      <Workspace />
    </div>
  );
}
