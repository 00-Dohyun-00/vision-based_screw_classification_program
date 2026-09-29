export default function QuantityInput({ value, onChange, label }) {
  function step(amount) {
    const parsed = Number.parseInt(value, 10)
    const current = Number.isFinite(parsed) ? Math.max(0, parsed) : 0
    onChange(String(Math.max(0, current + amount)))
  }

  return (
    <div className="quantity-input">
      <button type="button" aria-label={`${label} 수량 감소`} onClick={() => step(-1)}>-</button>
      <input
        type="number"
        min="0"
        aria-label={`${label} 수량`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" aria-label={`${label} 수량 증가`} onClick={() => step(1)}>+</button>
    </div>
  )
}
