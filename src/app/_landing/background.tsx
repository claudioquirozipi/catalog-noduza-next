import styles from "./background.module.css";

// [posición horizontal %, tamaño px, duración s, retraso s]; mismos valores que el fondo de Angular.
const PARTICLES = [
  [5, 18, 18, 0], [12, 12, 22, 2], [20, 22, 25, 4], [28, 14, 20, 1], [35, 20, 23, 6],
  [42, 10, 19, 3], [50, 16, 24, 8], [58, 14, 21, 10], [65, 10, 26, 5], [72, 18, 20, 7],
  [80, 12, 22, 12], [88, 14, 24, 9], [95, 16, 19, 3.5], [3, 12, 23, 11], [17, 20, 21, 7.5],
  [32, 10, 25, 1.5], [47, 18, 18, 5.5], [62, 14, 22, 13], [77, 22, 26, 0.5], [90, 12, 20, 8.5],
];

// Fondo degradado violeta con partículas, el mismo que usa el panel de Noduza.
export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-linear-to-tr from-violet-300 to-violet-100 dark:from-gray-950 dark:to-violet-950"
    >
      {PARTICLES.map(([left, size, duration, delay]) => (
        <div
          key={left}
          className={styles.particle}
          style={{ left: `${left}%`, width: size, height: size, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
