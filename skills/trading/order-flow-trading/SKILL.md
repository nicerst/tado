---
name: order-flow-trading
description: Analyze chart setups with order flow: footprint, cumulative volume delta, volume profile, imbalances, absorption, and initiative. Use when the user wants deeper confirmation around a level, asks for order flow analysis, or says `/order-flow-trading`, `read the footprint`, or `check CVD`.
---

# Order Flow Trading

Use order flow to confirm who is actually winning at a level. Structure first, order flow second.

## When to use / when NOT to use

Use when:
- The user already has a level, trend, or setup.
- The task is confirmation with footprint, CVD, or volume profile.
- The market has usable volume data, preferably futures, stocks, or major crypto.

Do not use when:
- There is no structural level to analyze.
- The user wants order flow as a standalone magic signal.
- The market data is too thin or unreliable.

## Procedure

1. Start with market structure:
   - Mark obvious support/resistance.
   - Mark breakout levels, pullback zones, and prior volume acceptance/rejection.
2. Use volume profile to locate meaningful price areas:
   - POC = strongest acceptance.
   - Value area = main participation zone.
   - High-volume nodes = slower areas, often magnets.
   - Low-volume nodes = faster travel areas.
3. Use footprint to inspect the candle at the level:
   - Delta shows net aggressive buying vs selling.
   - POC shows where most trading occurred inside the candle.
   - Value area shows where most of the candle’s volume sat.
   - Imbalance = one side trades at least 3x the other diagonally.
4. Read the footprint event:
   - Bullish absorption = aggressive selling fails, candle holds/closes stronger.
   - Bearish absorption = aggressive buying fails, candle holds/closes weaker.
   - Bullish initiative = buying imbalances push price higher and close strong.
   - Bearish initiative = selling imbalances push price lower and close weak.
5. Use CVD for context:
   - Price up + CVD up = healthier continuation.
   - Price down + CVD down = healthier continuation.
   - Divergence warns of exhaustion or hidden absorption.
6. Only take the trade if order flow agrees with structure:
   - Support + bullish absorption/initiation.
   - Resistance + bearish absorption/initiation.
   - Breakout + initiative + strong close + preferably volume expansion.
7. Define trade:
   - Entry at confirmation close or retest.
   - Stop beyond the structural failure point.
   - Target at next structure, 2R, or through a low-volume node into the next acceptance zone.

## Rules / heuristics

- Order flow without context is noise.
- Real levels matter more than clever micro-signals.
- Deep markets absorb more; shallow markets move faster.
- Visible order books can lie: spoofing, layering, iceberg orders, OTC flow.
- Footprint is better for what happened. DOM is weaker for why it will happen.
- Price and delta agreement strengthens continuation.
- Divergence is not entry by itself. It is a warning.
- Use order flow to refine, not to invent, a setup.

## Examples

- Support retest + bullish absorption on footprint + CVD stabilizes = reversal candidate.
- Breakout above obvious resistance + stacked buy imbalances + strong close + rising CVD = continuation candidate.
- Rally into resistance + buy imbalances fail + bearish absorption = fade candidate.

---
Source: Complete Trading Course for 2026 and Beyond - Mind Math Money
