import styles from "./index.module.scss";

export function Footer({ children, title, footerProps = {} }) {
  return (
    <footer className={styles["footer_wrapper"]}>
      <div {...footerProps} className="footer">
        {title}
      </div>
      {children}
    </footer>
  );
}
