import styles from "./EditableCell.module.scss";

interface EditableCellProps {
  value: string | number;
  isEditMode?: boolean;
  onChange: (value: string) => void;
}

export function EditableCell({
  value,
  isEditMode,
  onChange,
}: EditableCellProps) {
  return (
    <div className={styles.wrapper}>
      {isEditMode ? (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className={styles.span}>{value}</span>
      )}
    </div>
  );
}
