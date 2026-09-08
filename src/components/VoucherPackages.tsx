import { settings } from '../routes'
import { formatCzk, voucherServiceId } from '../format'

/**
 * Nabidka darkovych poukazu.
 *
 * `onOrder` dostane hodnotu pro vyber sluzby v rezervacnim formulari; kdyz
 * chybi, tlacitko jen odkazuje na formular. `showHeading` se vypina tam, kde
 * uz nadpis i uvodni text nese hlavicka stranky - jinak by se zopakovaly.
 */
export default function VoucherPackages({
  onOrder,
  showHeading = true
}: {
  onOrder?: (id: string) => void
  showHeading?: boolean
}) {
  // Cena jednoho osetreni bez balicku - proti ni se pocita sleva u vetsich poukazu.
  const basePricePerSession =
    settings.voucherPackages.find((p) => p.count === 1)?.pricePerSession ??
    Math.max(0, ...settings.voucherPackages.map((p) => p.pricePerSession))

  return (
    <>
      <div className="text-center vouchers-intro">
        {showHeading && (
          <>
            <h2>{settings.vouchersTitle}</h2>
            <p>{settings.vouchersIntro}</p>
          </>
        )}
        {settings.vouchersScope && (
          <p className="vouchers-scope">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
              <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>{settings.vouchersScope}</span>
          </p>
        )}
      </div>

      <div className="voucher-grid">
        {settings.voucherPackages.map((pkg) => {
          const total = pkg.count * pkg.pricePerSession
          const saving = basePricePerSession > pkg.pricePerSession
            ? Math.round((1 - pkg.pricePerSession / basePricePerSession) * 100)
            : 0

          return (
            <div
              className={`voucher-card${pkg.highlight ? ' voucher-card-highlight' : ''}`}
              key={`${pkg.count}-${pkg.pricePerSession}`}
            >
              {pkg.highlight && <span className="voucher-badge">{pkg.badge || 'Nejčastější volba'}</span>}

              <div className="voucher-count">
                <span className="voucher-count-num">{pkg.count}×</span>
                <span className="voucher-count-label">ošetření</span>
              </div>

              <h3 className="voucher-title">{pkg.title}</h3>
              <p className="voucher-note">{pkg.note}</p>

              <div className="voucher-pricing">
                <div className="voucher-total">{formatCzk(total)}</div>
                {pkg.count > 1 && (
                  <div className="voucher-per-session">
                    {formatCzk(pkg.pricePerSession)} za ošetření
                    {saving > 0 && <span className="voucher-saving">ušetříte {saving} %</span>}
                  </div>
                )}
              </div>

              <a
                href="#rezervace"
                className={`btn ${pkg.highlight ? 'btn-primary' : 'btn-outline'} voucher-btn`}
                onClick={() => onOrder?.(voucherServiceId(pkg))}
              >
                Objednat poukaz
              </a>
            </div>
          )
        })}
      </div>

      {settings.vouchersNote && (
        <p className="vouchers-fineprint">{settings.vouchersNote}</p>
      )}
    </>
  )
}
