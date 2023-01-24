import { Footer, Header } from "components";
import styles from "./index.module.scss";

export function DefaultLayout({ children }) {
  return (
    <div className={styles["default__wrapper"]}>
      <Header title="Rewards Summary" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
