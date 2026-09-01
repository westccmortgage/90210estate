"use client";

import { useMemo, useState } from "react";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

export function PaymentCalculator() {
  const [price, setPrice] = useState(2000000);
  const [down, setDown] = useState(25);
  const [rate, setRate] = useState(6.75);
  const [years, setYears] = useState(30);
  const result = useMemo(() => {
    const principal = Math.max(0, price * (1 - down / 100));
    const n = years * 12;
    const r = rate / 100 / 12;
    const pi = r === 0 ? principal / n : principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tax = price * .0125 / 12;
    const insurance = price * .0035 / 12;
    return { principal, pi, tax, insurance, total: pi + tax + insurance };
  }, [price, down, rate, years]);
  return (
    <div className="calculator">
      <div className="calculator-fields">
        <div className="field full"><label htmlFor="price">Home price</label><input id="price" type="number" min="0" step="50000" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></div>
        <div className="field"><label htmlFor="down">Down payment (%)</label><input id="down" type="number" min="0" max="100" step="1" value={down} onChange={(event) => setDown(Number(event.target.value))} /></div>
        <div className="field"><label htmlFor="rate">Interest rate (%)</label><input id="rate" type="number" min="0" max="25" step=".125" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></div>
        <div className="field full"><label htmlFor="term">Loan term</label><select id="term" value={years} onChange={(event) => setYears(Number(event.target.value))}><option value="30">30 years</option><option value="20">20 years</option><option value="15">15 years</option></select></div>
        <p className="form-note field full">Estimate only. Taxes and insurance use general assumptions; HOA, mortgage insurance, and other costs are not included.</p>
      </div>
      <div className="calculator-result">
        <p className="eyebrow light">Estimated monthly payment</p>
        <p className="amount">{money(result.total)}</p>
        <small>Estimated principal, interest, property tax, and insurance</small>
        <div className="calculator-breakdown">
          <p><span>Loan amount</span><strong>{money(result.principal)}</strong></p>
          <p><span>Principal & interest</span><strong>{money(result.pi)}</strong></p>
          <p><span>Estimated property tax</span><strong>{money(result.tax)}</strong></p>
          <p><span>Estimated insurance</span><strong>{money(result.insurance)}</strong></p>
        </div>
        <a className="button gold" href="https://westcoastcapitalmortgage.com/buy?utm_source=90210estate&utm_medium=referral&utm_campaign=financing_calculator" target="_blank" rel="noreferrer" style={{ marginTop: 24 }}>Review purchase options ↗</a>
      </div>
    </div>
  );
}
