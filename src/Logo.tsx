/**
 * Značka NatureLift – didone monogram „N“ v tenkém zlatém kroužku.
 *
 * Vše je vektor bez závislosti na fontu, takže stejné tvary fungují
 * v hlavičce, v patičce i jako favicon (public/favicon.svg).
 * Barvy se berou z CSS proměnných, takže se automaticky přizpůsobí
 * světlému i tmavému režimu.
 */

/** Samotný znak – kroužek s monogramem. */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="52" stroke="var(--accent)" strokeWidth="2" />
      <g fill="currentColor">
        {/* silná diagonála */}
        <path d="M38 34h13l31 52H69z" />
        {/* tenké dříky */}
        <rect x="38" y="34" width="4.2" height="52" />
        <rect x="77.8" y="34" width="4.2" height="52" />
        {/* patky */}
        <rect x="32" y="34" width="16.2" height="2.6" />
        <rect x="32" y="83.4" width="16.2" height="2.6" />
        <rect x="71.8" y="34" width="16.2" height="2.6" />
        <rect x="71.8" y="83.4" width="16.2" height="2.6" />
      </g>
    </svg>
  )
}

/** Celá sestava pro patičku – znak se snítkou a pod ním prostrkaný název. */
export function LogoStacked({ subtitle }: { subtitle: string }) {
  return (
    <div className="logo-stacked">
      <svg width="96" height="112" viewBox="0 0 120 140" fill="none" aria-hidden="true" focusable="false">
        <circle cx="60" cy="60" r="52" stroke="var(--accent)" strokeWidth="2" />
        <g fill="currentColor">
          <path d="M38 34h13l31 52H69z" />
          <rect x="38" y="34" width="4.2" height="52" />
          <rect x="77.8" y="34" width="4.2" height="52" />
          <rect x="32" y="34" width="16.2" height="2.6" />
          <rect x="32" y="83.4" width="16.2" height="2.6" />
          <rect x="71.8" y="34" width="16.2" height="2.6" />
          <rect x="71.8" y="83.4" width="16.2" height="2.6" />
        </g>
        {/* snítka pod kroužkem */}
        <g fill="var(--accent)">
          <path d="M60 124c-4.6-.9-8.3-4.1-9.7-8.3 4.6-1.4 9 .4 10.7 4.2.3.7.4 1.4.4 2z" />
          <path d="M60 124c4.6-.9 8.3-4.1 9.7-8.3-4.6-1.4-9 .4-10.7 4.2-.3.7-.4 1.4-.4 2z" />
        </g>
      </svg>
      <div className="logo-stacked-name">NatureLift</div>
      <div className="logo-stacked-sub">{subtitle}</div>
    </div>
  )
}
