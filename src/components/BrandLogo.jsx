function BrandLogo({ className = '', variant = 'default' }) {
  return (
    <span className={`brand-logo brand-logo-${variant} ${className}`.trim()}>
      <img
        src="/Gemini_Generated_Image_zewn94zewn94zewn.png"
        alt="PaaN"
        onError={(event) => {
          event.currentTarget.hidden = true
        }}
      />
    </span>
  )
}

export default BrandLogo
