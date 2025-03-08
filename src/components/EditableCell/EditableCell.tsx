import styles from './EditableCell.module.scss';

interface EditableCellProps {
  value: string | number;
  isEditMode?: boolean;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function EditableCell({
  value,
  isEditMode,
  onChange,
  autoFocus,
}: EditableCellProps) {
  return (
    <div className={styles.wrapper}>
      {isEditMode ? (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
        />
      ) : (
        <span className={styles.span}>{value}</span>
      )}
    </div>
  );
}
