function BrandLogo({ className = '', variant = 'default' }) {
  return (
    <span className={`brand-logo brand-logo-${variant} ${className}`.trim()}>
      <img
        src="/paan-logo-official.png"
        alt="PaaN"
        onError={(event) => {
          event.currentTarget.hidden = true
        }}
      />
    </span>
  )
}

export default BrandLogo
