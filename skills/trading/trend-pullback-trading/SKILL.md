---
name: trend-pullback-trading
description: Build a rule-based discretionary trade plan using market structure, trend pullbacks, obvious support/resistance, price action confirmation, and fixed risk. Use when the user wants a chart-based trade setup, asks for a trend-following entry plan, or says `/trend-pullback-trading`, `analyze this chart`, or `find a pullback trade`.
---

# Trend Pullback Trading

Trade with the trend. Enter on pullbacks into obvious levels. Risk small.

## When to use / when NOT to use

Use when:
- The task is discretionary chart analysis.
- The market has readable structure: uptrend, downtrend, or clean range.
- The user wants entries, stops, targets, or setup review.

Do not use when:
- The market is news-driven, illiquid, or structurally messy.
- The user wants fundamental investing, macro research, or automated execution code.
- The only rationale is an indicator signal in the middle of nowhere.

## Procedure

1. Start on the higher timeframe. Label market state first:
   - Uptrend = higher highs + higher lows.
   - Downtrend = lower highs + lower lows.
   - Range = highs and lows holding roughly the same zone.
2. Mark only obvious levels:
   - Major support/resistance zones.
   - Strong highs/lows that caused break of structure.
   - Optional confluence: volume-profile POC, value area edges, obvious high-volume nodes.
3. Pick direction:
   - Prefer trading with trend.
   - Reversal trades need a major level plus clear failure signal.
4. Wait for price to reach a decision zone:
   - Pullback into support in an uptrend.
   - Pullback into resistance in a downtrend.
   - Breakout retest only if the breakout level was obvious.
5. Require confirmation before entry:
   - Bullish at support: hammer, bullish engulfing, momentum close up, bullish absorption/initiation.
   - Bearish at resistance: shooting star, bearish engulfing, momentum close down, bearish absorption/initiation.
   - Breakouts need a momentum candle, clear close beyond level, and preferably strong volume.
6. Define the trade before entry:
   - Entry: candle close of confirmation or breakout/retest trigger.
   - Stop: beyond the invalidation point, usually beyond the wick/structure extreme.
   - Target: fixed risk/reward, measured move, or next major structure zone.
   - Size: default to small fixed risk, usually 0.5% to 1% of account.
7. Reject the setup if any piece is missing:
   - No obvious level.
   - No clean confirmation.
   - Stop is too wide for the target.
   - Market is choppy.
8. After the trade, review process:
   - Did the setup match the rules?
   - Did execution follow plan?
   - Was the loss/profit structurally justified?

## Rules / heuristics

- Do nothing is a valid trade decision.
- One trade means nothing. Process over outcome.
- Trade obvious levels only. If the level is debatable, skip it.
- Clean trends beat messy transitions.
- Simple pullbacks are better than complex chop.
- Healthy pullbacks often retrace roughly 0.382 to 0.618. Strong trends can stay shallower.
- Break of structure confirms continuation. Change of character is only an early warning.
- Weak highs/lows are more likely to get taken; strong highs/lows matter more.
- When price and delta agree, continuation is stronger. When they diverge, reversal risk rises.
- Use order flow as confirmation, not as a standalone reason to trade.
- Losses are business expense. Oversizing is the real mistake.

## Examples

- Uptrend -> pullback into prior breakout support -> hammer or bullish engulfing -> enter at close -> stop below wick -> target at 2R or next resistance.
- Downtrend -> rally into resistance -> bearish engulfing or shooting star -> enter at close -> stop above structure -> target at 2R or next support.
- Obvious multi-touch resistance -> breakout with momentum + volume -> retest holds -> enter continuation.

---
Source: Complete Trading Course for 2026 and Beyond - Mind Math Money
