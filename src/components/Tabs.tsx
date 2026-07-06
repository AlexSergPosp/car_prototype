import { CATEGORIES } from "../data";

interface TabsProps {
  active: number;
  onChange: (index: number) => void;
}

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="tabs level-tabs" aria-label="Уровни бизнесов">
      {CATEGORIES.map((category, index) => (
        <button className={active === index ? "tab active" : "tab"} key={category.name} onClick={() => onChange(index)}>
          <span className="tab-level">Ур. {index + 1}</span>
          <span className="tab-stars">{category.icon}</span>
        </button>
      ))}
    </nav>
  );
}
